# Installing the ComPsych Design System

> **Status: placeholder.** The npm package described below has not been published yet. Package name, registry, and import paths are provisional. This guide documents the intended installation flow for ComPsych's Angular and React Native teams; once the package ships, this file will be updated with the final names and commands.

## What this guide covers

How to install the ComPsych design system in an existing Angular or React Native codebase, and how to use Claude Code to generate components that follow the system's specifications.

The stakeholder-facing reference app — a visual showcase of the design system with live theming across all four products — is published separately at **https://ds-compsych.vercel.app/**. Share that link for walkthroughs and design reviews; use this file for install.

## Prerequisites

- Node.js 18+ and your team's preferred package manager (npm, pnpm, or yarn).
- An existing Angular (web) or React Native (mobile) project.
- [Claude Code](https://docs.claude.com/claude-code) installed and configured.

## Installation

> **Placeholder package name — final name TBD.** The commands below assume the package will be called `@compsych/design-system`. The actual name may differ; treat the commands as illustrative until the package ships.

```bash
# npm
npm install @compsych/design-system

# pnpm
pnpm add @compsych/design-system

# yarn
yarn add @compsych/design-system
```

## Choosing your theme

The package ships pre-built theme bundles for every supported brand × product combination. Import the bundle matching the product you're working on.

Available themes (final paths may change):

| Brand | Products |
|---|---|
| `compsych` (default) | `compsych-gro`, `compsych-crc`, `compsych-gn`, `compsych-fmla` |
| `brand-b` (white-label) | `brand-b-gro`, `brand-b-crc`, `brand-b-gn`, `brand-b-fmla` |
| `brand-c` (white-label) | `brand-c-gro`, `brand-c-crc`, `brand-c-gn`, `brand-c-fmla` |

### Angular / web — import the CSS bundle

```ts
// In your app's global stylesheet entry (e.g. src/styles.scss)
@import '@compsych/design-system/themes/compsych-crc.css';
```

That single import defines every `--sys-*` CSS custom property on `:root`. Your components read from those variables.

### React Native — import the TypeScript bundle

```ts
// In your app's root or theme context
import { tokens } from '@compsych/design-system/themes/compsych-fmla';
```

The `tokens` object exposes the full `sys.*` tree as a typed nested object. Use it via a theme context so the active product theme is available in every component.

## Using tokens in your code

The `sys.*` tier is the only tier you reference in UI code. The `core`, `product`, and `brand` tiers are internal plumbing — a component that references them directly will not re-theme and will break white-labeling.

### Angular / web

```css
.my-button {
  background: var(--sys-color-roles-accent-primary-sys-primary);
  color: var(--sys-color-roles-accent-primary-sys-on-primary);
  padding: calc(var(--sys-dimensions-spacing-padding-sys-padding-16) * 1px);
  border-radius: calc(var(--sys-dimensions-border-radius-sys-radius-sm) * 1px);
}
```

> Note on units: numeric token values (spacing, radius) are emitted as unit-less numbers in CSS custom properties. Multiply by `1px` inside `calc()` when using them as lengths. This behaviour may simplify in a later package version.

### React Native

```ts
import { tokens } from '@compsych/design-system/themes/compsych-fmla';
import { StyleSheet } from 'react-native';

const sys = tokens.sys;

const styles = StyleSheet.create({
  button: {
    backgroundColor: sys.colorRoles.accent.primary.sysPrimary,
    paddingHorizontal: sys.dimensions.spacing.padding.sysPadding16,
    borderRadius: sys.dimensions.borderRadius.sysRadiusSm,
  },
  buttonLabel: {
    color: sys.colorRoles.accent.primary.sysOnPrimary,
    ...sys.typeScale.labelLarge,
  },
});
```

## Generating components with Claude Code

The package includes component specifications in `specs/`. Each spec documents a component's anatomy, props, states, and behavior. Use Claude Code to generate framework-specific implementations from these specs.

### Example: generating a Button for Angular

In your Angular project, with Claude Code:

```
Read the Button spec from the @compsych/design-system package (specs/button.spec.md).
Generate an Angular component that implements this spec exactly.
Use the tokens imported from @compsych/design-system/themes/compsych-crc.
Place the component at src/app/shared/components/button/.
Follow this project's existing Angular conventions for module structure and testing.
```

### Example: generating a Button for React Native

In your React Native project, with Claude Code:

```
Read the Button spec from the @compsych/design-system package (specs/button.spec.md).
Generate a React Native component that implements this spec exactly.
Use the tokens object imported from @compsych/design-system/themes/compsych-fmla.
Place the component at src/components/Button/.
Follow this project's existing React Native conventions for styling and testing.
```

Adjust the theme import and file paths for the specific product and project you're in.

## Updating the design system

When a new version of the package is published, update it as normal:

```bash
npm update @compsych/design-system
```

Then regenerate any components whose specs have changed. A changelog will ship alongside each release describing which specs have been updated.

## Support

- Questions about tokens or specs: **Konpo Studio**.
- Questions about framework-specific implementation: **ComPsych engineering leads**.
- Bugs, gaps, or feature requests for the design system itself: open an issue on this repo.

## Related documentation

- **Reference app (stakeholder-facing):** https://ds-compsych.vercel.app/
- **Spec directory:** `specs/` in this repo.
- **Architecture overview:** the "About" page in the reference app, or `specs/foundations.md` in this repo.
- **Adopter guidance (current drafts):** `adopters/angular/` and `adopters/react-native/` in this repo.

## Known placeholder items

Because the npm package has not shipped yet, the following details are provisional and will change:

- Final package name (currently shown as `@compsych/design-system`).
- Exact import paths (`/themes/<brand>-<product>.css`, `/themes/<brand>-<product>`).
- Whether tokens ship as unit-less numbers or pre-converted to `px`/`rem`.
- Distribution mechanism (private npm registry, internal artifact store, or sync script).

When these land, this file is the first thing we update.
