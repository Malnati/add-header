
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, sep } from 'node:path';
import ignore from 'ignore';
import { request } from 'undici';

const ROOT = execSync('git rev-parse --show-toplevel').toString().trim();
const BASE = process.env.PR_BASE_SHA ?? 'origin/HEAD~1';
const HEAD = process.env.PR_HEAD_SHA ?? 'HEAD';

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
    const ig = ignore().add(patterns.split('\n'));
    return (p: string) => ig.ignores(p);
  }
  const ig = ignore();
  return (p: string) => ig.ignores(p);
}

function expectedHeader(rel: string, content: string): { header: string; insertAt: number } {
  const unixPath = rel.split(sep).join('/');
  if (rel.endsWith('.ts') || rel.endsWith('.tsx') || rel.endsWith('.js') || rel.endsWith('.jsx')) {
    return { header: `// ${unixPath}\n`, insertAt: 0 };
  }
  if (rel.endsWith('.yaml') || rel.endsWith('.yml')) {
    return { header: `# ${unixPath}\n`, insertAt: 0 };
  }
  if (rel.endsWith('.md')) {
    return { header: `<!-- ${unixPath} -->\n\n`, insertAt: 0 };
  }
  if (rel.endsWith('.mdc')) {
    const block = [
      '---',
      'description: |',
      `  \`// ${unixPath}\``,
      '  ... restante da descrição ...',
      '',
      "globs: ['*']",
      'alwaysApply: true',
      '---',
      ''
    ].join('\n');
    return { header: `${block}\n`, insertAt: 0 };
  }
  if (rel.split('/').pop() === 'Makefile') {
    return { header: `# ${unixPath}\n`, insertAt: 0 };
  }
  if (rel.endsWith('.sh') || rel.endsWith('.bash') || rel.endsWith('.zsh')) {
    const hasShebang = content.startsWith('#!');
    if (hasShebang) {
      const firstNL = content.indexOf('\n');
      return { header: `# ${unixPath}\n`, insertAt: firstNL + 1 };
    }
    return { header: `# ${unixPath}\n`, insertAt: 0 };
  }
  return { header: `# ${unixPath}\n`, insertAt: 0 };
}

function hasHeader(rel: string, content: string): boolean {
  const unixPath = rel.split(sep).join('/');
  if (rel.endsWith('.md')) return content.startsWith(`<!-- ${unixPath} -->`);
  if (rel.endsWith('.yaml') || rel.endsWith('.yml')) return content.startsWith(`# ${unixPath}`);
  if (rel.endsWith('.mdc')) return content.startsWith('---') && content.includes(`\`// ${unixPath}\``);
  if (rel.split('/').pop() === 'Makefile') return content.startsWith(`# ${unixPath}`);
  if (rel.endsWith('.sh') || rel.endsWith('.bash') || rel.endsWith('.zsh')) {
    const firstTwo = content.split('\n').slice(0, 2).join('\n');
    return firstTwo.includes(`# ${unixPath}`);
  }
  return content.startsWith(`// ${unixPath}`);
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
  const changed = (changedFiles ?? listChangedFiles({ base, head, cwd: root })).filter(p => !ignores(p));
  let edits = 0;

  for (const rel of changed) {
    const abs = join(root, rel);
    if (!existsSync(abs)) continue;
    const original = readFileSync(abs, 'utf8');
    if (hasHeader(rel, original)) continue;

    const { header, insertAt } = expectedHeader(rel, original);
    const next = original.slice(0, insertAt) + header + original.slice(insertAt);
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
