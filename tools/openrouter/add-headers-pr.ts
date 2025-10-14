
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, sep } from 'node:path';
import ignore from 'ignore';
import { request } from 'undici';

const ROOT = execSync('git rev-parse --show-toplevel').toString().trim();
const BASE = process.env.PR_BASE_SHA ?? 'origin/HEAD~1';
const HEAD = process.env.PR_HEAD_SHA ?? 'HEAD';
const CONFIG_FILENAME = 'addheader.json';

type InsertMode = 'start' | 'afterShebang';
type HeaderAction = 'add' | 'skip';

type RawDetection =
  | { type: 'startsWith'; value?: string }
  | { type: 'includes'; value: string }
  | { type: 'withinFirstLines'; value: string; lines?: number }
  | { type: 'regex'; value: string; flags?: string };

type NormalizedDetection =
  | { type: 'startsWith'; value?: string }
  | { type: 'includes'; value: string }
  | { type: 'withinFirstLines'; value: string; lines: number }
  | { type: 'regex'; value: string; flags?: string };

interface RuleConfig {
  extensions?: string[];
  filenames?: string[];
  template?: string | string[];
  insert?: InsertMode;
  detect?: RawDetection | RawDetection[];
  action?: HeaderAction;
}

interface HeaderFileConfig {
  default: RuleConfig;
  rules?: RuleConfig[];
}

interface ResolvedRule {
  template?: string | string[];
  insert: InsertMode;
  action: HeaderAction;
  detect?: NormalizedDetection[];
}

interface PreparedHeader {
  header: string;
  insertAt: number;
  rule: ResolvedRule;
  path: string;
}

const headerConfigCache = new Map<string, HeaderFileConfig>();

export function listChangedFiles({
  base = BASE,
  head = HEAD,
  cwd = ROOT
}: { base?: string; head?: string; cwd?: string } = {}): string[] {
  const out = execSync(`git diff --name-only --diff-filter=ACMRT ${base}..${head}`, { cwd })
    .toString()
    .split('\n')
    .filter(Boolean);
  return out;
}

export function loadIgnore(root: string = ROOT): (path: string) => boolean {
  const candidates = ['.addheaderignore', '.addheader'];
  for (const file of candidates) {
    const addHeaderPath = join(root, file);
    if (!existsSync(addHeaderPath)) continue;
    const patterns = readFileSync(addHeaderPath, 'utf8');
    const ig = ignore().add(patterns);
    return (p: string) => ig.ignores(p.replace(/\\/g, '/'));
  }
  const ig = ignore();
  return (p: string) => ig.ignores(p.replace(/\\/g, '/'));
}

function loadHeaderConfig(root: string = ROOT): HeaderFileConfig {
  const cached = headerConfigCache.get(root);
  if (cached) return cached;

  const configPath = join(root, CONFIG_FILENAME);
  if (!existsSync(configPath)) {
    throw new Error(`Arquivo de configuração ${CONFIG_FILENAME} não encontrado em ${root}.`);
  }

  const raw = readFileSync(configPath, 'utf8');
  const parsed = JSON.parse(raw);

  if (!parsed || typeof parsed !== 'object' || !parsed.default || typeof parsed.default !== 'object') {
    throw new Error(`Conteúdo inválido em ${CONFIG_FILENAME}.`);
  }

  const config: HeaderFileConfig = {
    default: parsed.default as RuleConfig,
    rules: Array.isArray(parsed.rules) ? (parsed.rules as RuleConfig[]) : []
  };

  headerConfigCache.set(root, config);
  return config;
}

function normalizeDetections(detect?: RawDetection | RawDetection[]): NormalizedDetection[] | undefined {
  if (!detect) return undefined;
  const arr = Array.isArray(detect) ? detect : [detect];
  return arr.map(d => {
    switch (d.type) {
      case 'startsWith':
        return { type: 'startsWith', value: d.value };
      case 'includes':
        return { type: 'includes', value: d.value };
      case 'withinFirstLines':
        return { type: 'withinFirstLines', value: d.value, lines: d.lines ?? 2 };
      case 'regex':
        return { type: 'regex', value: d.value, flags: d.flags };
      default:
        throw new Error(`Tipo de detecção desconhecido: ${(d as { type: string }).type}`);
    }
  });
}

function fileExtension(rel: string): string {
  const normalized = rel.replace(/\\/g, '/');
  const name = normalized.split('/').pop() ?? normalized;
  const lower = name.toLowerCase();
  const dot = lower.lastIndexOf('.');
  if (dot === -1 || dot === lower.length - 1) return '';
  return lower.slice(dot + 1);
}

function matchesRule(rule: RuleConfig, rel: string): boolean {
  const normalized = rel.replace(/\\/g, '/');
  const name = normalized.split('/').pop() ?? normalized;
  const lowerName = name.toLowerCase();

  if (rule.filenames?.some(candidate => candidate === name || candidate.toLowerCase() === lowerName)) {
    return true;
  }

  if (!rule.extensions || rule.extensions.length === 0) {
    return false;
  }

  const ext = fileExtension(rel);
  for (const candidate of rule.extensions) {
    const lowered = candidate.toLowerCase();
    if (lowered === '*') return true;
    if (lowered.startsWith('.')) {
      if (lowerName.endsWith(lowered)) return true;
    } else if (ext === lowered) {
      return true;
    }
  }

  return false;
}

function resolveRule(rel: string, config: HeaderFileConfig): ResolvedRule {
  const base = config.default ?? {};
  const matched = config.rules?.find(rule => matchesRule(rule, rel));
  const detectSource = matched?.detect ?? base.detect;
  return {
    template: matched?.template ?? base.template,
    insert: matched?.insert ?? base.insert ?? 'start',
    action: matched?.action ?? base.action ?? 'add',
    detect: normalizeDetections(detectSource)
  };
}

function applyPlaceholders(value: string, context: { path: string; header: string }): string {
  return value.replace(/\{path\}/g, context.path).replace(/\{header\}/g, context.header);
}

function renderTemplate(template: string | string[], path: string): string {
  const raw = Array.isArray(template) ? template.join('\n') : template;
  return raw.replace(/\{path\}/g, path);
}

function prepareHeader(rel: string, content: string, config: HeaderFileConfig): PreparedHeader {
  const rule = resolveRule(rel, config);
  const path = rel.split(sep).join('/');

  if (rule.action === 'skip') {
    return { header: '', insertAt: 0, rule, path };
  }

  if (!rule.template) {
    throw new Error(`Nenhum template configurado para o arquivo ${rel}.`);
  }

  const header = renderTemplate(rule.template, path);
  let insertAt = 0;

  if (rule.insert === 'afterShebang' && content.startsWith('#!')) {
    const firstNL = content.indexOf('\n');
    insertAt = firstNL === -1 ? content.length : firstNL + 1;
  }

  return { header, insertAt, rule, path };
}

function headerAlreadyPresent(content: string, prepared: PreparedHeader): boolean {
  if (prepared.rule.action === 'skip') return true;

  const { rule, header, insertAt, path } = prepared;
  const detections = rule.detect;

  if (!detections || detections.length === 0) {
    return content.slice(insertAt).startsWith(header);
  }

  const context = { path, header };

  return detections.every(det => {
    switch (det.type) {
      case 'startsWith': {
        const target = det.value ? applyPlaceholders(det.value, context) : header;
        if (det.value) {
          return content.startsWith(target);
        }
        return content.slice(insertAt).startsWith(target);
      }
      case 'includes': {
        const target = applyPlaceholders(det.value, context);
        return content.includes(target);
      }
      case 'withinFirstLines': {
        const target = applyPlaceholders(det.value, context);
        const firstLines = content.split('\n').slice(0, det.lines).join('\n');
        return firstLines.includes(target);
      }
      case 'regex': {
        const pattern = applyPlaceholders(det.value, context);
        const regexp = new RegExp(pattern, det.flags);
        return regexp.test(content);
      }
      default:
        return false;
    }
  });
}

async function viaOpenRouter(rel: string, content: string, target: string): Promise<string> {
  const token = process.env.OPENROUTER_TOKEN;
  if (!token || process.env.USE_OPENROUTER !== 'true') return target;
  const res = await request('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://github.com/',
      'X-Title': 'add-header-pr'
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-3.2-1b-instruct',
      messages: [
        {
          role: 'system',
          content: 'Return the full file exactly as output. Ensure the first line is the relative path comment using the language syntax, unless a shebang must stay first.'
        },
        {
          role: 'user',
          content: `path=${rel.split(sep).join('/')}\n${content}`
        }
      ],
      temperature: 0,
      max_tokens: content.length + 32
    })
  });

  const json: any = await res.body.json();
  const txt = json?.choices?.[0]?.message?.content ?? '';
  if (!txt) return target;
  return txt;
}

export async function run({
  root = ROOT,
  base = BASE,
  head = HEAD,
  changedFiles
}: { root?: string; base?: string; head?: string; changedFiles?: string[] } = {}): Promise<number> {
  const ignores = loadIgnore(root);
  const config = loadHeaderConfig(root);
  const changed = (changedFiles ?? listChangedFiles({ base, head, cwd: root })).filter(p => !ignores(p));
  let edits = 0;

  for (const rel of changed) {
    const abs = join(root, rel);
    if (!existsSync(abs)) continue;
    const original = readFileSync(abs, 'utf8');
    const prepared = prepareHeader(rel, original, config);
    if (headerAlreadyPresent(original, prepared)) continue;

    const next = original.slice(0, prepared.insertAt) + prepared.header + original.slice(prepared.insertAt);
    const maybe = await viaOpenRouter(rel, original, next);

    if (maybe !== original) {
      writeFileSync(abs, maybe, 'utf8');
      execSync(`git add "${rel}"`, { cwd: root });
      edits++;
    }
  }

  return edits;
}

export async function main() {
  const edits = await run();
  if (edits === 0) {
    console.log('Nenhuma alteração necessária nos arquivos do PR.');
  } else {
    console.log(`Arquivos atualizados: ${edits}.`);
  }
}

if (require.main === module) {
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
