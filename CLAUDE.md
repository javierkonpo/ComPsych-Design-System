# ComPsych Design System — Claude Code Instructions

This file instructs any Claude Code session operating inside this repo. Read it fully before making changes.

---

## What this repo is

The **ComPsych Design System (DS)** is the code-layer translation of the ComPsych design system originally defined in Figma across two files (Foundations/Tokens + Core Components).

It is **not** a component library. It is a shared source of truth consumed by:

- ComPsych's **Angular** web applications.
- ComPsych's **React Native** mobile applications.
- A **React reference app** (Next.js, hosted on Vercel) that serves as the live visual source of truth.

What this repo ships:

1. **Tokens** — raw JSON authored per tier, built via Style Dictionary into CSS (for Angular), TypeScript (for React Native), and JSON (as the source).
2. **Specs** — one markdown file per component, framework-agnostic, describing API, visual spec, states, behavior, and accessibility.
3. **A React reference app** — the rendered source of truth (built in a later phase).
4. **Adopter `CLAUDE.md` files** — drop-in instructions for consumer project Claude Code sessions (see `adopters/`).

The canonical source of truth is the **specs + tokens**. The React reference is an implementation of that truth, not the truth itself. Angular and React Native implementations live inside ComPsych's own project repos and are generated from the specs.

---

## The four-tier token architecture

This is the single most important thing to understand. Every token this system ships belongs to exactly one tier, and data flows in one direction:

```
Brand  →  Core  →  Product  →  System
```

Each tier has a strict scope. Never cross-wire them.

### Tier 1 — Core (`core.*`)

Raw primitives. The inventory. Holds tonal color ramps, spacing scales, radius scales, elevation primitives, typography families/sizes/weights, motion primitives. No semantic meaning.

- Core references Brand for its raw hex values.
- **NEVER applied directly in UI.**
- Example: `core.color.blue.40` resolves to `#075CBA` (from the ComPsych brand).

### Tier 2 — System (`sys.*`)

Semantic roles. The translation layer. Maps core primitives to UI roles like `primary`, `surface`, `error`, `on-primary`. This is the Material 3 role layer.

- **The ONLY tier applied in UI.**
- Example: `sys.color.primary` resolves through Product → Core → Brand.

### Tier 3 — Product (`product.*` or `pd.*`)

Product theming. Maps system roles to different core palettes per product. This is where GRO, CRC, GN, and FMLA differ from each other.

- **NOT applied in UI.** Feeds the System layer.
- Example: `pd.color.primary` points to `{core.color.blue.40}` in GRO, but to `{core.color.teal.40}` in CRC.

### Tier 4 — Brand (`brand.*`)

White-label configuration. Sets raw hex values per brand mode. Controls brand-specific typography, radius, and density preferences. Supports multiple modes (ComPsych default, Brand B, Brand C, and so on).

- **NOT applied in UI.** The entry point for raw value overrides.
- Example: `brand.color.blue.40 = #075CBA` in ComPsych mode, `#1930CB` in Brand B mode.

### Full propagation chain

```
sys.color.primary
  ← pd.color.primary          (Product: which core role for this product)
  ← core.color.blue.40        (Core: which tonal primitive)
  ← brand.color.blue.40       (Brand: raw hex value)
  = #075CBA
```

---

## The critical rule

> **Only `sys.*` tokens are ever applied in UI.**
>
> `core.*`, `product.*` (`pd.*`), and `brand.*` are internal plumbing. If a component references any of them directly, it will not respond to theme changes and will break white-labeling.

This rule is non-negotiable. It applies to:

- Every component spec in `specs/`.
- Every component in the React reference app.
- Every adopter implementation in Angular and React Native projects.
- Every example in documentation.

A violation is always a bug.

---

## Naming convention

```
layer.property.role
```

Examples:

- `sys.color.primary`
- `sys.typography.body-large`
- `sys.spacing.sm`
- `core.color.blue.40`
- `pd.color.primary`
- `brand.color.blue.40`

File and folder names use **kebab-case**:

- `tokens/product/gro.json`, not `Gro.json` or `GRO.json`.
- `specs/button.spec.md`, not `specs/Button.spec.md`.
- Component folders in the React reference: `components/button/`, not `Button/`.

---

## Rules for Claude Code sessions in this repo

Follow these strictly:

1. **Never use raw values.** No hex codes (`#075CBA`), no raw px values (`16px`), no raw font sizes, no inline shadow strings. Always reference a `sys.*` token.
2. **Never reference `core.*`, `product.*`, or `brand.*` from a component.** Only higher tiers may reference lower tiers. Product references Core. System references Product. Components reference System.
3. **Check the manifest before inventing a new component.** `manifest.json` is the canonical inventory. If the component is already listed, follow its existing spec. If it is not listed, draft a spec first.
4. **Spec files are authoritative.** When implementing in any framework, the spec's API contract, visual spec, states, and behavior are the source of truth. Match them exactly.
5. **Follow the file and naming conventions.** Kebab-case folders, co-located specs with components, one spec file per component.
6. **Read before you write.** Before modifying any file, read it. Before proposing a change, understand the existing patterns.

---

## How to add a new component

1. **Draft the spec.** Copy `specs/_template.spec.md` to `specs/<component-name>.spec.md`. Fill in every section: Purpose, API contract, Visual specification (in `sys.*` tokens only), States, Behavior, Accessibility, Reference implementation paths.
2. **Register it in `manifest.json`.** Add an entry under `components` with the component name, spec path, and status (`draft` → `stable`).
3. **Implement in the React reference app.** Build the component in the reference app following the spec exactly. Use only `sys.*` tokens.
4. **Update docs.** If the component introduces a new pattern, note it in `docs/workflow.md`.
5. **Signal adopters.** Once the spec reaches `stable`, ComPsych's Angular and React Native teams can generate their own implementations from the spec using their local Claude Code sessions and the adopter `CLAUDE.md` files.

---

## How to add a new token

Work tier by tier, starting at Brand:

1. **Brand (Tier 4).** If the token requires a raw value (a new hex color, a font family override), add it to every relevant brand file under `tokens/brand/`. Start with `compsych.json` as the default.
2. **Core (Tier 1).** Add the primitive to `tokens/core.json`. If it is a color, reference the new Brand value. If it is a new spacing or radius step, add it to the appropriate scale.
3. **Product (Tier 3).** For each product file in `tokens/product/`, decide whether this new primitive should be exposed through a semantic role. If yes, add a mapping.
4. **System (Tier 2).** Expose the role in `tokens/system.json`. This is the public-facing token that components will reference.
5. **Rebuild.** Run the Style Dictionary build to regenerate CSS, SCSS, and TypeScript outputs.

Never skip a tier. A token added only at System without a Core primitive breaks the chain. A token added only at Core without a System role is invisible to components.

---

## Adopter instructions

ComPsych's consumer projects (Angular and React Native) each ship their own `CLAUDE.md` file. When a developer starts a new consumer project, they copy the appropriate file from this repo:

- `adopters/angular/CLAUDE.md` — drop into the root of an Angular project.
- `adopters/react-native/CLAUDE.md` — drop into the root of a React Native project.

These files teach the consumer project's Claude Code session how to consume tokens, apply the active product theme and brand, and follow the same `sys.*`-only rule.

If you change anything about how tokens are named, packaged, or consumed, update both adopter files in the same change.

---

## Where to find things

- **Tokens:** `tokens/` — organized by tier (`brand/`, `core.json`, `product/`, `system.json`). Build config: `tokens/build.ts`.
- **Specs:** `specs/` — `foundations.md` documents the foundation layer. `_template.spec.md` is the canonical component spec template. Every other `.spec.md` file is one component.
- **Reference app:** `reference/` — Next.js app (populated in a later phase).
- **Adopter instructions:** `adopters/angular/` and `adopters/react-native/`.
- **Team docs:** `docs/` — adoption guide for ComPsych, internal workflow for Konpo.
