# ComPsych Design System

The code-layer translation of the ComPsych design system, consumed by ComPsych's Angular web and React Native mobile applications.

## What this repo is

This is not a component library. It is a shared source of truth made up of:

- **Tokens** — JSON, built into CSS (Angular) and TypeScript (React Native) via Style Dictionary.
- **Component specs** — framework-agnostic markdown, one per component.
- **A React reference app** — the live visual source of truth (Next.js, deployed to Vercel).
- **Adopter `CLAUDE.md` files** — drop into Angular or React Native projects so Claude Code follows the system automatically.

The canonical source of truth is the **specs + tokens**. ComPsych's Angular and React Native teams implement from the specs inside their own project repos.

## Quick start (adopting the system)

1. Install the generated token packages in your project (publishing workflow documented in `docs/adoption-guide.md`).
2. Copy the adopter `CLAUDE.md` into your project root:
   - Angular: `adopters/angular/CLAUDE.md`
   - React Native: `adopters/react-native/CLAUDE.md`
3. Configure the active product (`gro`, `crc`, `gn`, or `fmla`) and, if applicable, the active brand.
4. Build UI using only `sys.*` tokens. See `specs/foundations.md` for the token catalog and `specs/` for component specs.

Full instructions: [`docs/adoption-guide.md`](docs/adoption-guide.md).

## Reference site

Live at: **https://ds-compsych.vercel.app/**

The `reference/` folder contains a Next.js 15 gallery app that reads directly from the generated token bundles and renders every foundation live, with a brand × product theme switcher that reskins the whole page in real time. See [`reference/README.md`](reference/README.md) for local dev and deploy instructions.

From the repo root:

```
npm install            # installs root deps (Style Dictionary toolchain)
npm run install:reference
npm run dev            # boots the reference app at http://localhost:3000
npm run build          # builds tokens + reference for production
```

## Folder structure

```
compsych-ds/
├── CLAUDE.md               Instructions for Claude Code sessions working in this repo.
├── README.md               This file.
├── manifest.json           Machine-readable inventory of brands, products, tokens, components.
├── tokens/                 The four-tier token source files + build config.
│   ├── brand/              Tier 4 — raw values per brand (white-label).
│   ├── core.json           Tier 1 — raw primitives.
│   ├── product/            Tier 3 — semantic role mappings per product.
│   ├── system.json         Tier 2 — the only tier applied in UI.
│   └── build.ts            Style Dictionary configuration.
├── specs/                  Framework-agnostic component specs and foundations documentation.
├── reference/              Next.js 15 reference gallery — live visual source of truth.
├── adopters/               Drop-in CLAUDE.md files for Angular and React Native projects.
└── docs/                   Adoption guide and internal workflow docs.
```

## The four-tier architecture (short)

```
Brand  →  Core  →  Product  →  System
```

- **Brand** — raw hex values and family strings per white-label brand.
- **Core** — raw primitives (tonal color ramps, spacing scale, radius scale, etc.).
- **Product** — semantic role mappings per product (GRO, CRC, GN, FMLA).
- **System** — the public-facing semantic tokens (`sys.color.primary`, `sys.spacing.sm`, etc.).

**Only `sys.*` tokens are applied in UI.** `core.*`, `product.*`, and `brand.*` are internal plumbing. See [`specs/foundations.md`](specs/foundations.md) for the full explanation.

## License

Internal to ComPsych. Authored by Konpo Studio.
