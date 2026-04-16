# Internal Workflow

For the Konpo Studio team. How tokens move from Figma to this repo, how components are specified and reviewed, how the build and deploy pipeline runs.

Team-facing companion to `docs/adoption-guide.md` (which is written for ComPsych's adopting engineering teams).

---

## How tokens flow from Figma to this repo

The Figma tokens live across two files in the ComPsych Figma workspace: Foundations/Tokens, and Core Components. The Foundations file holds every variable we care about for the token layer.

The Figma variable structure mirrors the four-tier architecture exactly:

- **Brand collection** — raw hex and family values per brand mode.
- **Core collection** — tonal ramps, spacing, radius, typography primitives. References Brand.
- **Product collection** — role mappings per product. References Core. This is a "mode" set: each product is a mode in the collection.
- **System collection** — the `sys.*` semantic tokens applied in UI. References Product.

### Token export process

1. Export the Figma variables (using the Figma Variables API or a plugin).
2. Transform the exported data into W3C Design Tokens JSON, split across four files per the repo's tier structure:
   - `tokens/brand/<brand>.json` — one per brand mode.
   - `tokens/core.json` — one file, references Brand.
   - `tokens/product/<product>.json` — one per product.
   - `tokens/system.json` — one file, references Product.
3. Commit the updated JSON files.
4. The Style Dictionary build regenerates `tokens/dist/<brand>/<product>/*`.
5. Ship the updated bundle to consumers (mechanism depends on publishing strategy — see below).

### The Figma authoring workflow (for reference)

Designers working in Figma follow the same tier discipline:

1. To add a new raw color: start in Brand, add the hex to the relevant hue family (across all 13 tones, or at minimum the tones used by Core).
2. Add or update the Core reference if the tone isn't already wired to a Brand hex.
3. If the value needs to differ per product, assign it at Product for each product mode.
4. Expose the semantic role at System.

**Never apply a Core, Product, or Brand variable directly to a component in Figma.** Components must reference System. If you catch a violation in a Figma component, fix it.

---

## Adding a new token (step-by-step)

This mirrors the same flow used in Figma, applied to the JSON.

1. **Brand (`tokens/brand/*.json`).** Add the raw value (hex, family name, etc.) to every brand file. Start with `compsych.json` as the default and Brand B / Brand C follow.
2. **Core (`tokens/core.json`).** Add the primitive. Color primitives reference the Brand file (`{brand.color.<hue>.<tone>}`). Scale primitives (spacing, radius, size, weight) hold dimensions or identifiers directly.
3. **Product (`tokens/product/*.json`).** If the token needs to differ per product, add a role mapping to each product file pointing at the appropriate Core primitive.
4. **System (`tokens/system.json`).** Expose the role as a `sys.*` token. This is what components will reference.
5. **Commit, build, verify.** Run Style Dictionary. Check that the generated outputs include the new token and resolve to the expected values.

Never skip a tier. A token added only at System without a Core primitive breaks the chain. A token added only at Core without a System role is invisible to components.

---

## Adding a new component (step-by-step)

1. **Propose.** Confirm the component is needed. Check the DS issue tracker and the manifest for existing or proposed components. Avoid duplicates.
2. **Draft the spec.** Copy `specs/_template.spec.md` to `specs/<component-name>.spec.md`. Fill in every section: Purpose, API contract, Visual specification (every property referencing a `sys.*` token), States, Behavior, Accessibility (web and React Native), Reference implementation paths. Set status to `draft`.
3. **Register in the manifest.** Add an entry under `components` in the root `manifest.json` with the component name, spec path, and status.
4. **Review with Konpo.** Internal review for tier discipline, API clarity, and accessibility completeness. Update status to `review`.
5. **Review with ComPsych stakeholders.** Confirm the component solves the product need. Iterate on the spec.
6. **Implement in the React reference app.** Build the component in `reference/src/components/<component-name>/` following the spec exactly. Use only `sys.*` tokens. Add a story/demo page.
7. **Mark stable.** Update the spec's status to `stable`. Adopters can now generate Angular and React Native implementations from it.

---

## How the build runs

The pipeline lives in `tokens/build.ts`, driven by Style Dictionary 4. Entry points:

```
npm run build:tokens    # Full build of all 12 bundles.
npm run clean:tokens    # Wipes tokens/dist/.
```

### What happens when you run `npm run build:tokens`

1. **Load.** `build.ts` reads all four tiers from disk: `tokens/core.json`, `tokens/system.json`, every brand file under `tokens/brand/`, every product file under `tokens/product/`.
2. **Sanitize.** `_meta` and `_description` keys are stripped (they are not DTCG tokens and would confuse Style Dictionary).
3. **Namespace wrap.** The raw JSON files are not pre-namespaced on disk. In memory, each tier's contents are wrapped under the correct key (`brand`, `core`, `product`, `sys`) so references like `{core.color.blue.40}` resolve cleanly.
4. **Expand elevation composites.** A known quirk: `sys.elevation.*` tokens reference `{core.elevation.N}`, but `core.elevation.N` is a group, not a leaf. The build expands these in memory into two leaf references (`shadow` + `surface-tint`). When real values arrive we may restructure elevation in JSON and remove this step.
5. **Matrix build.** For each of 3 brands × 4 products = 12 combinations, a fresh Style Dictionary instance is configured with:
   - DTCG mode (`usesDtcg: true`) — the source uses `$value`/`$type`.
   - `expand: true` — composite tokens (typography, shadow) are flattened into leaf tokens so CSS/SCSS emit one variable per sub-property.
   - `errors.brokenReferences: 'throw'` — unresolved references fail the build; empty placeholder values are fine (they resolve to `""`).
   - Explicit transform lists per platform — we deliberately skip `size/rem` (it crashes on empty placeholder strings and we want to preserve whatever unit the source authors).
6. **Filter.** Every platform applies a `sysOnly` filter — only tokens whose path starts with `sys.` make it into the emitted files. Brand, Core, and Product are purely internal.
7. **Emit.** Three files land in `tokens/dist/<brand>-<product>/`:
   - `tokens.css` — CSS custom properties (`--sys-color-primary: ...`).
   - `tokens.scss` — SCSS variables (`$sys-color-primary: ...`).
   - `tokens.ts` — Nested `export const sys = { ... } as const` literal via a custom format. Self-contained, no imports.
8. **Summary.** The script logs a per-bundle token count so regressions are obvious (currently 161 `sys.*` tokens per bundle).

### CI expectation

The build should run on every push to `main`, with the resulting `tokens/dist/` treated as a publishable artifact. `tokens/dist/` is gitignored; the artifact flows to consumers via whichever publishing mechanism we pick (see below).

---

## How the reference app is built and deployed

`reference/` is a Next.js 15 App Router project. It consumes the token bundles in `tokens/dist/` (never from the raw JSON) and renders a Foundations gallery plus a theme switcher.

### Local dev

```
npm install              # at repo root — installs SD toolchain
npm run install:reference
npm run dev              # boots http://localhost:3000
```

Or directly from `reference/`:

```
cd reference && npm install && npm run dev
```

The `predev` hook runs `scripts/build-themes.ts`, which:

1. Reads every `tokens/dist/<brand>-<product>/tokens.css` and concatenates them into `reference/styles/themes.css`, rewriting each `:root { ... }` block to a `[data-theme="<brand>-<product>"] { ... }` selector. One of those blocks is also duplicated as `:root` so the page renders before the client hydrates.
2. Copies `tokens/dist/compsych-gro/tokens.ts` to `reference/lib/generated-tokens.ts`, giving the app a typed `sys` import that lives inside the Next.js project root. (Importing the external `tokens/dist/` path works in dev but trips the RSC client-manifest bundler during `next build` on some platforms — the in-tree copy sidesteps that.)

Both generated files are gitignored; the build regenerates them from scratch every run.

### Production build

```
npm run build            # at repo root — runs build:tokens then next build
```

Or directly from `reference/`:

```
cd reference && npm run build
```

The reference's `prebuild` hook chains `npm run build:tokens` at the repo root before invoking `scripts/build-themes.ts` and `next build`. This guarantees the app always builds against the current token values.

### Adding a new Foundation page

1. Create `reference/app/foundations/<name>/page.tsx`, marked `'use client'`.
2. Read values from CSS variables via `useCssVar('--sys-...')` or inline `style={{ ... : 'var(--sys-...)' }}`. Never hardcode a value.
3. Add a nav link in `reference/components/nav.tsx`.
4. Add a card (with a preview mini-diagram) in `reference/app/foundations/page.tsx`.
5. Pull the description from `specs/foundations.md` for consistency.

### Adding a new Component page (later phase)

Once the components gallery starts landing, each component page lives at `reference/app/components/<name>/page.tsx` and should match the patterns above. The component spec in `specs/<name>.spec.md` is authoritative.

### Deploy (Vercel)

Configuration lives at [`reference/vercel.json`](../reference/vercel.json). Two Vercel project settings are required:

1. **Root Directory** = `reference` (Settings → General). Without this, Next.js auto-detection reads the root `package.json` — which has no `next` dependency — and fails with *"No Next.js version detected."*
2. **"Include source files outside of the Root Directory in the Build Step"** = **enabled**. Without this, the `cd ..` in our install/build commands lands on a stubbed empty directory because Vercel only uploads files inside the Root Directory. Symptom: `npm run build` exits 127 because `tsx` was never installed at the root.

```json
{
  "framework": "nextjs",
  "installCommand": "cd .. && npm install && cd reference && npm install",
  "buildCommand":   "cd .. && npm run build:tokens && cd reference && npm run build",
  "outputDirectory": ".next"
}
```

The `cd ..` dance is what makes the hybrid work. Vercel runs every command from `reference/` (per Root Directory). We hop up to the repo root to install the token toolchain and build `tokens/dist/`, then hop back into `reference/` to finish. Output path resolves relative to `reference/`, so `.next` is the correct value.

#### Deploy cascade

1. Push to `main` on GitHub.
2. Vercel webhook fires; build queues.
3. Vercel clones and `cd reference`.
4. `installCommand` — root install, then reference install.
5. `buildCommand` — root `build:tokens` (emits 12 bundles into `tokens/dist/`), then reference `npm run build` (whose `prebuild` hook re-runs `build:tokens` and `scripts/build-themes.ts` before `next build`).
6. Vercel serves `reference/.next`.

Preview deploys run on every PR; production deploys run on pushes to `main`. A `.vercelignore` at the repo root keeps `node_modules`, `tokens/dist`, `reference/.next`, and `tokens-studio-import` out of the upload.

#### Troubleshooting

| Symptom | Fix |
|---------|-----|
| *"No Next.js version detected"* | Project Settings → Root Directory → `reference` → Save → redeploy. |
| `Command "npm run build" exited with 127` | Enable **"Include source files outside of the Root Directory in the Build Step"** (same settings section). The `cd ..` in our commands needs access to the real repo root for `tsx` and the token toolchain. |
| `Cannot find module '.../tokens/dist/...'` | Same toggle as above — the root `build:tokens` step never produced the bundles because the root `package.json` wasn't visible to the build sandbox. |
| Page renders unthemed / CSS vars empty | `scripts/build-themes.ts` didn't run. Grep build log for `[build-themes] wrote 12 theme blocks` — if absent, the `prebuild` hook in `reference/package.json` was removed or broken. |

Once deployed, update the placeholder URL in `README.md` and `reference/README.md`.

---

## Publishing tokens to consumers

To be finalized. Current candidates:

1. **Private npm package** — `@compsych/ds-tokens` published to a private registry. Consumers install with `npm install @compsych/ds-tokens`. Simplest for Angular and RN. Requires npm registry setup.
2. **Git submodule** — consumers pull the DS repo as a submodule and reference `tokens/dist/` directly. Less ergonomic.
3. **Sync script** — a script on the consumer side that fetches the latest compiled tokens and writes them into the project. Usable if no registry exists.

Pick one and document it here when the decision lands.

---

## Coordinating upstream changes

When ComPsych engineering proposes a new component or a spec change:

1. They open a PR or issue against this repo with a drafted spec (using `specs/_template.spec.md`).
2. Konpo reviews for tier discipline, API consistency, and accessibility.
3. If the change is a refinement, we iterate in-repo. If it's a fundamental addition to foundations, we coordinate with the Figma file first, then reflect the change in the JSON.
4. Once merged, a new token bundle is published and consumers pull the update on their own cadence.

Breaking changes to `sys.*` token names or shapes are rare but significant — coordinate with both Angular and React Native teams before shipping.
