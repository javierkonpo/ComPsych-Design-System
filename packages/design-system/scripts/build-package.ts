/**
 * Assembles the distributable contents of `@javierkonpo/design-system`.
 *
 * Reads every bundle under `tokens/dist/<brand>-<product>/` and copies
 *   - tokens.css  →  packages/design-system/themes/<bundle>.css
 *   - tokens.ts   →  packages/design-system/themes/<bundle>.ts
 *
 * Also mirrors the repo-level `specs/` folder into the package so
 * adopters can read component specifications without cloning the repo.
 *
 * Idempotent — safe to run repeatedly. Intended to run after
 * `npm run build:tokens` at the repo root, and as part of the pre-publish
 * step.
 */
import {
  readdirSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  copyFileSync,
  rmSync,
  statSync,
} from 'node:fs';
import { join, resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PACKAGE_ROOT = resolve(__dirname, '..');
const REPO_ROOT = resolve(PACKAGE_ROOT, '..', '..');
const DIST_DIR = resolve(REPO_ROOT, 'tokens', 'dist');
const SPECS_SRC = resolve(REPO_ROOT, 'specs');
const THEMES_OUT = resolve(PACKAGE_ROOT, 'themes');
const SPECS_OUT = resolve(PACKAGE_ROOT, 'specs');

function ensureDir(path: string) {
  mkdirSync(path, { recursive: true });
}

function copyDirectory(src: string, dest: string) {
  ensureDir(dest);
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else if (entry.isFile()) {
      copyFileSync(srcPath, destPath);
    }
  }
}

function buildThemes(): string[] {
  if (!existsSync(DIST_DIR)) {
    throw new Error(
      `tokens/dist not found at ${DIST_DIR}. Run \`npm run build:tokens\` at the repo root first.`,
    );
  }

  // Wipe previous output so deleted bundles don't linger.
  if (existsSync(THEMES_OUT)) {
    rmSync(THEMES_OUT, { recursive: true, force: true });
  }
  ensureDir(THEMES_OUT);

  const bundles = readdirSync(DIST_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  if (bundles.length === 0) {
    throw new Error(`No bundles found under ${DIST_DIR}.`);
  }

  for (const bundle of bundles) {
    const srcCss = join(DIST_DIR, bundle, 'tokens.css');
    const srcTs = join(DIST_DIR, bundle, 'tokens.ts');
    if (!existsSync(srcCss) || !existsSync(srcTs)) {
      console.warn(`[build-package] skipping ${bundle}: missing tokens.css or tokens.ts`);
      continue;
    }

    // CSS: write unchanged — Angular/web adopters import the whole file,
    // which drops every `--sys-*` var onto :root.
    copyFileSync(srcCss, join(THEMES_OUT, `${bundle}.css`));

    // TS: re-export under both names. The generated bundle file exports
    // `{ sys }`; we re-export as `{ tokens }` (a `{ sys }` object) as
    // well, so adopters can write either form:
    //
    //   import { sys } from '@javierkonpo/design-system/themes/compsych-crc';
    //   import { tokens } from '@javierkonpo/design-system/themes/compsych-crc';
    //
    // `tokens` reads nicely in React Native contexts where the whole
    // object gets passed through a ThemeProvider.
    const tsContents = readFileSync(srcTs, 'utf8');
    const appended =
      tsContents +
      '\n' +
      '// Convenience alias — wraps `sys` as `tokens.sys` for adopters\n' +
      '// that prefer the namespaced shape in a ThemeProvider.\n' +
      'export const tokens = { sys };\n';
    writeFileSync(join(THEMES_OUT, `${bundle}.ts`), appended, 'utf8');
  }

  console.log(`[build-package] wrote ${bundles.length} themes to ${relative(REPO_ROOT, THEMES_OUT)}`);
  return bundles;
}

function mirrorSpecs(): number {
  if (!existsSync(SPECS_SRC)) {
    console.warn(`[build-package] no specs dir at ${SPECS_SRC} — skipping spec mirror.`);
    return 0;
  }
  if (existsSync(SPECS_OUT)) {
    rmSync(SPECS_OUT, { recursive: true, force: true });
  }
  copyDirectory(SPECS_SRC, SPECS_OUT);
  const count = readdirSync(SPECS_OUT).filter((f) => {
    const full = join(SPECS_OUT, f);
    return statSync(full).isFile() && f.endsWith('.md');
  }).length;
  console.log(`[build-package] mirrored ${count} spec file(s) to ${relative(REPO_ROOT, SPECS_OUT)}`);
  return count;
}

buildThemes();
mirrorSpecs();
