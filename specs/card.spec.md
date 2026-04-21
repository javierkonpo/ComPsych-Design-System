# Card

> **Status:** draft
> **Owner:** Konpo Studio
> **Introduced:** 2026-04-21
> **Last updated:** 2026-04-21

---

## Purpose

A Card is a self-contained, bordered or surfaced block that groups related content. It's the system's canonical layout container for discrete units — service tiles, stat panels, content summaries, feature blocks, action entry points. Cards sit on a page surface and hold their own content stack (title, body, imagery, actions) without bleeding into neighbors.

Use a Card for content that reads as a single unit. Do NOT use a Card for pure layout (use flex / grid directly), for list rows (use a list item), or for form sections (use a fieldset).

## API contract

### Props

| Name | Type | Default | Required | Notes |
|------|------|---------|----------|-------|
| `variant` | `'outlined' \| 'filled' \| 'image' \| 'gradient'` | `'outlined'` | no | Visual style. `outlined` is the neutral default; `filled` uses the brand container for high-emphasis features; `image` overlays content on a background image; `gradient` uses a primary-to-surface wash for soft emphasis. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | no | Controls internal padding, corner radius, and default typography. |
| `interactive` | `boolean` | `false` | no | When true, the card becomes a pressable surface: adds state-layer on hover / focus / pressed, a focus ring, and an M3 ripple on press. Pairs with `onClick` / `href`. |
| `disabled` | `boolean` | `false` | no | Only meaningful when `interactive`. Applies container + content disabled opacity, suppresses events. |
| `current` | `boolean` | `false` | no | Highlights the card as the active / selected item in a set (matches Metric Card "Current" state). Visual: primary-container border at `sys-stroke-thick` + subtle tint overlay. |
| `href` | `string` | — | no | When set, renders as an anchor (`<a>`) and forces `interactive=true`. |
| `as` | `ElementType` | `'div'` (or `'a'` if `href` set) | no | Polymorphic tag. Use `article` for self-contained content units, `section` for grouped content, `a` for links. |
| `backgroundImage` | `string` (URL) | — | conditional | Required for `variant='image'`. Sets the CSS background image. |
| `fullWidth` | `boolean` | `false` | no | Stretches the card to 100% of its container width. |
| `children` | `ReactNode` | — | yes | Card content. The card does not prescribe a content shape — compose with the system's Button, Chip, type scale roles, icons, etc. |

### Events

| Name (web) | Name (RN) | Payload | Notes |
|------------|-----------|---------|-------|
| `onClick` | `onPress` | `(event) => void` | Fires on activation. Requires `interactive` or `href`. Suppressed when `disabled`. |
| `onFocus` | `onFocus` | `(event) => void` | — |
| `onBlur` | `onBlur` | `(event) => void` | — |

### Naming differences across frameworks

- Web: `onClick`, `href`, `as`, `children`.
- React Native: `onPress`, no `href` (use a navigation library), no `as` (the primitive is always a `Pressable` when interactive, `View` otherwise), pass `children` natively.

### Slots / composition

The Card does not enforce a content shape. Consumers compose freely; common patterns across the Figma set include:

- **Service pattern**: `<Card>` → `Icon + Chip/Arrow` row · `Title + subtle/Label` · `Description` · `Button`.
- **Content pattern**: `<Card>` → media / icon region · category chip · title · metadata row.
- **Action pattern**: `<Card interactive>` → leading icon · title + optional description.
- **Metric pattern**: `<Card interactive>` → label · large value · delta.

None of these are sub-components today. If a pattern earns repeated use, promote it to `<ServiceCard>` / `<MetricCard>` / etc. as compositions on top of the base.

## Visual specification

All values reference `sys.*` tokens.

### Layout — padding & radius by size

| Size | Padding | Radius | Min internal gap |
|------|---------|--------|------------------|
| `sm` | `sys.dimensions.spacing.padding.sysPadding16` (16) | `sys.dimensions.borderRadius.sysRadiusMd` (12) | `sys.dimensions.spacing.padding.sysPadding12` (12) |
| `md` | `sys.dimensions.spacing.padding.sysPadding24` (24) | `sys.dimensions.borderRadius.sysRadiusLg` (16) | `sys.dimensions.spacing.padding.sysPadding16` (16) |
| `lg` | `sys.dimensions.spacing.padding.sysPadding32` (32) | `sys.dimensions.borderRadius.sysRadiusLg` (16) | `sys.dimensions.spacing.padding.sysPadding24` (24) |
| `xl` | `sys.dimensions.spacing.padding.sysPadding48` (48) | `sys.dimensions.borderRadius.sysRadiusXl` (24) | `sys.dimensions.spacing.padding.sysPadding24` (24) |

### Color — by variant (Default state)

| Variant | Background | Content color | Border |
|---------|------------|---------------|--------|
| `outlined` | `sys.colorRoles.surface.surfaceContainer.sysSurfaceContainerLowest` | `sys.colorRoles.surface.surface.sysOnSurface` | `sys.colorRoles.outline.sysOutline`, `sys.dimensions.borderWidth.sysStrokeThin` |
| `filled` | `sys.colorRoles.accent.primary.sysPrimaryContainer` | `sys.colorRoles.accent.primary.sysOnPrimaryContainer` (headings) / `sys.colorRoles.accent.primary.sysOnPrimaryContainerVariant` (supporting text) | — |
| `image` | `backgroundImage` (image) + optional `sys.colorRoles.transparent.neutral.sysWhite50` scrim | `sys.colorRoles.surface.surface.sysOnSurface` on light imagery; consumer responsibility to set `color` if imagery is dark | — |
| `gradient` | Outer: `sys.colorRoles.surface.surfaceContainer.sysSurfaceContainerLowest` with `sys.colorRoles.outline.sysOutline` border; inner `sys.dimensions.borderRadius.sysRadiusLg` region uses a top-to-bottom gradient from `sys.colorRoles.transparent.primary.sysPrimary08` to `sys.colorRoles.transparent.neutral.sysWhite10` | `sys.colorRoles.surface.surface.sysOnSurface` | `sys.colorRoles.outline.sysOutline`, `sys.dimensions.borderWidth.sysStrokeThin` (outer) |

### Elevation

| Variant | Default | Hover (interactive only) |
|---------|---------|--------------------------|
| `outlined`, `gradient` | none | `sys.elevation.sysLevel2` |
| `filled` | `sys.elevation.sysLevel1` | `sys.elevation.sysLevel2` |
| `image` | `sys.elevation.sysLevel1` | `sys.elevation.sysLevel2` |

## States

Only interactive cards have non-default states. Non-interactive cards are always in `Default`.

| State | Web | React Native | Visual change |
|-------|:---:|:---:|---|
| **Default** | yes | yes | Base visual per variant table above. |
| **Current** | yes | yes | Add `sys.dimensions.borderWidth.sysStrokeThick` (2 px) border in `sys.colorRoles.accent.primary.sysPrimary`, replacing the default border. Applies to any variant. |
| **Hover** | yes | no | Apply state-layer overlay in `sys.colorRoles.surface.surface.sysOnSurfaceVariant` at `sys.stateLayer.sysHover` opacity (8 → 0.08). Add `sys.elevation.sysLevel2` shadow. |
| **Focus** (keyboard) | yes | limited | Focus ring at `sys.dimensions.borderWidth.sysStrokeMedium` (1.5 px) in `sys.colorRoles.addOn.primaryFixed.sysOnPrimaryFixedVariant`, inset -1 px so layout doesn't shift. Keeps hover overlay. |
| **Pressed** | yes | yes | M3 ripple feedback (see Interaction feedback). State-layer remains at hover opacity beneath the ripple. No elevation bump. |
| **Disabled** | yes | yes | Container opacity: `sys.stateLayer.sysDisabledContainer` (48 → 0.48). Content opacity: `sys.stateLayer.sysDisabledContent` (64 → 0.64). Events suppressed. |

### State transitions

Until motion tokens land:

| From → To | Duration | Easing |
|-----------|----------|--------|
| Default → Hover | 150 ms | ease-out |
| Default → Current | 0 ms | — |
| Default → Focus | 0 ms | — |
| Default → Disabled | 0 ms | — |

## Behavior

- **Non-interactive** (`interactive=false`): a passive container. Clicks pass through to content; the card itself has no pointer affordance.
- **Interactive** (`interactive=true` or `href` set): the card is a single pressable surface. The entire card area is the hit target. Hover / focus / press / disabled all apply. Exactly one primary action per card — nested interactive elements (buttons inside interactive cards) should be used sparingly and always with `event.stopPropagation()` on the nested handler.
- **Keyboard (web)**: interactive cards are reached via Tab, activated with Enter (and Space when the underlying element is `<button>`).
- **Touch**: tap to activate; pressed state shows the ripple.
- **Long content**: the card grows to fit content; there's no clamp or auto-scroll. For content that needs to stay fixed-height, the consumer applies `max-height` + an inner scroll container.
- **Image variant + no backgroundImage**: fall back to `outlined` rendering and log a dev-mode warning.

## Interaction feedback

| Aspect | Value |
|--------|-------|
| Feedback type | State-layer overlay for hover/focus + M3 ripple on press (interactive cards only). |
| Web implementation | Use `useRipple()` from `reference/components/ds/ripple/` when `interactive` is true. Do NOT reimplement. |
| React Native equivalent | `<Pressable>` with `android_ripple={{ color }}` (Android) or `activeOpacity` fallback (iOS). |
| Tokens used | `sys.stateLayer.sysHover`, `sys.stateLayer.sysPressed`, `sys.stateLayer.sysDisabledContainer`, `sys.stateLayer.sysDisabledContent`. |
| Reduced motion | Primitive respects `prefers-reduced-motion: reduce` — ripple becomes a short opacity fade. |
| When to suppress | Non-interactive variant, `disabled=true`. |

## Accessibility

### Web (Angular, React)

- **Role**: defaults to container semantics (`<div>` / `<article>` / `<section>` — pick via `as`). Interactive cards render as `<a>` (when `href` set) or `<button>` (otherwise), not `<div role="button">`. Use `<article>` when the card represents a self-contained piece of content (news item, product, post); `<section>` when the card groups related content within a larger region.
- **ARIA**:
  - `aria-current="true"` when `current` and the card is part of a set (navigation, list of items).
  - `aria-disabled="true"` when `disabled` (in addition to native `disabled`).
  - `aria-label` required if the card is interactive AND its visible content is not a readable description (e.g. a card where the only text is a number + icon).
- **Keyboard**: handled natively by the chosen element (`<a>` or `<button>`). No custom handlers.
- **Focus visibility**: `:focus-visible` — the focus ring renders only for keyboard focus.
- **Contrast**: every `sys.color.*` / `sys.color.on-*` pairing used is pre-verified at WCAG 2.2 AA.

### React Native

- **`accessibilityRole`**: `"button"` when interactive, `"none"` otherwise. Consumers can override with `"link"` for navigation.
- **`accessibilityState`**: `{ disabled, selected: current }` for interactive cards.
- **`accessibilityLabel`**: derived from card content where possible; consumer sets explicitly when card content is primarily visual.
- **Touch target**: the card is typically ≥ 44 × 44 pt; no `hitSlop` needed unless the consumer shrinks it below that.

## Reference implementation paths

- React reference (Next.js): `reference/components/ds/card/`
- Spec file: `specs/card.spec.md` (this file)
- Angular implementation: generated per-consumer via `adopters/angular/CLAUDE.md`.
- React Native implementation: generated per-consumer via `adopters/react-native/CLAUDE.md`.

## Token gaps

1. **`Gradient/Card Container`** (named fill in Figma) returned an empty value. The Figma "Gradient" variant encodes the actual gradient stops as local style definitions rather than a tokenized value. The reference implementation resolves the gradient using the two tokens Figma does expose — `sys.colorRoles.transparent.primary.sysPrimary08` (top) and `sys.colorRoles.transparent.neutral.sysWhite10` (bottom) — and inlines the CSS `linear-gradient`. **Recommendation:** promote the gradient itself to a `sys.gradient.cardContainer` composite token so adopters don't have to hand-stitch it.
2. **Motion tokens absent.** Card hover / elevation transitions use hardcoded 150 ms ease-out. Same gap as Button. **Recommendation:** `sys.motion.duration.*` and `sys.motion.easing.*` tokens.
3. **Focus-ring color on Card inherits the Button pattern** — uses `sys.colorRoles.addOn.primaryFixed.sysOnPrimaryFixedVariant` (#4285f4). Same semantic mismatch flagged on Button. **Recommendation:** dedicated `sys.state.focus.ringColor`.
4. **Image scrim opacity/color** isn't explicitly tokenized in the Figma design; the spec uses `sys.colorRoles.transparent.neutral.sysWhite50` as a sensible default. Consumers who ship image cards with variable imagery should test contrast on real content.
5. **`Current` state** exists for Metric Cards in Figma but isn't tokenized as a card-level primitive; the spec maps it to `sys.stroke-thick` + `sys.primary` which are both existing tokens — no gap, but worth noting the logical role isn't one-to-one with a single token.

## Change log

| Date | Change | Author |
|------|--------|--------|
| 2026-04-21 | Initial draft — four variants, four sizes, interactive + current + disabled states. | Konpo Studio |
