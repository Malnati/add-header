import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { loadIgnore, run } from './add-headers-pr';

describe('loadIgnore', () => {
  test('uses .addheaderignore when available', () => {
    const dir = mkdtempSync(join(tmpdir(), 'add-header-ignore-'));
    try {
      writeFileSync(join(dir, '.addheaderignore'), 'ignored.txt\n');
      const ignores = loadIgnore(dir);
      assert.equal(ignores('ignored.txt'), true);
      assert.equal(ignores('other.ts'), false);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('falls back to .addheader when .addheaderignore is absent', () => {
    const dir = mkdtempSync(join(tmpdir(), 'add-header-fallback-'));
    try {
      writeFileSync(join(dir, '.addheader'), 'fallback.txt\n');
      const ignores = loadIgnore(dir);
      assert.equal(ignores('fallback.txt'), true);
      assert.equal(ignores('other.ts'), false);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('.addheaderignore takes precedence over .addheader', () => {
    const dir = mkdtempSync(join(tmpdir(), 'add-header-precedence-'));
    try {
      writeFileSync(join(dir, '.addheaderignore'), 'only-this.txt\n');
      writeFileSync(join(dir, '.addheader'), '*.ts\n');
      const ignores = loadIgnore(dir);
      assert.equal(ignores('only-this.txt'), true);
      assert.equal(ignores('file.ts'), false);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('supports glob patterns for binary assets', () => {
    const dir = mkdtempSync(join(tmpdir(), 'add-header-binary-'));
    try {
      writeFileSync(join(dir, '.addheaderignore'), ['*.png', '**/node_modules/', '.git/'].join('\n'));
      const ignores = loadIgnore(dir);
      assert.equal(ignores('assets/logo.png'), true);
      assert.equal(ignores('nested/node_modules/pkg/index.ts'), true);
      assert.equal(ignores('.git/config'), true);
      assert.equal(ignores('src/index.ts'), false);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

test('adds headers to non-ignored files and skips ignored ones (e2e)', async () => {
  const repo = mkdtempSync(join(tmpdir(), 'add-header-repo-'));
  const cleanup = () => rmSync(repo, { recursive: true, force: true });
  try {
    execSync('git init', { cwd: repo });
    execSync('git config user.email "ci@example.com"', { cwd: repo });
    execSync('git config user.name "CI"', { cwd: repo });

    writeFileSync(join(repo, '.addheaderignore'), 'ignored.txt\n');
    execSync('git add .', { cwd: repo });
    execSync('git commit -m "initial"', { cwd: repo });
    const base = execSync('git rev-parse HEAD', { cwd: repo }).toString().trim();

    writeFileSync(join(repo, 'observed.ts'), "console.log('hello');\n");
    writeFileSync(join(repo, 'ignored.txt'), 'sem cabecalho\n');
    execSync('git add observed.ts ignored.txt', { cwd: repo });
    execSync('git commit -m "add files"', { cwd: repo });
    const head = execSync('git rev-parse HEAD', { cwd: repo }).toString().trim();

    const edits = await run({ root: repo, base, head });

    const observed = readFileSync(join(repo, 'observed.ts'), 'utf8');
    const ignored = readFileSync(join(repo, 'ignored.txt'), 'utf8');

    assert.match(observed, /^\/\/ observed.ts\n/);
    assert.equal(ignored, 'sem cabecalho\n');
    assert.equal(edits > 0, true);
  } finally {
    cleanup();
  }
});
