# ComPsych Design System — Angular Adopter Instructions

This file is dropped into the root of an Angular project that consumes the ComPsych Design System (DS). It teaches a Claude Code session working inside that project how to consume tokens, apply the active product theme, and follow the system's rules.

---

## What this project consumes

- **Tokens** as CSS custom properties, loaded from the generated CSS output of the DS repo.
- **Component specs** as the source of truth for every UI component. Canonical specs live in the DS repo at `specs/<component-name>.spec.md`.

This project does NOT import components from the DS. Angular components are implemented here, generated from the specs. The specs — not the React reference — are authoritative.

---

## Where tokens live in this project

The generated CSS token file is imported at app startup. Typical path:

```
src/styles/ds-tokens.css
```

It is imported in `src/styles.scss` (or `src/styles.css`) with:

```scss
@import 'ds-tokens.css';
```

The file exposes every `sys.*` token as a CSS custom property. Real names from the current build:

```css
:root {
  --sys-color-roles-accent-primary-sys-primary: #075cba;
  --sys-color-roles-accent-primary-sys-on-primary: #ffffff;
  --sys-color-roles-surface-surface-sys-surface: #f9fafb;
  --sys-dimensions-spacing-padding-sys-padding-4: 16;
  --sys-dimensions-border-radius-sys-radius-sm: 8;
  --sys-type-scale-body-medium-sys-font-size: 16;
  /* ...and so on — ~219 variables per bundle. */
}
```

Names are verbose. They reflect the structure of the ComPsych Figma source: the full path `<tier>.<group>.<subgroup>.<leaf>` is preserved and kebab-flattened. Leaf names carry a `sys-` prefix because the Figma source uses it to disambiguate tiers. Live with the length — the generated `tokens.css` in your bundle is the authoritative catalog, and IDE autocomplete does the heavy lifting.

---

## The critical rule

> **Only `sys-*` custom properties are applied in component code.**
>
> Never `--core-*`, never `--pd-*`, never `--brand-*`. A component that references any of them directly will not respond to theme changes and will break white-labeling. This rule is non-negotiable.

Enforce this in every template, every `.scss` file, every inline style binding.

Correct:
```scss
.button {
  background: var(--sys-color-roles-accent-primary-sys-primary);
  color: var(--sys-color-roles-accent-primary-sys-on-primary);
  padding: var(--sys-dimensions-spacing-padding-sys-padding-2)
           var(--sys-dimensions-spacing-padding-sys-padding-4);
  border-radius: var(--sys-dimensions-border-radius-sys-radius-sm);
}
```

Incorrect:
```scss
.button {
  background: #075CBA;                         /* raw hex */
  padding: 12px 16px;                          /* raw px */
  color: var(--core-color-primary-core-primary-100);  /* wrong tier */
}
```

---

## Applying the active product theme

The active product is set on the root element via a `data-theme` attribute:

```html
<html data-theme="gro">
```

Valid values: `gro` (GuidanceResources), `crc` (ResourceCenter), `gn` (GuidanceNow), `fmla` (AbsenceResources).

If you need to switch themes dynamically at runtime, either:

1. Mutate the attribute on `document.documentElement` from a `ThemeService`, and ensure the loaded `ds-tokens.css` file contains rules scoped under `[data-theme="..."]` selectors (build-time configuration).
2. Or load a different compiled token bundle (one file per product) at startup.

Ask the DS team which strategy is in use for this project. Build-time selection is simpler and faster; runtime switching requires the multi-theme CSS output.

---

## Applying the active brand

For white-label deployments, the active brand is set with a `data-brand` attribute on the same root element:

```html
<html data-brand="compsych" data-theme="gro">
```

If this project ships only the default `compsych` brand, the attribute can be omitted. If the project supports multiple brands, it must be set at bootstrap before any component renders.

---

## Finding the canonical spec

Before implementing any UI, read the spec:

```
<compsych-ds-repo>/specs/<component-name>.spec.md
```

The spec defines the props, events, visual spec, states, behavior, and accessibility requirements. Match them exactly.

If the component you need does not exist in `specs/`:

1. Do not invent a new one in isolation. Draft a spec file using the DS template and submit upstream.
2. In the meantime, if you must ship the component locally, build it using only `sys.*` tokens and note the missing spec as a TODO in the code comments.

---

## Rules for Claude Code sessions in this Angular project

Follow these strictly:

1. **Never use raw hex codes, raw px values, or raw font sizes.** Every style must reference a `--sys-*` custom property.
2. **Never reference `--core-*`, `--pd-*`, or `--brand-*`.** Only `--sys-*` is allowed in component code.
3. **Check the spec before implementing.** The spec is authoritative.
4. **Match the spec's API exactly.** Do not rename props, do not add unlisted props, do not change defaults.
5. **Use `onClick`, `aria-*`, and Angular keyboard conventions.** This is web. Follow the spec's Accessibility / Web subsection.
6. **Use Lucide icons.** Install `lucide-angular` and import icons by name from the spec.

---

## How to implement a component from a spec

1. **Read the spec file end-to-end.** Pay attention to the API contract, visual spec, states, and accessibility.
2. **Create the component.** Standard Angular component scaffold: `.component.ts`, `.component.html`, `.component.scss`.
3. **Implement the API.** Inputs and outputs must match the spec's props and events. Use web naming (`onClick`, not `onPress`).
4. **Style with `sys.*` tokens only.** Every color, spacing, radius, border, elevation, and typography value must be a `var(--sys-*)`.
5. **Implement every state.** Default, hover, focus, pressed, selected, disabled, loading, error (where applicable). Use `sys.state.*` tokens and CSS pseudo-classes (`:hover`, `:focus-visible`, `:active`, `:disabled`).
6. **Implement accessibility.** Use the spec's Web accessibility subsection: `role`, `aria-*`, keyboard shortcuts, focus management.
7. **Write a Storybook story or equivalent.** Document each variant and state.

---

## Common patterns

### Focus ring without layout shift

```scss
.button:focus-visible {
  /* Pick the ring width that matches your spec; check the emitted tokens.css
     for exact variable names, e.g.:
     --sys-dimensions-border-width-sys-border-*  */
  outline: 2px solid var(--sys-color-roles-accent-primary-sys-primary);
  outline-offset: 2px;
}
```

Never change `border-width` on focus — that causes layout shift. Use `outline` or `box-shadow` inset.

### Hover overlay

The Sys layer exposes state-layer opacities under `sys.state-layer.*` (surfaced as `--sys-state-layer-sys-hover`, `--sys-state-layer-sys-pressed`, etc.). Apply them as an RGBA overlay on the button's container color:

```scss
.button:hover {
  /* Example pattern — exact token names in your bundle's tokens.css */
  background-color: color-mix(
    in srgb,
    var(--sys-color-roles-accent-primary-sys-primary)
      calc(100% - var(--sys-state-layer-sys-hover) * 1%),
    black var(--sys-state-layer-sys-hover)
  );
}
```

### Disabled

```scss
.button:disabled {
  opacity: var(--sys-state-layer-sys-disabled-container);
  pointer-events: none;
}
```

Follow the spec — some components use separate container and content opacities. Grep `tokens.css` for `--sys-state-layer-` to see the available state tokens.
