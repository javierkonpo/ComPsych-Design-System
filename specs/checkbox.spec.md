# Checkbox

> **Status:** draft
> **Owner:** Konpo Studio
> **Introduced:** 2026-04-21
> **Last updated:** 2026-04-21

---

## Purpose

A checkbox lets a user turn a single option on or off, or represent a parent selection that aggregates several child options. It is the system's canonical control for boolean input inside forms, filter panels, and multi-select lists. Every checkbox can be standalone or labelled; every label is clickable.

Use a checkbox for a binary choice or for multi-select lists where more than one option can be active simultaneously. Do NOT use a checkbox where only one of a group may be selected — that's a radio button (separate spec).

## API contract

### Props

| Name | Type | Default | Required | Notes |
|------|------|---------|----------|-------|
| `checked` | `boolean \| 'indeterminate'` | — | no | Controlled state. Pass `'indeterminate'` for a parent-level tri-state. Omit to make the checkbox uncontrolled. |
| `defaultChecked` | `boolean` | `false` | no | Uncontrolled initial state. Ignored when `checked` is set. |
| `onChange` | `(checked: boolean) => void` | — | no | Fires on activation. Receives the new boolean state. Indeterminate always transitions to `true` on activation (matches native HTML). |
| `size` | `'sm' \| 'md'` | `'md'` | no | sm = 20 × 20 box, md = 24 × 24 box. |
| `label` | `string` | — | no | Visible label. The entire label area is clickable and acts as a larger hit target. |
| `description` | `string` | — | no | Secondary text rendered below the label in `sys-on-surface-variant`. |
| `disabled` | `boolean` | `false` | no | Disables interaction and applies the disabled visual treatment. |
| `invalid` | `boolean` | `false` | no | Renders the error/danger visual. Pairs with form-level error messaging; the checkbox itself does not render the message. |
| `id` | `string` | auto | no | Associates `<label>` with the underlying native input. When omitted, `useId()` generates one. |
| `name`, `value`, `required`, `form`, etc. | native input attrs | — | no | Forwarded to the underlying `<input type="checkbox">`. |

### Events

| Name (web) | Name (RN) | Payload | Notes |
|------------|-----------|---------|-------|
| `onChange` | `onValueChange` | `(checked: boolean) => void` | Fires on keyboard Space, mouse click, or touch tap. |

### Naming differences across frameworks

- Web (Angular, React): `onChange(checked)`, `checked`, `label`, `invalid`.
- React Native: no native HTML checkbox — implement with a `Pressable` that draws the box and an `accessibilityRole="checkbox"` + `accessibilityState={{ checked }}`. `onChange` → `onValueChange`. Indeterminate is visual-only; RN's accessibility tree supports `{ checked: 'mixed' }`.
- Indeterminate is a visual state, not a third return value. `onChange` always receives `boolean`.

### Slots / composition

Single-slot: label area. `description` is a named sub-slot under the label. Consumers that need a richer layout (icon + label + secondary text + trailing chip) should treat the Checkbox as a control and own their label composition external to this component — pass `aria-labelledby` on the underlying input instead of `label`.

## Visual specification

All values reference `sys.*` tokens.

### Dimensions by size

| Size | Box | Hit area (state-layer circle) | Gap (box ↔ label) |
|------|-----|--------------------------------|----------------------|
| `sm` | 20 × 20 | 36 × 36 | `sys.dimensions.spacing.padding.sysPadding8` (8) |
| `md` | 24 × 24 | 40 × 40 | `sys.dimensions.spacing.padding.sysPadding8` (8) |

The state-layer circle is invisible in the default (Enabled) state; it becomes a soft tinted disc on hover / pressed and the focus ring pins around it at the outer edge of the box.

### Box — Unselected

| Property | Token |
|----------|-------|
| Background | transparent |
| Border | `sys.colorRoles.outline.sysOutlineFixed` (#8a96a6), `sys.dimensions.borderWidth.sysStrokeMedium` (1.5) |
| Radius | `sys.dimensions.borderRadius.sysRadiusXs` (4) |

### Box — Selected / Indeterminate

| Property | Token |
|----------|-------|
| Background | `sys.colorRoles.accent.primary.sysPrimary` |
| Border | none (painted by the background) |
| Glyph color | `sys.colorRoles.accent.primary.sysOnPrimary` |
| Glyph (Selected) | Check mark, 1.67 stroke |
| Glyph (Indeterminate) | Horizontal bar, 1.67 stroke |

### Box — Danger (`invalid=true`)

| Property | Token |
|----------|-------|
| Unselected border | `sys.colorRoles.error.sysError` |
| Selected / Indeterminate background | `sys.colorRoles.error.sysError` |
| Selected / Indeterminate glyph | `sys.colorRoles.accent.primary.sysOnPrimary` (stays white) |
| Focus ring color | `sys.colorRoles.error.sysError` |

### Label typography

| Size | Role |
|------|------|
| `sm` | `sys.typeScale.bodySmall` (14 / 20) |
| `md` | `sys.typeScale.bodyMedium` (16 / 24) |

Label color `sys.colorRoles.surface.surface.sysOnSurface`; description color `sys.colorRoles.surface.surface.sysOnSurfaceVariant`.

### State-layer circle

| State | Color | Opacity token |
|-------|-------|---------------|
| Hover | `sys.colorRoles.surface.surface.sysOnSurfaceVariant` | `sys.stateLayer.sysHover` (8 → 0.08) |
| Pressed | same | `sys.stateLayer.sysPressed` (10 → 0.10) |
| Selected hover/pressed | `sys.colorRoles.accent.primary.sysPrimary` | same opacities |
| Danger hover/pressed | `sys.colorRoles.error.sysError` | same opacities |

### Focus ring

| Property | Token |
|----------|-------|
| Color | `sys.colorRoles.addOn.primaryFixed.sysOnPrimaryFixedVariant` (default); swapped to `sys.colorRoles.error.sysError` when `invalid` |
| Width | `sys.dimensions.borderWidth.sysStrokeMedium` (1.5 px) |
| Position | `outline-offset: 2px` around the box (not the state-layer circle) so focus is anchored to the visual control |

## States

| State | Web | React Native | Visual change |
|-------|:---:|:---:|---|
| **Default** | yes | yes | Unselected / Selected / Indeterminate visual per tables above. |
| **Hover** | yes | no | State-layer disc fades in at `sys.stateLayer.sysHover` opacity. |
| **Focus** (keyboard) | yes | limited | Focus ring renders at `sys.stateLayer` equivalent with `outline-offset: 2 px` around the box. |
| **Pressed** | yes | yes | State-layer disc at `sys.stateLayer.sysPressed` opacity. Primary feedback state on RN. |
| **Disabled** | yes | yes | Box opacity `sys.stateLayer.sysDisabledContainer` (48 → 0.48). Label opacity `sys.stateLayer.sysDisabledContent` (64 → 0.64). Events suppressed. |
| **Danger** (`invalid=true`) | yes | yes | Border / background swap to `sys.error`; focus ring swaps to `sys.error`. |

States compose with Selection. A Selected + Hovered + Danger checkbox is a filled `sys-error` box with the on-surface-variant hover disc behind it.

## Behavior

- **Primary interaction**: click or tap the box or the label. Keyboard Space when the input is focused.
- **Keyboard**: Tab / Shift+Tab to move focus. Space toggles `checked` between `true` and `false`. Indeterminate, when activated, transitions to `true` (matches HTML spec).
- **Label click**: the label is a `<label htmlFor={id}>` wrapping the native input — a click anywhere on label or description triggers a change.
- **Indeterminate**: set by the consumer via the `checked='indeterminate'` prop. The underlying input's DOM property `indeterminate` is mirrored via `useEffect`. The visual is a horizontal bar inside the filled box.

## Interaction feedback

| Aspect | Value |
|--------|-------|
| Feedback type | M3 state-layer disc on a 40 × 40 (sm: 36 × 36) circle behind the box. Circle picks up `useRipple()` so press fires a ripple inside it. |
| Web implementation | Consume `useRipple()` from `reference/components/ds/ripple/`. Pass the circle as the interactive surface; ripple inherits `currentColor` (sys-primary on selected, sys-error on danger). |
| React Native equivalent | `Pressable` with `android_ripple={{ color, radius: 20 }}` and an opacity fallback on iOS. |
| Reduced motion | Primitive respects `prefers-reduced-motion: reduce`. |
| When to suppress | Disabled. |

## Accessibility

### Web (Angular, React)

- **Role**: native `<input type="checkbox">`. Do NOT use `<div role="checkbox">`.
- **ARIA**:
  - `aria-checked="mixed"` is handled automatically by the native input when `indeterminate` is set (browsers map the DOM property to this ARIA value).
  - `aria-invalid="true"` when `invalid`.
  - `aria-disabled="true"` when `disabled`.
  - `aria-describedby` points at the description or form-error text.
- **Label association**: `<label htmlFor={id}>` wraps the input and visual label.
- **Keyboard**: native — Tab, Shift+Tab, Space.
- **Hit target**: the 40 × 40 (sm: 36 × 36) state-layer circle plus the label satisfy the 44 × 44 minimum comfortably on md; on sm the label's hit area contributes.
- **Contrast**: unselected border in `sys-outline-fixed` at 4.5:1 against `sys-on-surface`. Checked/indeterminate glyph in `sys-on-primary` on `sys-primary` is pre-verified.

### React Native

- **`accessibilityRole`**: `"checkbox"`.
- **`accessibilityState`**: `{ disabled, checked: isIndeterminate ? 'mixed' : Boolean(checked) }`.
- **`accessibilityLabel`**: derived from the `label` prop; consumer sets explicitly when the checkbox has no visible label.
- **Touch target**: 40 × 40 default hit area (matches md state-layer circle). Use `hitSlop` to extend to 44 × 44 when the box is visually smaller.

## Reference implementation paths

- React reference (Next.js): `reference/components/ds/checkbox/`
- Spec file: `specs/checkbox.spec.md` (this file)
- Angular implementation: generated per-consumer via `adopters/angular/CLAUDE.md`.
- React Native implementation: generated per-consumer via `adopters/react-native/CLAUDE.md`.

## Token gaps

1. **No dedicated focus-ring token.** Checkbox (and Button, Card) reuses `sys.colorRoles.addOn.primaryFixed.sysOnPrimaryFixedVariant` for the focus ring. Documented on the Button spec; noting here again so the Checkbox isn't audited in isolation. **Recommendation:** `sys.state.focus.ringColor`.
2. **State-layer overlay color is context-dependent.** Unselected checkbox hover uses `sys-on-surface-variant`; selected uses `sys-primary`; danger uses `sys-error`. The component picks the right color per variant, but the rule isn't tokenized. **Recommendation:** `sys.state.hover.overlayColor.*` pairs (same note flagged on Button and Card).
3. **Motion tokens absent.** State-layer and border-color transitions use hardcoded 120 ms ease-out.

## Change log

| Date | Change | Author |
|------|--------|--------|
| 2026-04-21 | Initial draft — two sizes, tri-state selection, enabled/hover/focus/pressed/disabled/danger states. | Konpo Studio |
