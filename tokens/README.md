# Tokens

This folder is the authoring surface for the ComPsych Design System tokens. Raw JSON lives here; Style Dictionary builds it into CSS (for Angular), SCSS, and TypeScript (for React Native) per (brand × product) combination.

## The four tiers

```
Brand  →  Core  →  Product  →  System
```

| Tier | Folder / File | Purpose | In UI? |
|------|---------------|---------|--------|
| **Brand** (Tier 4) | `brand/*.json` | White-label configuration. Raw hex values per brand mode, optional font family overrides, optional radius/density preferences. | No |
| **Core** (Tier 1) | `core.json` | Raw primitives. Tonal color ramps, spacing scale, radius scale, typography sizes/weights, elevation, motion. References Brand. | No |
| **Product** (Tier 3) | `product/*.json` | Per-product semantic role mappings. GRO, CRC, GN, and FMLA each resolve roles to different Core primitives. References Core. | No |
| **System** (Tier 2) | `system.json` | The public, semantic layer. `sys.color.primary`, `sys.spacing.sm`, etc. References Product (and Core for non-themed primitives like spacing and radius). | **Yes — only this tier.** |

Data flows **one direction only**: Brand → Core → Product → System. Components then read System.

## The critical rule

> **Only `sys.*` tokens are applied in UI.**
>
> `core.*`, `product.*`, and `brand.*` are internal plumbing. A component that references any of them directly will not respond to theme changes and will break white-labeling.

Enforced in every spec, every reference implementation, and every adopter project.

## File layout

```
tokens/
├── brand/
│   ├── compsych.json         Default brand.
│   ├── brand-b.json          White-label placeholder.
│   └── brand-c.json          White-label placeholder.
├── core.json                 Tier 1 primitives.
├── product/
│   ├── gro.json              GuidanceResources.
│   ├── crc.json              ResourceCenter.
│   ├── gn.json               GuidanceNow.
│   └── fmla.json             AbsenceResources.
├── system.json               Tier 2 semantic tokens (applied in UI).
├── build.ts                  Style Dictionary build pipeline.
└── dist/                     Generated outputs. Git-ignored.
    └── <brand>-<product>/
        ├── tokens.css        CSS custom properties for Angular.
        ├── tokens.scss       SCSS variables (optional, same data as tokens.css).
        └── tokens.ts         Nested TypeScript export for React Native.
```

## Running the build

Prerequisites: Node ≥ 18, `npm install` from the repo root.

```
npm run build:tokens    # Builds all 12 (brand × product) bundles into tokens/dist/.
npm run clean:tokens    # Removes tokens/dist/.
```

The build script is `tokens/build.ts`, executed by `tsx` (no pre-compile step).

## How to add a token

Work tier by tier, starting at Brand:

1. **Brand.** If a raw value is required (new hex color, new font family), add it to every relevant brand file. Start with `compsych.json` as the default.
2. **Core.** Add the primitive to `core.json`. Color primitives reference Brand (e.g. `{brand.color.blue.40}`). Spacing, radius, size, weight, motion, and elevation primitives hold raw dimensions or composite values.
3. **Product.** For each file under `product/`, add a semantic role mapping if the token needs to differ per product.
4. **System.** Expose the role in `system.json` as a `sys.*` token. This is what components will reference.
5. **Rebuild.** `npm run build:tokens` regenerates CSS, SCSS, and TS outputs under `dist/<brand>-<product>/`.

Never skip a tier. A token added only at System without a Core primitive breaks the chain. A token added only at Core without a System role is invisible to components.

## How the build works

`tokens/build.ts` iterates the (brand × product) matrix — 3 brands × 4 products = 12 bundles. For each combination it:

1. Loads the brand file, Core, the product file, and System JSON.
2. Strips metadata keys (`_meta`, `_description`) and wraps each tier's contents under its namespace (`brand`, `core`, `product`, `sys`) in memory. The on-disk JSON is never modified.
3. Passes the combined dictionary to a fresh Style Dictionary instance (DTCG mode: `usesDtcg: true`, `$value`/`$type`).
4. Resolves every reference through the chain Brand → Core → Product → System.
5. Expands composite tokens (typography) into leaf tokens.
6. Emits three output files per bundle.

### The `sys.*`-only filter

The public outputs contain **only** tokens whose path starts with `sys.`. Every platform applies a filter:

```ts
const sysOnly = (token) => token.path[0] === 'sys';
```

This prevents `core.*`, `product.*`, and `brand.*` from leaking into files consumers see. The rule exists because components and styles must reference only System tokens — anything else breaks theme switching and white-labeling. Enforcing it at the build-output layer means an adopter project *cannot* accidentally pick up a lower-tier token even if their Claude Code session or a rogue style rule tried to.

### Output naming

| Platform | File | Token name example |
|----------|------|-------------------|
| CSS | `tokens.css` | `--sys-color-primary: #075cba;` |
| SCSS | `tokens.scss` | `$sys-color-primary: #075cba;` |
| TS | `tokens.ts` | `sys.color.primary` (nested object, camelCase keys) |

The TypeScript output is a single `export const sys = { ... } as const` — self-contained, no imports needed by consumers.

## How consumers use the outputs

Adopters install the bundle that matches their (brand, product) combination and import the appropriate file format:

- **Angular** — import `tokens.css` once at app startup, reference `var(--sys-*)` in every style.
- **React Native** — import `tokens.ts`, reference `sys.color.*`, `sys.spacing.*`, etc. from the nested object.

Framework-specific setup lives in the adopter docs (`adopters/angular/CLAUDE.md`, `adopters/react-native/CLAUDE.md`). Do not duplicate that detail here.

## Naming convention

```
layer.property.role
```

- `sys.color.primary`
- `sys.typography.body-large`
- `sys.spacing.sm`
- `core.color.blue.40`
- `pd.color.primary` (or `product.color.primary`)
- `brand.color.blue.40`

Kebab-case for roles. Lowercase for layers and properties.

## Placeholders

All token values in this scaffold are empty (`""`) or expressed as references (`{core.color.blue.40}`). The actual values come from the Figma data in a follow-up step.
