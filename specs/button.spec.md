# Button

> **Status:** draft
> **Owner:** Konpo Studio
> **Introduced:** 2026-04-21
> **Last updated:** 2026-04-21

---

## Purpose

A button triggers an action. It is the primary interactive element for committing intent — submitting forms, advancing a flow, opening a destructive confirmation, toggling mode. The ComPsych button ships seven visual styles and four sizes so a surface author can match emphasis to context without reaching outside the system.

Use a button for actions the user initiates. Do NOT use a button for navigation that takes the user to a new URL — use a link component (separate spec) for that. Do NOT use a button for purely informational non-interactive elements.

## API contract

### Props

| Name | Type | Default | Required | Notes |
|------|------|---------|----------|-------|
| `variant` | `'filled' \| 'tonal' \| 'outlined' \| 'elevated' \| 'text' \| 'danger' \| 'danger-outlined'` | `'filled'` | no | Visual style. `filled` is the default call-to-action. `danger` and `danger-outlined` are reserved for destructive actions. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | no | Controls height, padding, label typography, and icon size. |
| `iconOnly` | `boolean` | `false` | no | Renders a square icon-only button (no label text). Requires `accessibilityLabel` / `aria-label`. `variant='text'` with `iconOnly=true` is not supported — use a plain icon button instead. |
| `leadingIcon` | `ReactNode` | — | no | Optional icon rendered before the label. Use a Lucide icon element (`<Heart />`). |
| `trailingIcon` | `ReactNode` | — | no | Optional icon rendered after the label. |
| `disabled` | `boolean` | `false` | no | Disables interaction and renders the disabled visual state. |
| `loading` | `boolean` | `false` | no | Renders a spinner in place of the leading icon and suppresses activation. Does not change the label. |
| `label` / `children` | `string` (ReactNode in React) | — | conditionally | Required unless `iconOnly=true`. On React Native, prefer the `label` prop over `children`. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | no | Web-only. Maps to the underlying `<button type="...">`. |
| `fullWidth` | `boolean` | `false` | no | When `true`, the button stretches to the width of its container. |

### Events

| Name (web) | Name (RN) | Payload | Notes |
|------------|-----------|---------|-------|
| `onClick` | `onPress` | `(event) => void` | Fires on activation. Suppressed when `disabled` or `loading`. |
| `onFocus` | `onFocus` | `(event) => void` | Fires when focus enters. |
| `onBlur` | `onBlur` | `(event) => void` | Fires when focus leaves. |

### Naming differences across frameworks

- Web (Angular, React): `onClick`, `onFocus`, `onBlur`, `aria-label`, `children` for the label.
- React Native: `onPress` (not `onClick`), `accessibilityLabel` for the label, pass the label as a `label` prop — no `children` text nodes.
- Icons: pass the icon element directly (React) or a Lucide name string (Angular, RN). The system does not prescribe a specific icon library contract — use `lucide-react`, `lucide-angular`, or `lucide-react-native` per framework. Icon size per button size is fixed by this spec.

### Slots / composition

Single-slot component. The label slot accepts a string. `leadingIcon` and `trailingIcon` are named slots for a single icon element each. No nested composition (no `<Button.Icon>`).

## Visual specification

All values reference `sys.*` tokens.

### Layout — non-icon-only buttons

| Size | Height | Padding X | Padding Y | Gap (icon ↔ label) |
|------|--------|-----------|-----------|---------------------|
| `sm` | 32 | `sys.dimensions.spacing.padding.sysPadding12` (12) | `sys.dimensions.spacing.padding.sysPadding4` (4) | `sys.dimensions.spacing.padding.sysPadding8` (8) |
| `md` | 40 | `sys.dimensions.spacing.padding.sysPadding16` (16) | `sys.dimensions.spacing.padding.sysPadding8` (8) | `sys.dimensions.spacing.padding.sysPadding8` (8) |
| `lg` | 48 | `sys.dimensions.spacing.padding.sysPadding24` (24) | `sys.dimensions.spacing.padding.sysPadding12` (12) | `sys.dimensions.spacing.padding.sysPadding8` (8) |
| `xl` | 56 | `sys.dimensions.spacing.padding.sysPadding32` (32) | `sys.dimensions.spacing.padding.sysPadding16` (16) | `sys.dimensions.spacing.padding.sysPadding8` (8) |

The `text` variant overrides Padding X to `sys.dimensions.spacing.padding.sysPadding0` (the label sits flush with the focus hit area).

### Layout — icon-only

| Size | Dimensions (square) |
|------|---------------------|
| `sm` | 32 × 32 |
| `md` | 40 × 40 |
| `lg` | 48 × 48 |
| `xl` | 56 × 56 |

### Typography

| Size | Role |
|------|------|
| `sm` | `sys.typeScale.labelSmall` (12 / 18) |
| `md` | `sys.typeScale.labelMedium` (14 / 20) |
| `lg` | `sys.typeScale.labelLarge` (16 / 22.4) |
| `xl` | `sys.typeScale.titleSmall` (20 / 28) |

Font family, weight, tracking come from each role's sub-tokens. Button labels use the emphasized weight (`sysFontWeightEmphasized`) when the role defines it, otherwise `sysFontWeight`.

### Icon size

| Size | Token | Pixel |
|------|-------|-------|
| `sm`, `md` | `sys.iconography.sysSizeXs` | 16 |
| `lg` | `sys.iconography.sysSizeSm` | 20 |
| `xl` | `sys.iconography.sysSizeMd` | 24 |

### Radius

| Property | Token |
|----------|-------|
| Corner radius (all sizes, all variants) | `sys.dimensions.borderRadius.sysRadiusFull` (999 → pill) |

### Border width

| Property | Token |
|----------|-------|
| Outlined / Danger Outlined default border | `sys.dimensions.borderWidth.sysStrokeThin` (1) |
| Focus ring | `sys.dimensions.borderWidth.sysStrokeMedium` (1.5) |

### Color — by variant (Enabled state)

| Variant | Background | Label + icon | Border |
|---------|------------|--------------|--------|
| `filled` | `sys.colorRoles.accent.primary.sysPrimary` | `sys.colorRoles.accent.primary.sysOnPrimary` | — |
| `tonal` | `sys.colorRoles.addOn.primaryFixed.sysPrimaryFixedDim` | `sys.colorRoles.addOn.primaryFixed.sysOnPrimaryFixed` | — |
| `outlined` | transparent | `sys.colorRoles.surface.surface.sysOnSurface` | `sys.colorRoles.outline.sysOutline` |
| `elevated` | `sys.colorRoles.surface.surfaceContainer.sysSurfaceContainerLowest` | `sys.colorRoles.surface.surface.sysOnSurface` | — |
| `text` | transparent | `sys.colorRoles.surface.surface.sysOnSurface` | — |
| `danger` | `sys.colorRoles.error.sysError` | `sys.colorRoles.error.sysOnError` | — |
| `danger-outlined` | transparent | `sys.colorRoles.error.sysError` | `sys.colorRoles.error.sysErrorContainer` |

### Elevation

| Variant | Default | Hover |
|---------|---------|-------|
| `elevated` | `sys.elevation.sysLevel2` | `sys.elevation.sysLevel2` |
| `filled`, `danger` | none | `sys.elevation.sysLevel2` |
| `tonal`, `outlined`, `text`, `danger-outlined` | none | none |

## States

| State | Web | React Native | Visual change |
|-------|:---:|:---:|---|
| **Default** | yes | yes | Base visual per variant table. |
| **Hover** | yes | no | State-layer overlay at `sys.stateLayer.sysHover` opacity (8 → 0.08). Overlay color is `sys.colorRoles.accent.primary.sysOnPrimary` on dark-background variants (`filled`, `danger`, `elevated/tonal` with surface-tint) and `sys.colorRoles.accent.primary.sysPrimary` on transparent/light variants (`outlined`, `text`). For `danger-outlined`, overlay is `sys.colorRoles.error.sysError`. `filled` and `danger` additionally pick up `sys.elevation.sysLevel2`. RN has no hover. |
| **Focus** (keyboard) | yes | limited | Apply the hover state-layer **plus** a 1.5 px focus ring in `sys.colorRoles.addOn.primaryFixed.sysOnPrimaryFixedVariant` positioned at `inset: -1px` so it sits just outside the button's outer edge. The ring uses `sys.dimensions.borderWidth.sysStrokeMedium`. `danger` / `danger-outlined` use `sys.colorRoles.error.sysError` for the ring. RN: focus only applies on hardware keyboard / tvOS / Android TV. |
| **Pressed** | yes | yes | State-layer overlay at `sys.stateLayer.sysPressed` opacity (10 → 0.10). Same overlay color rules as hover. No elevation. Primary feedback state on RN. |
| **Disabled** | yes | yes | Container receives `sys.stateLayer.sysDisabledContainer` opacity (48 → 0.48). Content receives `sys.stateLayer.sysDisabledContent` opacity (64 → 0.64). Background swaps to `sys.colorRoles.surface.surfaceContainer.sysSurfaceContainerHighest` for `filled`, `tonal`, `danger`, `elevated` (they all drop their semantic color). `outlined`, `text`, `danger-outlined` keep their transparent background and apply opacity to the border/text. Events suppressed. |
| **Loading** | yes | yes | Leading-icon slot is replaced by a spinner (Lucide `Loader2` or equivalent, rotating at `sys.motion.*` if defined — otherwise a 1 s linear loop). Label remains. Events suppressed. The rest of the visual matches Default. |

### State transitions

Transitions are short and eased in — typical "hot path" interaction feedback. Until motion tokens land, use:

| From → To | Duration | Easing |
|-----------|----------|--------|
| Default → Hover | 120 ms | ease-out |
| Default → Pressed | 80 ms | ease-out |
| Default → Disabled | 0 ms | — |
| Default → Focus | 0 ms (ring snaps in) | — |

## Behavior

- **Primary interaction**: mouse click / touch tap / Enter or Space on the focused button.
- **Keyboard (web)**: Tab / Shift+Tab to enter and leave focus. Enter and Space activate. Space on keyup matches native `<button>` semantics.
- **Touch (RN)**: tap-down shows the pressed visual, release activates unless the touch moved outside the button bounds.
- **Long label**: the label does not wrap — it truncates with an ellipsis. For consumer surfaces that need multi-line buttons, wrap in a larger container and set `fullWidth` with an explicit height override at the call site.
- **Rapid activation**: activation is synchronous — the host is responsible for debouncing if the underlying action is slow. The button does not auto-disable after activation.
- **Loading transition**: when `loading` flips from `false → true`, the leading icon swaps in place without a layout shift (the spinner is the same size). Label remains visible to preserve width.

## Accessibility

### Web (Angular, React)

- **Role**: native `<button>` element. Do not use `<div role="button">`.
- **ARIA attributes**:
  - `aria-disabled="true"` when `disabled` (in addition to the native `disabled` attribute — both are set).
  - `aria-busy="true"` when `loading`.
  - `aria-label` is **required** when `iconOnly=true`. Otherwise the label text is the accessible name.
- **Keyboard support**: native — Tab, Shift+Tab, Enter, Space. No custom handlers needed.
- **Focus management**: focus is managed by the browser on `<button>`. Visible focus ring renders for keyboard focus only (`:focus-visible`).
- **Contrast**: every `sys.color.*` / `sys.color.on-*` pairing in the visual spec is pre-verified at WCAG 2.2 AA. `danger-outlined` text (`sys-error`) on transparent bg inherits its parent's contrast — ensure the parent's surface is light enough.

### React Native

- **`accessibilityRole`**: `"button"`.
- **`accessibilityState`**: `{ disabled, busy: loading }`.
- **`accessibilityLabel`**: derived from the `label` prop when present. **Required** on icon-only buttons.
- **`accessibilityHint`**: optional — describe the result of activation where not obvious from the label.
- **Touch target**: minimum 44 × 44 pt. `sm` (32) and `md` (40) buttons are below this threshold — wrap in a container with `hitSlop` to extend the touch target without changing the visual size.

## Reference implementation paths

- React reference (Next.js): `reference/components/ds/button/`
- Spec file: `specs/button.spec.md` (this file)
- Angular implementation: generated per-consumer via `adopters/angular/CLAUDE.md`.
- React Native implementation: generated per-consumer via `adopters/react-native/CLAUDE.md`.

## Token gaps

These are the places where a Figma value either doesn't have a clean `sys.*` mapping, or where the existing mapping warrants a note. None are blockers — the reference implementation uses the closest available token and this list is the queue for follow-up with the tokens team.

1. **Focus-ring color = `sys.colorRoles.addOn.primaryFixed.sysOnPrimaryFixedVariant` (#4285f4).** The Figma design uses the `on-primary-fixed-variant` role for the focus ring, which resolves to a Google-blue tone unrelated to the active brand primary. This works today across all brand × product bundles, but semantically the role is misapplied — "on-primary-fixed-variant" is not a focus-state token. **Recommendation:** introduce a dedicated `sys.state.focus.ringColor` token, pointing per-brand/product at an appropriate accent.
2. **State-layer overlay color is not a single token.** The Figma component picks the overlay color based on the background — `sys-on-primary` on dark fills, `sys-primary` (or `sys-error` for `danger-outlined`) on light/transparent surfaces. This is consistent with Material 3 but is encoded at the component level rather than as a pair of sys tokens. **Recommendation:** introduce `sys.state.hover.overlayColorOnDark` / `onLight` pairs so the rule is explicit at the token layer.
3. **Motion tokens absent.** Transition durations and easings (120 ms ease-out hover, 80 ms ease-out pressed) are hardcoded numbers in this spec because `sys.motion.*` does not yet exist. **Recommendation:** add `sys.motion.duration.{short,medium}` and `sys.motion.easing.{standard,emphasized}` in a future tokens pass.
4. **Icon size for `xl` uses `sys.iconography.sysSizeMd` (24 px).** No token for 28–32 px sits between `sysSizeMd` (24) and `sysSizeLg` (32). 24 reads slightly small at 56 px button height; acceptable for now. No new token needed unless design asks for it.
5. **`xl` typography uses `sys.typeScale.titleSmall`.** The next step below `titleSmall` (20 / 28) is `labelLarge` (16 / 22.4) which feels under-scaled at xl height. `titleSmall` is semantically a title, not a label — the pairing works visually but is a slight semantic stretch. Flagging for design review.

## Change log

| Date | Change | Author |
|------|--------|--------|
| 2026-04-21 | Initial draft — seven variants, four sizes, five states, iconOnly + loading + fullWidth. | Konpo Studio |
