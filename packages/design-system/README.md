# @javierkonpo/design-system

Token bundles and component specifications for the ComPsych Design System. Consumed by ComPsych's Angular web and React Native mobile applications.

> The package lives under the `@javierkonpo` npm scope because the source repo is hosted under the `javierkonpo` GitHub account and GitHub Packages requires the scope to match the repo owner. If / when this repo moves to a `compsych` GitHub org, we'll re-publish under `@compsych/design-system`.

> Looking for the visual walkthrough? Open [https://ds-compsych.vercel.app/](https://ds-compsych.vercel.app/) and start on the **About** page.

## Install

The package is published to **GitHub Packages** under the `@javierkonpo` scope. To install, authenticate npm with a personal access token that has `read:packages` permission, then install as normal:

```bash
# .npmrc (project-level or user-level)
@javierkonpo:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

```bash
npm install @javierkonpo/design-system
# or
pnpm add @javierkonpo/design-system
# or
yarn add @javierkonpo/design-system
```

## Available themes

Twelve pre-built theme bundles — one per brand × product combination.

| Brand | Products |
|---|---|
| `compsych` (default) | `compsych-gro`, `compsych-crc`, `compsych-gn`, `compsych-fmla` |
| `brand-b` (white-label) | `brand-b-gro`, `brand-b-crc`, `brand-b-gn`, `brand-b-fmla` |
| `brand-c` (white-label) | `brand-c-gro`, `brand-c-crc`, `brand-c-gn`, `brand-c-fmla` |

## Angular / web

Import the CSS bundle that matches the product you're building:

```scss
// src/styles.scss
@import '@javierkonpo/design-system/themes/compsych-crc.css';
```

The import defines every `--sys-*` CSS custom property on `:root`. Use them in your components:

```scss
.my-button {
  background: var(--sys-color-roles-accent-primary-sys-primary);
  color: var(--sys-color-roles-accent-primary-sys-on-primary);
  padding: calc(var(--sys-dimensions-spacing-padding-sys-padding-16) * 1px);
  border-radius: calc(var(--sys-dimensions-border-radius-sys-radius-sm) * 1px);
}
```

Numeric tokens (spacing, radius) are unit-less — multiply by `1px` inside `calc()` when using them as lengths.

## React Native

Import the typed token tree:

```ts
import { tokens } from '@javierkonpo/design-system/themes/compsych-fmla';
// or: import { sys } from '@javierkonpo/design-system/themes/compsych-fmla';

const sys = tokens.sys;

const styles = StyleSheet.create({
  button: {
    backgroundColor: sys.colorRoles.accent.primary.sysPrimary,
    paddingHorizontal: sys.dimensions.spacing.padding.sysPadding16,
    borderRadius: sys.dimensions.borderRadius.sysRadiusSm,
  },
});
```

Pass the `tokens` object through a React Context so the active theme is available in every component.

## Component specifications

The package ships every component spec under `specs/`. Each spec is framework-agnostic markdown documenting anatomy, props, states, and behavior. Generate framework-specific code with Claude Code:

```
Read the Button spec from the @javierkonpo/design-system package (specs/button.spec.md).
Generate an Angular component that implements this spec exactly.
Use the tokens imported from @javierkonpo/design-system/themes/compsych-crc.
Place the component at src/app/shared/components/button/.
Follow this project's existing Angular conventions for module structure and testing.
```

See the adopter `CLAUDE.md` files in the main repo (`adopters/angular/`, `adopters/react-native/`) for drop-in Claude Code instructions that wire all of this together.

## The one rule

**Only `sys.*` tokens are applied in UI.** `core.*`, `product.*`, and `brand.*` tiers are internal plumbing — referencing them directly breaks theme switching and white-labeling. This applies to every component that consumes the system.

## Links

- **Reference app:** https://ds-compsych.vercel.app/
- **Repo:** https://github.com/javierkonpo/ComPsych-Design-System
- **License:** Internal to ComPsych. Authored by [Konpo Studio](https://konpo.studio).
