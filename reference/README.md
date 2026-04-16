# Reference App

The live visual source of truth for the ComPsych Design System. A Next.js 15 App Router project that reads from the generated token bundles in `tokens/dist/` and renders a browsable Foundations gallery with a brand × product theme switcher.

Deployed at: **https://ds-compsych.vercel.app/**

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

## Vercel Deployment

### Setup (one-time)

In Vercel's dashboard: **Settings → General → Root Directory** → set to `reference`. Save. That's it — no install command override, no build command override, no "Include outside" toggle needed.

Why so simple? Because we **vendor the token build artifacts into the repo**:

- `tokens/dist/` (the Style Dictionary output — 12 bundles × 3 files) is committed.
- `reference/styles/themes.css` (the concatenated per-theme CSS) is committed.
- `reference/lib/generated-tokens.ts` (the typed `sys` import) is committed.

With those three artifacts already in the repo, Vercel only needs to run a plain `npm install && next build` inside `reference/` — exactly what its Next.js auto-detection does by default. No cross-directory installs, no custom build chain.

### Configuration

[`reference/vercel.json`](./vercel.json) is intentionally minimal:

```json
{
  "framework": "nextjs"
}
```

Everything else (install command, build command, output directory) uses Vercel's auto-detected defaults for a Next.js project.

### Deploy cascade (git push → live site)

1. You push to `main` on GitHub.
2. Vercel's GitHub integration receives the webhook and enqueues a build.
3. Vercel checks out the repo and `cd`s into `reference/`.
4. Default install: `npm install` inside `reference/` — installs Next.js, React, Tailwind v4, Lucide.
5. Default build: `npm run build` → `next build`. Reads the committed `styles/themes.css` and `lib/generated-tokens.ts` directly.
6. Vercel serves `reference/.next/`.

Preview deploys run on every PR; production deploys fire on pushes to `main`.

### IMPORTANT: token change workflow

Because the artifacts are vendored, token source changes require a manual regeneration step before commit. The flow is:

```
# 1. Edit token source JSON (tokens/*.json)
# 2. Rebuild the artifacts:
npm run sync:artifacts          # at repo root — runs build:tokens + build:themes
# 3. Commit BOTH the sources and the regenerated artifacts:
git add tokens/ reference/styles/themes.css reference/lib/generated-tokens.ts
git commit -m "Update tokens..."
```

The `sync:artifacts` script is defined in the root `package.json`. If you forget to run it, the deployed site will render with stale token values until the artifacts are regenerated and committed. A CI check (not yet implemented) could enforce this.

The standalone `npm run dev` inside `reference/` still runs `predev` → `build-themes.ts`, so local dev always re-reads the current `tokens/dist/` bundles. Only the Vercel build path relies on the committed copies.

### Troubleshooting

**"No Next.js version detected."**
Root Directory isn't set to `reference`. Fix: Settings → General → Root Directory → `reference` → Save → redeploy.

**`next: command not found` / `Command "npm run build" exited with 127`**
Reference deps didn't install. Most likely cause: a custom Install Command is configured in the Vercel dashboard (left over from an earlier debugging attempt) that overrides the default. Fix: Settings → General → Build & Development Settings → clear any custom Install Command, Build Command, and Output Directory — the defaults work correctly with the vendored-artifact setup.

**Page renders unthemed / CSS variables look empty**
`reference/styles/themes.css` is missing or out of date. Run `npm run sync:artifacts` at the repo root and commit the regenerated file.

**Deployed site shows stale token values**
You pushed a token source change without regenerating the artifacts. Run `npm run sync:artifacts`, commit the three vendored files, push.

### Live deployment

The production URL is **https://ds-compsych.vercel.app/**. Every push to `main` triggers a production deploy; every PR triggers a preview deploy with its own URL.

## Known limitations

- **GN (GuidanceNow) theme is a placeholder.** Sys-tier values are blank. Swatches appear empty, type has no size. A banner at the top of every foundations page flags this when the active product is GN.
- **Elevation has no sys-tier tokens yet.** Brand defines `Elevation.lv1`–`lv5` as DTCG `boxShadow` composites, but no Sys roles reference them. The elevation page uses illustrative shadows and documents the gap.
- **Font family is `google sans`**, but Google Sans is not a public Google Font. The reference app falls back to a system UI font stack so text renders consistently. Adopter projects will need a real font strategy (webfont upload, licensed alternative, or a fallback like Inter).
