# {ComponentName}

> **Status:** draft | review | stable
> **Owner:** Konpo Studio
> **Introduced:** YYYY-MM-DD
> **Last updated:** YYYY-MM-DD

<!--
This is the canonical spec template. Every component in the ComPsych Design System must be documented in a file of this shape. The spec is framework-agnostic: it documents intent, API, visuals, states, behavior, and accessibility. Framework-specific implementations (Angular, React Native, React reference) are generated from this spec.

Naming:
  - File: `specs/<component-name>.spec.md` (kebab-case).
  - Heading: display the component in PascalCase (`Button`, `TextField`, `DatePicker`).

CRITICAL RULE: Every value in the Visual specification section must reference a `sys.*` token. Never reference `core.*`, `product.*`, or `brand.*`. Never use raw hex codes, raw px values, or raw font sizes.

Delete these HTML comments before publishing the spec.
-->

---

## Purpose

One paragraph. What is this component for? Where does it appear? What user problem does it solve? What is it NOT for (to prevent misuse)?

## API contract

The public API of the component. Applies to all frameworks.

### Props

| Name | Type | Default | Required | Notes |
|------|------|---------|----------|-------|
| `variant` | `'filled' \| 'outlined' \| 'text'` | `'filled'` | no | Visual variant. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | no | Size variant. |
| `disabled` | `boolean` | `false` | no | Disables interaction and renders the disabled state. |
| `loading` | `boolean` | `false` | no | Renders the loading state. |
| `leadingIcon` | `IconName` | — | no | Optional leading icon (Lucide name). |
| `trailingIcon` | `IconName` | — | no | Optional trailing icon. |
| `children` / `label` | `string` | — | yes | Content of the component. On React Native, prefer `label` prop over `children`. |

### Events

| Name (web) | Name (React Native) | Payload | Notes |
|------------|---------------------|---------|-------|
| `onClick`  | `onPress`           | `(event) => void` | Fires on activation. Suppressed when `disabled` or `loading`. |
| `onFocus`  | `onFocus`           | `(event) => void` | Web only for keyboard focus. RN equivalent fires on focusable navigation. |
| `onBlur`   | `onBlur`            | `(event) => void` | — |

### Naming differences across frameworks

- Web (Angular, React): `onClick`, `onFocus`, `onBlur`, `children`.
- React Native: `onPress` (no `onClick`), `accessibilityLabel` for the label, no `children` text node (pass `label` as a prop).
- Icons: pass by Lucide name string in all frameworks. Consumers install Lucide directly in their project.

### Slots / composition

List any named slots or composable parts (e.g. `<Card.Header>`, `<Card.Footer>`). Describe what is allowed in each.

## Visual specification

All values MUST reference `sys.*` tokens.

### Layout

| Property | Token |
|----------|-------|
| Padding (horizontal) | `sys.spacing.sm` |
| Padding (vertical) | `sys.spacing.2xs` |
| Gap (icon to label) | `sys.spacing.2xs` |
| Minimum height | — |
| Minimum width | — |

### Typography

| Slot | Token |
|------|-------|
| Label | `sys.typography.label-large` |

### Color — `filled` variant

| Property | Token |
|----------|-------|
| Background | `sys.color.primary` |
| Label | `sys.color.on-primary` |
| Icon | `sys.color.on-primary` |

### Color — `outlined` variant

| Property | Token |
|----------|-------|
| Background | transparent |
| Border | `sys.color.outline` |
| Label | `sys.color.primary` |
| Icon | `sys.color.primary` |

### Color — `text` variant

| Property | Token |
|----------|-------|
| Background | transparent |
| Label | `sys.color.primary` |
| Icon | `sys.color.primary` |

### Radius

| Property | Token |
|----------|-------|
| Corner radius | `sys.radius.button` |

### Border width

| Property | Token |
|----------|-------|
| Default border | `sys.border-width.default` |
| Focus / emphasis border | `sys.border-width.emphasis` (use inset to prevent layout shift) |

### Elevation

| State | Token |
|-------|-------|
| Default | `sys.elevation.resting` |
| Hover | `sys.elevation.interactive` |
| Pressed | `sys.elevation.resting` |

## States

Document every state. Mark web-only or RN-only where applicable.

| State | Web | React Native | Visual changes |
|-------|:---:|:---:|---|
| Default | yes | yes | Base visual spec. |
| Hover | yes | no (see notes) | Apply `sys.state.hover` overlay. RN has no hover; skip. |
| Focus (keyboard) | yes | limited | Render focus ring using `sys.state.focus.ring-color` and `sys.state.focus.ring-width`. RN: focus applies when navigating via hardware keyboard on tvOS/Android TV; otherwise not visible. |
| Pressed | yes | yes | Apply `sys.state.pressed` overlay. On RN, this is the primary feedback state. |
| Selected | yes | yes | Apply `sys.state.selected.container-opacity` overlay on container. |
| Disabled | yes | yes | Apply `sys.state.disabled.container-opacity` to container and `sys.state.disabled.content-opacity` to content. Suppress events. |
| Loading | yes | yes | Show a spinner in place of the leading icon (or overlaid). Suppress events. |
| Error | optional | optional | Only if the component surfaces error state (e.g. form fields). Use `sys.color.error` family. |

### State transitions

| From | To | Duration | Easing |
|------|----|----------|--------|
| Default | Hover | `sys.motion.duration.short` | `sys.motion.easing.standard` |
| Default | Pressed | `sys.motion.duration.short` | `sys.motion.easing.standard` |
| Default | Disabled | 0 | — |

## Behavior

- Primary interaction: what triggers the primary event (click / press / Enter / Space).
- Keyboard behavior (web): Tab to focus, Enter and Space to activate. List any additional shortcuts.
- Touch behavior (RN): tap to activate, pressed feedback on tap-down.
- Edge cases: what happens with very long labels, empty states, rapid repeated activation, etc.
- Transitions: any enter/exit animations, their durations and easings (reference `sys.motion.*`).

## Interaction feedback

Document the press-feedback pattern. Every interactive, pressable surface in this system uses Material 3 ripple feedback — a circular pulse originating at the click point, expanding and fading.

| Aspect | Value |
|--------|-------|
| Feedback type | Material 3 ripple (press) + flat state-layer overlay (hover / focus). |
| Web implementation | Use the shared `useRipple()` primitive from `reference/components/ds/ripple/`. Do NOT reimplement. Pass `color` if the container's `currentColor` isn't the correct overlay color (rare). |
| React Native equivalent | Android: `android_ripple={{ color }}` on `<Pressable>`. iOS: `activeOpacity` / `android_disableSound=false` fallback since native ripple is Android-only; use a short opacity transition at `sys.stateLayer.sysPressed` instead. |
| Keyboard | Enter / Space trigger a centered ripple (handled automatically by the hook). |
| Tokens used | `sys.stateLayer.sysPressed` (opacity, 0–100) drives the initial overlay opacity. Color is `currentColor` by default — inherits from the surface's text color to match M3's "on-color at pressed opacity" contract. |
| Reduced motion | The primitive respects `prefers-reduced-motion: reduce` — the scale animation is skipped and the ripple simply fades for ~180 ms instead of expanding. No consumer config required. |
| When to suppress | Non-interactive surfaces (static cards, labels). Also suppress when `disabled` or `loading` — the hook's `disabled` option handles this. |

Variant-specific overrides: if a component's on-color differs per variant (e.g. a destructive button where the ripple should use `sys-error` instead of `currentColor`), pass an explicit `color` to `useRipple`.

## Accessibility

### Web (Angular, React)

- Role: — (e.g. `button`, `link`, `dialog`).
- ARIA attributes required: — (e.g. `aria-disabled`, `aria-pressed`, `aria-expanded`, `aria-label`).
- Keyboard support: — (e.g. Tab, Enter, Space, Escape).
- Focus management: — (where focus goes on open/close, on submit, etc.).
- Label requirements: — (when an explicit `aria-label` is required).
- Contrast: every color pair used by the component must meet WCAG 2.2 AA. The `sys.color.on-*` pairings are pre-verified.

### React Native

- `accessibilityRole`: — (e.g. `button`, `link`, `header`).
- `accessibilityState`: — (e.g. `{ disabled, selected, busy }`).
- `accessibilityLabel`: — (how it is derived: prop, content, fallback).
- `accessibilityHint`: — (optional, describes the result of the action).
- Touch target: minimum 44×44 pt. Use `hitSlop` if the visual target is smaller.

## Reference implementation paths

- React reference (Next.js): `reference/src/components/<component-name>/`
- Spec file: `specs/<component-name>.spec.md` (this file)
- Angular implementation: generated per-consumer in the ComPsych Angular repo using `adopters/angular/CLAUDE.md`.
- React Native implementation: generated per-consumer in the ComPsych RN repo using `adopters/react-native/CLAUDE.md`.

## Change log

| Date | Change | Author |
|------|--------|--------|
| YYYY-MM-DD | Initial draft. | — |
