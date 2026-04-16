/**
 * Typed Sys manifest for the reference app.
 *
 * Imports the generated TS export from the `compsych-gro` bundle and
 * re-exports it as the canonical reference shape. All 12 bundles share
 * this shape — they only differ in resolved values.
 *
 * At runtime, components read values from CSS custom properties (which
 * reskin with the active `data-theme`). This import is used for:
 *   - token PATH enumeration (listing every sys.* path in foundations tables)
 *   - typed compile-time guarantees (no typos in token paths)
 *   - default values when `getComputedStyle` is not available (SSR)
 */
// `generated-tokens.ts` is copied in by `scripts/build-themes.ts` during
// `predev` / `prebuild`. It is gitignored; always run the build script
// before importing. The copy keeps the import path inside the Next.js
// app root, which the RSC client-manifest bundler requires.
import { sys } from './generated-tokens';

export { sys };
export type SysTokens = typeof sys;

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const BRANDS = ['compsych', 'brand-b', 'brand-c'] as const;
export const PRODUCTS = ['gro', 'crc', 'gn', 'fmla'] as const;

export type Brand = (typeof BRANDS)[number];
export type Product = (typeof PRODUCTS)[number];

export const BRAND_LABELS: Record<Brand, string> = {
  compsych: 'ComPsych',
  'brand-b': 'Brand B',
  'brand-c': 'Brand C',
};

export const PRODUCT_LABELS: Record<Product, string> = {
  gro: 'GuidanceResources (GRO)',
  crc: 'ResourceCenter (CRC)',
  gn: 'GuidanceNow (GN)',
  fmla: 'AbsenceResources (FMLA)',
};

export const PLACEHOLDER_PRODUCTS: readonly Product[] = ['gn'];

// ---------------------------------------------------------------------------
// Path → CSS variable conversion
// ---------------------------------------------------------------------------

/**
 * Converts a camelCase segment to kebab-case. Matches what Style Dictionary's
 * `name/kebab` transform did when generating CSS. Handles digits correctly:
 *   `sysPadding2`    → `sys-padding-2`
 *   `sysRadius2xs`   → `sys-radius-2xs`
 *   `colorRoles`     → `color-roles`
 *   `typeScale`      → `type-scale`
 *   `addOn`          → `add-on`
 */
export function camelToKebab(seg: string): string {
  return seg
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Za-z])(\d)/g, '$1-$2')
    .toLowerCase();
}

/** Converts a sys.* token path (camelCase segments) to its CSS variable name. */
export function pathToCssVar(path: readonly string[]): string {
  return '--' + ['sys', ...path].map(camelToKebab).join('-');
}

// ---------------------------------------------------------------------------
// Walking the sys tree
// ---------------------------------------------------------------------------

export interface TokenLeaf {
  path: string[];              // e.g. ['colorRoles', 'accent', 'primary', 'sysPrimary']
  cssVar: string;              // e.g. '--sys-color-roles-accent-primary-sys-primary'
  defaultValue: string | number;
}

function isLeafValue(v: unknown): v is string | number {
  return typeof v === 'string' || typeof v === 'number';
}

/**
 * Walks any sub-tree of the sys object and returns every leaf under it.
 * Start from `sys` for the full tree, or pass a sub-object like
 * `sys.colorRoles.accent.primary` to scope to one branch. The `rootPath`
 * argument preserves the ancestor path (needed so the CSS variable name
 * lines up with the full `sys.*` path).
 */
export function flattenLeaves(
  node: unknown,
  rootPath: readonly string[] = [],
): TokenLeaf[] {
  const out: TokenLeaf[] = [];
  if (node === null || typeof node !== 'object') return out;

  for (const [key, value] of Object.entries(node)) {
    const path = [...rootPath, key];
    if (isLeafValue(value)) {
      out.push({
        path,
        cssVar: pathToCssVar(path),
        defaultValue: value,
      });
    } else if (value && typeof value === 'object') {
      out.push(...flattenLeaves(value, path));
    }
  }
  return out;
}
