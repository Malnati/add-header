// tools/openrouter/add-headers-pr.ts
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, sep } from 'node:path';
import ignore from 'ignore';
import { request } from 'undici';

const ROOT = execSync('git rev-parse --show-toplevel').toString().trim();
const BASE = process.env.PR_BASE_SHA ?? 'origin/HEAD~1';
const HEAD = process.env.PR_HEAD_SHA ?? 'HEAD';

const ALLOWED = [
  '.ts', '.tsx', '.js', '.jsx', '.md', '.yaml', '.yml', '.mdc', '.sh', '.bash', '.zsh', 'Makefile'
];

function listChangedFiles(): string[] {
  const out = execSync(`git diff --name-only --diff-filter=ACMRT ${BASE}..${HEAD}`).toString().split('\n').filter(Boolean);
  return out.filter(p => {
    if (p.includes('/node_modules/')) return false;
    if (p.startsWith('.git/')) return false;
    if (p.endsWith('.png') || p.endsWith('.jpg') || p.endsWith('.jpeg') || p.endsWith('.svg') || p.endsWith('.ico') || p.endsWith('.gif') || p.endsWith('.pdf')) return false;
    if (p.endsWith('.map') || p.endsWith('.lock')) return false;
    const isMakefile = p.split('/').pop() === 'Makefile';
    if (isMakefile) return true;
    return ALLOWED.some(ext => p.endsWith(ext));
  });
}

function loadIgnore(): (path: string) => boolean {
  const addHeaderPath = join(ROOT, '.addheader');
  if (!existsSync(addHeaderPath)) {
    const ig = ignore();
    return (p: string) => ig.ignores(p);
  }
  const patterns = readFileSync(addHeaderPath, 'utf8');
  const ig = ignore().add(patterns.split('\n'));
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
  const prompt = [
    'Aja como formatador idempotente.',
    'Se já houver cabeçalho correto de caminho relativo na primeira linha (após shebang quando existir), retorne o conteúdo inalterado.',
    'Se não houver, insira exatamente um cabeçalho com o caminho relativo informado, obedecendo a sintaxe da linguagem.',
    'Nunca adicione comentários extras, não altere nada além do cabeçalho.',
    `Caminho: ${rel.split(sep).join('/')}`,
    'Conteúdo atual:',
    '```',
    content,
    '```'
  ].join('\n');

  const res = await request('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://github.com/',
      'X-Title': 'add-header-pr'
    },
    body: JSON.stringify({
      model: 'deepseek/deepseek-coder',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0
    })
  });

  const json: any = await res.body.json();
  const txt = json?.choices?.[0]?.message?.content ?? '';
  if (!txt) return target;
  return txt;
}

async function main() {
  const ignores = loadIgnore();
  const changed = listChangedFiles().filter(p => !ignores(p));
  let edits = 0;

  for (const rel of changed) {
    const abs = join(ROOT, rel);
    if (!existsSync(abs)) continue;
    const original = readFileSync(abs, 'utf8');
    if (hasHeader(rel, original)) continue;

    const { header, insertAt } = expectedHeader(rel, original);
    const next = original.slice(0, insertAt) + header + original.slice(insertAt);
    const maybe = await viaOpenRouter(rel, original, next);

    if (maybe !== original) {
      writeFileSync(abs, maybe, 'utf8');
      execSync(`git add "${rel}"`);
      edits++;
    }
  }

  if (edits === 0) {
    console.log('Nenhuma alteração necessária nos arquivos do PR.');
  } else {
    console.log(`Arquivos atualizados: ${edits}.`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
