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

## Vercel Deployment

### Required project settings

Two settings, both under **Settings → General → Root Directory** in the Vercel dashboard:

1. **Root Directory** must be `reference`. Without this, Vercel's Next.js auto-detection looks at the repo root and fails with *"No Next.js version detected"* — the root `package.json` only contains the token-pipeline toolchain, not Next.
2. **"Include source files outside of the Root Directory in the Build Step"** must be **enabled**. Without this, the build environment only receives files inside `reference/`, so the `cd ..` in `installCommand` / `buildCommand` lands on a stubbed directory with no `package.json` and no `tokens/` folder. The build will then exit 127 on `npm run build` because `tsx` (from the root package) was never installed and `tokens/dist/` is never produced.

Both settings need to be flipped for any deploy to succeed. The default state for fresh projects is Root Directory = repo root with the "include outside" toggle OFF.

### What drives the build

Configuration lives in [`reference/vercel.json`](./vercel.json):

```json
{
  "framework": "nextjs",
  "installCommand": "cd .. && npm install && cd reference && npm install",
  "buildCommand":   "cd .. && npm run build:tokens && cd reference && npm run build",
  "outputDirectory": ".next"
}
```

Why `cd ..`? The Next.js app depends on `tokens/dist/` being present, and `tokens/dist/` is produced by the Style Dictionary toolchain that lives in the **repo root** `package.json`. Both commands hop up one level, run the root step, then hop back into `reference/` to finish. Vercel's Root Directory is still `reference/`, so Next's auto-detection succeeds and `outputDirectory` resolves against the reference folder.

### Deploy cascade (git push → live site)

1. You push to `main` on GitHub.
2. Vercel's GitHub integration receives the webhook and enqueues a build.
3. Vercel checks out the repo, `cd`s into `reference/` (per Root Directory).
4. `installCommand` runs: root `npm install` (Style Dictionary, tsx, typescript), then `reference/npm install` (Next.js, React, Tailwind v4, Lucide).
5. `buildCommand` runs:
   - `cd ..` → `npm run build:tokens` — emits 12 bundles under `tokens/dist/`.
   - `cd reference` → `npm run build` — triggers the `prebuild` hook (which re-runs `build:tokens` and `scripts/build-themes.ts`) and then `next build`.
6. Vercel picks up `reference/.next/` as the output and deploys.

The `build:tokens` step runs twice during a Vercel deploy (once explicitly in `buildCommand`, once inside `reference/`'s `prebuild` hook). This is intentional: the `prebuild` hook is what makes `npm run build` work standalone on a developer laptop, and leaving it in place means the reference build stays self-contained. The extra ~3 seconds on Vercel are cheap insurance against drift.

### Troubleshooting

**"No Next.js version detected. Make sure your package.json has 'next' in either 'dependencies' or 'devDependencies'."**
Vercel's Root Directory is not set to `reference`. Fix: Project Settings → General → Root Directory → `reference` → Save → redeploy.

**`Command "npm run build" exited with 127`**
Exit 127 is shell-speak for "command not found." On this project, the most common cause is the **"Include source files outside of the Root Directory in the Build Step"** toggle being off — the root `npm install` silently no-ops because the root `package.json` isn't in the build sandbox, so `tsx` isn't on `PATH` when the token build tries to run. Fix: enable that toggle, save, redeploy. The build log with the toggle enabled shows `--- [1/2] root install ...` and `--- [1/2] root build:tokens ...` lines emitted by `vercel.json`; if those lines are missing or the install under them did nothing, the toggle is still off.

**`Cannot find module '.../tokens/dist/...'` during build**
The install step didn't reach the repo root — `tokens/dist/` was never created. Same toggle as above, same fix.

**`next` is missing from `dependencies`**
Vercel's auto-detection and optimization features only inspect `dependencies`, not `devDependencies`. In `reference/package.json`, `next` must live under `dependencies`. (It already does; this is here in case a future refactor moves it.)

**Build succeeds but page is unthemed / CSS variables look empty**
The `scripts/build-themes.ts` step failed silently or was skipped. Fix: check the Vercel build log for `[build-themes] wrote 12 theme blocks to ...` — if it's missing, the `prebuild` hook didn't fire. Verify `reference/package.json` still has `"prebuild"` chained to `tsx scripts/build-themes.ts`.

### After the first successful deploy

Update the placeholder URL in the root [`README.md`](../README.md) and in the adopter docs to point at the real Vercel domain.

## Known limitations

- **GN (GuidanceNow) theme is a placeholder.** Sys-tier values are blank. Swatches appear empty, type has no size. A banner at the top of every foundations page flags this when the active product is GN.
- **Elevation has no sys-tier tokens yet.** Brand defines `Elevation.lv1`–`lv5` as DTCG `boxShadow` composites, but no Sys roles reference them. The elevation page uses illustrative shadows and documents the gap.
- **Font family is `google sans`**, but Google Sans is not a public Google Font. The reference app falls back to a system UI font stack so text renders consistently. Adopter projects will need a real font strategy (webfont upload, licensed alternative, or a fallback like Inter).
