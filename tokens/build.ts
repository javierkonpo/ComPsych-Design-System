/**
 * ComPsych Design System — Style Dictionary build pipeline.
 *
 * Reads the four-tier token source (Brand / Core / Product / System) and
 * emits one output bundle per (brand × product) combination — 3 × 4 = 12
 * bundles in total. Each bundle contains:
 *
 *   tokens.css    CSS custom properties for Angular.
 *   tokens.scss   SCSS variables (optional/alternative for Angular).
 *   tokens.ts     Nested TypeScript export for React Native.
 *
 * Only `sys.*` tokens land in the public outputs. Brand, Core, and Product
 * are internal plumbing and are filtered out.
 *
 * Architecture note: the JSON files on disk are not namespaced — each file's
 * top-level keys are `color`, `typography`, `spacing`, etc. For the reference
 * chain {brand...} / {core...} / {product...} / {sys...} to resolve, this
 * script wraps each file's contents under the appropriate namespace in
 * memory before handing them to Style Dictionary. The on-disk JSON is never
 * modified.
 */

import StyleDictionary from 'style-dictionary';
import type { Config, TransformedToken } from 'style-dictionary/types';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { readFileSync, existsSync, rmSync, mkdirSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const TOKENS_DIR = resolve(REPO_ROOT, 'tokens');
const DIST_DIR = resolve(TOKENS_DIR, 'dist');

const BRANDS = ['compsych', 'brand-b', 'brand-c'] as const;
const PRODUCTS = ['gro', 'crc', 'gn', 'fmla'] as const;

type Brand = (typeof BRANDS)[number];
type Product = (typeof PRODUCTS)[number];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Strip any key beginning with `_` (e.g. `_meta`, `_description`). These are
 * documentation-only fields on the source JSON; they are not W3C DTCG tokens
 * and Style Dictionary will choke on them if left in place.
 */
function stripMetadata(input: unknown): unknown {
  if (input === null || typeof input !== 'object') return input;
  if (Array.isArray(input)) return input.map(stripMetadata);
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (key.startsWith('_')) continue;
    out[key] = stripMetadata(value);
  }
  return out;
}

function loadTokenFile(path: string): Record<string, unknown> {
  const raw = JSON.parse(readFileSync(path, 'utf8')) as unknown;
  return stripMetadata(raw) as Record<string, unknown>;
}

function toCamelCase(segment: string): string {
  // Preserves segments that start with a digit ('3xs', '2xl', '40'): those
  // remain valid JS object-literal keys when quoted, so we leave them alone.
  return segment.replace(/-([a-z0-9])/g, (_m, c: string) => c.toUpperCase());
}

/**
 * Walk the flat token list and rebuild a nested object keyed by the token
 * path. Used by the TypeScript format to emit a single `sys` object literal
 * instead of 200+ individual `export const` lines.
 */
function buildNestedFromTokens(tokens: TransformedToken[]): Record<string, unknown> {
  const root: Record<string, unknown> = {};
  for (const token of tokens) {
    const segments = token.path;
    let node = root;
    for (let i = 0; i < segments.length - 1; i++) {
      const key = toCamelCase(segments[i]);
      if (typeof node[key] !== 'object' || node[key] === null) node[key] = {};
      node = node[key] as Record<string, unknown>;
    }
    const last = toCamelCase(segments[segments.length - 1]);
    // With usesDtcg: true, Style Dictionary stores the transformed value on
    // `$value`. `value` is the legacy (pre-DTCG) field and stays undefined
    // in this mode. We read `$value` first and fall back to `value` to stay
    // robust if the mode ever changes.
    node[last] = token.$value ?? token.value;
  }
  return root;
}

/**
 * KNOWN TOKEN INCONSISTENCY — placeholder data workaround.
 *
 * `system.json` defines sys.elevation.<role> with a single-string reference
 * like `{core.elevation.0}`. But in `core.json`, `core.elevation.0` is a
 * GROUP (containing `shadow` and `surface-tint` sub-tokens), not a leaf
 * token. Style Dictionary cannot resolve a string reference that points at
 * a group, so these references would surface as unresolved.
 *
 * Rather than mutating system.json (constraint: don't modify the token
 * files' structure in this phase), we rewrite the offending tokens in
 * memory: one string-referenced elevation role becomes two leaf-referenced
 * sub-tokens (`shadow` + `surface-tint`).
 *
 * When real Figma values arrive, we should revisit this — either restructure
 * the system-layer elevation tokens to mirror the sub-token shape directly
 * in JSON, or define a proper DTCG composite `$type` for elevation with a
 * matching typesMap.
 */
function expandElevationComposites(sys: Record<string, unknown>): Record<string, unknown> {
  const elevation = sys.elevation as Record<string, unknown> | undefined;
  if (!elevation) return sys;

  const next: Record<string, unknown> = { ...sys };
  const nextElevation: Record<string, unknown> = {};

  for (const [role, raw] of Object.entries(elevation)) {
    const val = raw as Record<string, unknown>;
    const ref = typeof val?.$value === 'string' ? (val.$value as string) : '';
    const m = ref.match(/^\{core\.elevation\.(\d+)\}$/);
    if (m) {
      const level = m[1];
      nextElevation[role] = {
        shadow: { $value: `{core.elevation.${level}.shadow}`, $type: 'shadow' },
        'surface-tint': { $value: `{core.elevation.${level}.surface-tint}`, $type: 'number' },
      };
    } else {
      nextElevation[role] = raw;
    }
  }

  next.elevation = nextElevation;
  return next;
}

// ---------------------------------------------------------------------------
// Custom format: typescript/sys-nested
//
// Emits a single `export const sys = {...} as const` literal. Object keys
// are camelCase; values are the resolved final values. No imports, so the
// file is self-contained and consumers can drop it into any TS project.
// ---------------------------------------------------------------------------

StyleDictionary.registerFormat({
  name: 'typescript/sys-nested',
  format: ({ dictionary }) => {
    const sysTokens = dictionary.allTokens.filter((t) => t.path[0] === 'sys');
    if (sysTokens.length === 0) {
      throw new Error(
        'typescript/sys-nested: zero sys.* tokens in dictionary. Check the sys-only filter and source wrapping.',
      );
    }
    const nested = buildNestedFromTokens(sysTokens);
    const payload = nested.sys ?? {};
    const header = [
      '// Auto-generated by tokens/build.ts. Do not edit by hand.',
      '// Run `npm run build:tokens` to regenerate.',
      '',
    ].join('\n');
    const body =
      `export const sys = ${JSON.stringify(payload, null, 2)} as const;\n\n` +
      `export type Sys = typeof sys;\n`;
    return header + '\n' + body;
  },
});

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function clean(): Promise<void> {
  if (existsSync(DIST_DIR)) {
    rmSync(DIST_DIR, { recursive: true, force: true });
    console.log(`Removed ${DIST_DIR}`);
  }
}

async function build(): Promise<void> {
  await clean();
  mkdirSync(DIST_DIR, { recursive: true });

  // Load the stable inputs once. Brand and Product vary per combination.
  const core = loadTokenFile(join(TOKENS_DIR, 'core.json'));
  const sys = expandElevationComposites(loadTokenFile(join(TOKENS_DIR, 'system.json')));

  const brandData = {} as Record<Brand, Record<string, unknown>>;
  for (const brand of BRANDS) {
    brandData[brand] = loadTokenFile(join(TOKENS_DIR, 'brand', `${brand}.json`));
  }

  const productData = {} as Record<Product, Record<string, unknown>>;
  for (const product of PRODUCTS) {
    productData[product] = loadTokenFile(join(TOKENS_DIR, 'product', `${product}.json`));
  }

  const sysOnly = (token: TransformedToken): boolean => token.path[0] === 'sys';

  const summary: Array<{ bundle: string; tokens: number }> = [];

  for (const brand of BRANDS) {
    for (const product of PRODUCTS) {
      const bundleName = `${brand}-${product}`;
      const outDir = join(DIST_DIR, bundleName);

      // Namespace-wrap each tier so references resolve cleanly.
      const tokens = {
        brand: brandData[brand],
        core,
        product: productData[product],
        sys,
      };

      const config: Config = {
        tokens,
        usesDtcg: true,
        // Expand composite tokens (e.g. typography, shadow) into leaf tokens.
        // Needed so CSS/SCSS emit one variable per sub-property and so the
        // nested TypeScript output preserves the composite shape cleanly.
        expand: true,
        log: {
          // Empty placeholder values are expected in this phase; surface
          // issues without failing the build. When real values arrive we
          // may tighten this to 'error'.
          warnings: 'warn',
          verbosity: 'default',
          errors: {
            // Fail hard on genuine unresolved references. Placeholder empty
            // values resolve to '' (fine); only truly missing tokens trip
            // this path.
            brokenReferences: 'throw',
          },
        },
        // Explicit transforms per platform. We deliberately skip `size/rem`
        // (included by default in the `css` / `scss` / `js` transform groups)
        // because (a) it parseFloat()s every value and throws on empty
        // placeholder strings, and (b) we want the final output to preserve
        // whatever unit the source authors (Figma export → Brand/Core JSON)
        // — px stays px, unit-less stays unit-less. Consumers can re-scale
        // at their own boundary if they prefer rem.
        platforms: {
          css: {
            transforms: [
              'attribute/cti',
              'name/kebab',
              'color/css',
              'time/seconds',
              'fontFamily/css',
              'cubicBezier/css',
              'shadow/css/shorthand',
              'typography/css/shorthand',
            ],
            buildPath: `${outDir}/`,
            files: [
              {
                destination: 'tokens.css',
                format: 'css/variables',
                filter: sysOnly,
                options: { outputReferences: false },
              },
            ],
          },
          scss: {
            transforms: [
              'attribute/cti',
              'name/kebab',
              'color/css',
              'time/seconds',
              'fontFamily/css',
              'cubicBezier/css',
              'shadow/css/shorthand',
              'typography/css/shorthand',
            ],
            buildPath: `${outDir}/`,
            files: [
              {
                destination: 'tokens.scss',
                format: 'scss/variables',
                filter: sysOnly,
                options: { outputReferences: false },
              },
            ],
          },
          ts: {
            transforms: ['attribute/cti', 'name/camel', 'color/hex'],
            buildPath: `${outDir}/`,
            files: [
              {
                destination: 'tokens.ts',
                format: 'typescript/sys-nested',
                filter: sysOnly,
              },
            ],
          },
        },
      };

      const sd = new StyleDictionary(config);
      await sd.buildAllPlatforms();

      // Sanity-check: how many sys.* tokens ended up in this bundle.
      const dictionary = await sd.getPlatformTokens('css');
      const sysCount = dictionary.allTokens.filter(sysOnly).length;
      if (sysCount === 0) {
        throw new Error(
          `Bundle ${bundleName} produced zero sys.* tokens. Filter or source wrapping is wrong.`,
        );
      }
      summary.push({ bundle: bundleName, tokens: sysCount });
    }
  }

  console.log('\nBuild summary:');
  for (const row of summary) {
    console.log(`  ${row.bundle.padEnd(22)} ${row.tokens} sys.* tokens`);
  }
  console.log(`\nBuilt ${summary.length} bundles into ${DIST_DIR}`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.includes('--clean')) {
    await clean();
    return;
  }
  await build();
}

main().catch((err: unknown) => {
  console.error('\nBuild failed:');
  console.error(err);
  process.exit(1);
});
