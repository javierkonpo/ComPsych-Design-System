# Installing the ComPsych Design System

How to install `@javierkonpo/design-system` in an existing Angular or React Native codebase, and how to use Claude Code to generate components from the system's specifications.

The stakeholder-facing reference app — a visual showcase with live theming across all four products — lives at **https://ds-compsych.vercel.app/**. Share that link for walkthroughs and design reviews; use this file for install.

## Prerequisites

- Node.js 18+ and your team's package manager (npm, pnpm, or yarn).
- An existing Angular (web) or React Native (mobile) project.
- [Claude Code](https://docs.claude.com/claude-code) installed and configured.
- A GitHub personal access token with the `read:packages` scope. Store it as an environment variable or keep it in a user-level `~/.npmrc` — **never** commit it to the project.

## 1 · Authenticate npm with GitHub Packages

The package is published to GitHub Packages under the `@javierkonpo` scope (the scope is tied to the repo owner on GitHub Packages — this will switch to `@compsych` when the repo moves to a ComPsych org). Create (or append to) a project-level `.npmrc` file at the root of your Angular or React Native project:

```ini
# .npmrc
@javierkonpo:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Export the token in your shell, or define it in a local (gitignored) `.env`:

```bash
export GITHUB_TOKEN=ghp_your_personal_access_token
```

For CI, set `GITHUB_TOKEN` as a secret in your workflow — GitHub provides one automatically inside Actions.

## 2 · Install the package

```bash
# npm
npm install @javierkonpo/design-system

# pnpm
pnpm add @javierkonpo/design-system

# yarn
yarn add @javierkonpo/design-system
```

## 3 · Pick your theme

The package ships twelve pre-built theme bundles — one per brand × product combination. Import the bundle that matches what you're building.

| Brand | Products |
|---|---|
| `compsych` (default) | `compsych-gro`, `compsych-crc`, `compsych-gn`, `compsych-fmla` |
| `brand-b` (white-label) | `brand-b-gro`, `brand-b-crc`, `brand-b-gn`, `brand-b-fmla` |
| `brand-c` (white-label) | `brand-c-gro`, `brand-c-crc`, `brand-c-gn`, `brand-c-fmla` |

### Angular / web — import the CSS bundle

```scss
/* src/styles.scss */
@import '@javierkonpo/design-system/themes/compsych-crc.css';
```

That single import defines every `--sys-*` CSS custom property on `:root`. Your components read from those variables.

### React Native — import the typed bundle

```ts
// App-level theme module
import { tokens } from '@javierkonpo/design-system/themes/compsych-fmla';

// or, if you prefer the bare `sys` namespace:
import { sys } from '@javierkonpo/design-system/themes/compsych-fmla';
```

Pass the `tokens` object through a React Context so every component has access to the active product theme.

## 4 · Use tokens in your code

The `sys.*` tier is the only tier you reference in UI code. `core.*`, `product.*`, and `brand.*` are internal plumbing — a component that references them directly will not re-theme and will break white-labeling.

### Angular / web

```css
.my-button {
  background: var(--sys-color-roles-accent-primary-sys-primary);
  color: var(--sys-color-roles-accent-primary-sys-on-primary);
  padding: calc(var(--sys-dimensions-spacing-padding-sys-padding-16) * 1px);
  border-radius: calc(var(--sys-dimensions-border-radius-sys-radius-sm) * 1px);
}
```

> **Units.** Numeric token values (spacing, radius) are emitted as unit-less numbers in CSS custom properties. Multiply by `1px` inside `calc()` when using them as lengths.

### React Native

```ts
import { tokens } from '@javierkonpo/design-system/themes/compsych-fmla';
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

## 5 · Generate components with Claude Code

The package includes every component spec under `specs/`. Each spec documents anatomy, props, states, and behavior in framework-agnostic markdown. Use Claude Code to generate framework-specific implementations.

### Example: Button for Angular

In your Angular project, with Claude Code:

```
Read the Button spec from the @javierkonpo/design-system package (specs/button.spec.md).
Generate an Angular component that implements this spec exactly.
Use the tokens imported from @javierkonpo/design-system/themes/compsych-crc.
Place the component at src/app/shared/components/button/.
Follow this project's existing Angular conventions for module structure and testing.
```

### Example: Button for React Native

```
Read the Button spec from the @javierkonpo/design-system package (specs/button.spec.md).
Generate a React Native component that implements this spec exactly.
Use the tokens object imported from @javierkonpo/design-system/themes/compsych-fmla.
Place the component at src/components/Button/.
Follow this project's existing React Native conventions for styling and testing.
```

For a drop-in Claude Code configuration that teaches the session every rule of the system, copy the adopter `CLAUDE.md` file from this repo:

- Angular: [`adopters/angular/CLAUDE.md`](adopters/angular/CLAUDE.md)
- React Native: [`adopters/react-native/CLAUDE.md`](adopters/react-native/CLAUDE.md)

## Updating the package

```bash
npm update @javierkonpo/design-system
```

Then regenerate any components whose specs have changed. Each release ships a changelog describing which specs have been updated.

## Troubleshooting

**`401 Unauthorized` when installing:** your `GITHUB_TOKEN` isn't set or the token lacks the `read:packages` scope. Regenerate at <https://github.com/settings/tokens> with `read:packages` checked, then re-export.

**`404 Not found`:** the `.npmrc` scope line is missing or misspelled. Must read exactly `@javierkonpo:registry=https://npm.pkg.github.com`.

**Types aren't inferred on the TS import:** confirm your `tsconfig.json` has `"moduleResolution": "bundler"` (or `"node16"`) — the package uses the `exports` field.

## Support

- Questions about tokens or specs: **Konpo Studio**.
- Questions about framework-specific implementation: **ComPsych engineering leads**.
- Bugs, gaps, or feature requests: open an issue on [the repo](https://github.com/javierkonpo/ComPsych-Design-System/issues).

## Related links

- **Reference app:** https://ds-compsych.vercel.app/
- **Spec directory:** `specs/` in this repo (also mirrored into the package).
- **Architecture overview:** the "About" page in the reference app, or `specs/foundations.md`.
- **Adopter guidance:** `adopters/angular/` and `adopters/react-native/` in this repo.
