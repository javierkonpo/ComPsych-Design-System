# Adoption Guide

How to adopt the ComPsych Design System in a new ComPsych project.

This guide is written for ComPsych's engineering teams. For a team-internal process view (how tokens move from Figma to this repo, how releases happen), see `docs/workflow.md`.

---

## Before you start

Every adopting project needs to know three things:

1. **Which product is this?** `gro`, `crc`, `gn`, or `fmla`.
2. **Which brand?** `compsych` (default), or a white-label brand (`brand-b`, `brand-c`, …).
3. **Is this Angular or React Native?**

The (product × brand) pair selects which compiled token bundle the project consumes. The framework determines which adopter `CLAUDE.md` file to copy.

---

## Adopting in Angular

### 1. Install token output

Install the generated CSS bundle for your (brand, product) combination. The publishing mechanism depends on the current infrastructure — ask the Konpo team whether it ships via:

- A private npm package (e.g. `@compsych/ds-tokens`).
- A git submodule that pulls the DS repo's `tokens/dist/` output.
- A sync script that copies the latest compiled tokens into `src/styles/ds-tokens.css`.

Whichever the mechanism, the end state is a CSS file on disk that your app imports.

### 2. Import tokens globally

In `src/styles.scss` (or `src/styles.css`):

```scss
@import 'ds-tokens.css';
```

This loads every `--sys-*` custom property onto `:root`.

### 3. Install icons

```
npm install lucide-angular
```

### 4. Set the active theme

In `src/index.html`, on the `<html>` element:

```html
<html lang="en" data-theme="gro" data-brand="compsych">
```

Change `data-theme` to the correct product and `data-brand` to the correct brand. If the project is single-brand, `data-brand` may be omitted depending on the compiled bundle strategy.

### 5. Copy the adopter CLAUDE.md

Copy `adopters/angular/CLAUDE.md` from the DS repo into this project's root. This configures Claude Code sessions in the project to follow the design system rules.

### 6. Read the foundations

Read `specs/foundations.md` in the DS repo. You need to understand the four-tier architecture and the token catalog before building any UI.

### 7. Build components

For every component you need:

1. Find the spec in the DS repo: `specs/<component-name>.spec.md`.
2. Implement the Angular component, styled only with `var(--sys-*)` custom properties.
3. Match the spec's API, states, and Web accessibility requirements.

---

## Adopting in React Native

### 1. Install token output

The generated TypeScript output exposes the `sys` namespace (and possibly a tokens bundle keyed by brand and product). Install it via the current publishing mechanism — ask the Konpo team.

### 2. Install icons

```
npm install lucide-react-native
```

React Native additionally requires `react-native-svg`. Install it and follow its setup steps for iOS and Android.

### 3. Set up the DS provider

At the root of the app:

```tsx
import { DsProvider } from '@compsych/ds';

export default function App() {
  return (
    <DsProvider brand="compsych" product="gro">
      <RootNavigator />
    </DsProvider>
  );
}
```

### 4. Copy the adopter CLAUDE.md

Copy `adopters/react-native/CLAUDE.md` from the DS repo into this project's root.

### 5. Read the foundations

Read `specs/foundations.md` in the DS repo.

### 6. Build components

For every component you need:

1. Find the spec in the DS repo: `specs/<component-name>.spec.md`.
2. Implement the React Native component, using `useSys()` to read tokens and `StyleSheet.create()` for styles.
3. Match the spec's API (with RN naming — `onPress`, `label`, etc.), states, and React Native accessibility requirements.

---

## Configuring the active product and brand

### Build-time selection (simple, fast)

Ship a compiled token bundle that targets a single (brand, product) combination. The app has no runtime theme switching; it ships as a GRO-branded build, a CRC-branded build, and so on. Recommended when a deployment is always one product.

### Runtime selection (flexible, more complex)

Ship a compiled token bundle that contains rules for every supported combination, scoped under `[data-theme][data-brand]` selectors in CSS (for Angular) or indexed by key in the TypeScript bundle (for RN). The app switches themes by mutating the attribute (web) or swapping the provider value (RN). Recommended when a single app must represent multiple products or brands.

The choice is per-project. Ask the Konpo team which strategy is configured for your project's token bundle.

---

## When a component doesn't exist yet

If you need a component that isn't documented in `specs/`:

1. **Do not invent one in isolation.** A component built only in one consumer project drifts from the others.
2. **Draft a spec upstream.** Copy `specs/_template.spec.md`, fill it in, and submit a PR to the DS repo.
3. **Review with Konpo.** The spec is reviewed for alignment with the system before it lands.
4. **Once the spec is `stable`, implement.** You (or Claude Code in your project) generates the framework-specific implementation from the approved spec.

In genuinely urgent cases you may build the component locally using only `sys.*` tokens, but flag it as a TODO in the code and submit the spec upstream in the same sprint.

---

## Updating the DS

When the DS repo ships new tokens or new components:

1. The published token bundle is updated (new version of `@compsych/ds-tokens` or updated submodule or sync).
2. Pull the update in your project.
3. New or changed `sys.*` tokens are available. No component code changes are required unless the DS team announces breaking changes (rare — the tier architecture isolates most changes).
4. New components in `specs/` may be implemented as needed.

---

## Questions, issues, pull requests

File issues and pull requests against the DS repo. The Konpo team owns the system; ComPsych engineering teams consume and contribute back via spec proposals.
