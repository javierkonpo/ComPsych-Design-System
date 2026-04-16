# Reference App

The live visual source of truth for the ComPsych Design System. A Next.js 15 App Router project that reads from the generated token bundles in `tokens/dist/` and renders a browsable Foundations gallery with a brand × product theme switcher.

Deploys to: https://compsych-ds.vercel.app (placeholder — updated after the first deploy).

## What this app is

- A **gallery**, not a component library. Every page is a visual catalog of tokens (soon, components) rendered live.
- A **theme-switcher demo.** Pick any of 3 brands × 4 products from the sidebar and watch the page reskin — every value is read from a CSS custom property, nothing is hardcoded.
- A **documentation artifact**. Both Angular and React Native teams can link to this site in PRs, Slack, and design reviews as proof of what the system looks like.

It is **not** the source of truth — the specs in `specs/` and tokens in `tokens/` are. This app implements from them.

## Running locally

From this folder:

```
npm install
npm run dev
```

Or from the repo root:

```
npm run dev    # shortcut for `cd reference && npm run dev`
```

Then visit http://localhost:3000.

## How tokens flow in

```
tokens/*.json
    │
    ▼  npm run build:tokens  (at repo root)
tokens/dist/<brand>-<product>/{tokens.css, tokens.scss, tokens.ts}
    │
    ▼  reference/scripts/build-themes.ts
reference/
  styles/themes.css             (one [data-theme="<brand>-<product>"] block per bundle)
  lib/generated-tokens.ts       (copy of compsych-gro/tokens.ts for typed imports)
    │
    ▼  next dev / next build
The app
```

`scripts/build-themes.ts` runs automatically:

- Before every `npm run dev` (via the `predev` hook).
- Before every `npm run build` (the `prebuild` hook runs `npm run build:tokens` at the repo root then the theme script).

You should never need to invoke it manually, but `npm run build:themes` is provided as an escape hatch.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start the dev server. Rebuilds themes first. |
| `npm run build` | Rebuild tokens + themes + Next.js production build. |
| `npm run start` | Run the production server after `npm run build`. |
| `npm run lint` | ESLint via `next lint`. |
| `npm run typecheck` | `tsc --noEmit`. |
| `npm run build:themes` | Regenerate `styles/themes.css` and `lib/generated-tokens.ts` only. |

## Directory layout

```
reference/
├── app/
│   ├── layout.tsx              Root layout: ThemeProvider + Nav + main.
│   ├── page.tsx                Landing page.
│   ├── components/page.tsx     Components placeholder (reads manifest).
│   └── foundations/
│       ├── layout.tsx          Forces dynamic rendering for all foundations.
│       ├── page.tsx            Foundations index (card grid).
│       ├── color/page.tsx
│       ├── typography/page.tsx
│       ├── spacing/page.tsx
│       ├── elevation/page.tsx
│       ├── radius/page.tsx
│       ├── border-width/page.tsx
│       └── iconography/page.tsx
├── components/
│   ├── nav.tsx                 Sidebar nav with theme switcher at top.
│   ├── theme-switcher.tsx      Brand + Product dropdowns.
│   ├── page-header.tsx         Shared page heading.
│   ├── placeholder-banner.tsx  Shown when active theme is a placeholder (GN).
│   ├── copy-chip.tsx           Click-to-copy token name chip.
│   ├── token-table.tsx         Foundation-agnostic token listing.
│   ├── color-swatch.tsx        Single color swatch, optionally with on-* pairing.
│   ├── color-ramp.tsx          Horizontal swatch row (e.g. chart palette).
│   ├── type-specimen.tsx       Rendered type role with sub-token readout.
│   ├── spacing-sample.tsx      Horizontal bar chart of spacing tokens.
│   ├── elevation-sample.tsx    Elevation card with shadow + usage label.
│   └── radius-sample.tsx       Radius demonstration card.
├── lib/
│   ├── tokens.ts               Typed sys export + flattenLeaves + path→CSS var helpers.
│   ├── theme-context.tsx       React context; writes data-theme to <body>; persists to localStorage.
│   ├── utils.ts                useCssVar, toPx, normalizeFontWeight, copyToClipboard.
│   └── generated-tokens.ts     Copied from tokens/dist/compsych-gro/tokens.ts at build time. Gitignored.
├── scripts/
│   └── build-themes.ts         Concatenates per-theme CSS + copies the default typed tokens file.
├── styles/
│   └── themes.css              Generated. Gitignored.
├── public/
├── next.config.ts
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Adding a new foundation page

1. Create `app/foundations/<name>/page.tsx`.
2. Mark it `'use client'`.
3. Read values from CSS variables — use `useCssVar('--sys-...')` for anything you want to display textually, or assign `var(--sys-...)` in a style. **Never hardcode a token value.**
4. Add a nav link in `components/nav.tsx`.
5. Add a card in `app/foundations/page.tsx` with a matching preview mini-diagram.
6. Pull the human-readable description from `specs/foundations.md`.

## The critical rule (same as everywhere else)

Only `sys.*` tokens are applied in UI. This applies to this reference app too. Never write a literal hex, px, font-size, or inline shadow in a component. If you need a value the token pipeline does not yet expose, either:

1. Add the token upstream (see the "How to add a token" recipe in the root `CLAUDE.md`), or
2. Document the gap explicitly on-page (see `elevation/page.tsx` for how to do this cleanly).

## Vercel deployment

Vercel config lives in `vercel.json` at the **repo root** (not this folder). The configuration:

- Install command: installs both the root (for `build:tokens` / `tsx`) and reference (for Next.js).
- Build command: `npm run build:tokens && cd reference && npm run build`.
- Output directory: `reference/.next`.
- Framework: `nextjs`.

To deploy:

1. Import the repo into Vercel.
2. Leave "Root Directory" blank — the repo root (the default).
3. Vercel will pick up `vercel.json` at the root and use those commands.
4. The framework is auto-detected as Next.js from the output directory.

No further Vercel dashboard tweaks should be required.

## Known limitations

- **GN (GuidanceNow) theme is a placeholder.** Sys-tier values are blank. Swatches appear empty, type has no size. A banner at the top of every foundations page flags this when the active product is GN.
- **Elevation has no sys-tier tokens yet.** Brand defines `Elevation.lv1`–`lv5` as DTCG `boxShadow` composites, but no Sys roles reference them. The elevation page uses illustrative shadows and documents the gap.
- **Font family is `google sans`**, but Google Sans is not a public Google Font. The reference app falls back to a system UI font stack so text renders consistently. Adopter projects will need a real font strategy (webfont upload, licensed alternative, or a fallback like Inter).
