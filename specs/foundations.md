# Foundations

The foundation layer of the ComPsych Design System. This document is the human-readable companion to the token JSON under `tokens/`. Every designer and engineer working in or with this system should read it.

> **Status note (post Tokens Studio migration).** The token role names and grouping below describe the *intended* semantic structure. The currently-populated `tokens/*.json` were migrated from the Tokens Studio Figma export and use slightly different group paths and leaf names — notably `sys.color-roles.*.sys-*`, `sys.type-scale.*.sys-*`, `sys.dimensions.*`, `sys.state-layer.*` instead of the flatter `sys.color.*`, `sys.typography.*`, `sys.spacing.*`, `sys.state.*` described here. See `tokens-studio-import/MIGRATION_REPORT.md` for the full mapping and the open question about cleaning up the Figma source. The adopter `CLAUDE.md` files under `adopters/` show real examples of the currently-emitted names; use those when writing component code today.

---

## The four-tier architecture

The system is organized into four tiers. Data flows in one direction only:

```
Brand  →  Core  →  Product  →  System
```

### Tier 4 — Brand

**Scope:** White-label configuration. Sets raw values per brand mode.

**Owns:** Hex values for every hue family. Optional font family overrides. Optional radius and density preferences.

**Does not own:** Semantic roles, component-level tokens, product-specific theming.

**File:** `tokens/brand/<brand>.json` (one per brand mode).

### Tier 1 — Core

**Scope:** Raw primitives. The inventory.

**Owns:** Tonal color ramps (13 tones per hue family), spacing scale, radius scale, border-width scale, typography families/sizes/weights/line-heights/letter-spacing, elevation primitives (shadow + surface-tint), motion primitives (duration + easing).

**Does not own:** Semantic meaning, product-specific mappings, UI-level role names.

**File:** `tokens/core.json`. References Brand.

### Tier 3 — Product

**Scope:** Per-product theming. Where GRO, CRC, GN, and FMLA differ.

**Owns:** Semantic role mappings (`primary`, `on-primary`, `surface`, `error`, etc.) pointed at specific Core primitives. Same role names across products, different underlying Core references.

**Does not own:** Raw values, component-level tokens.

**Files:** `tokens/product/<product>.json` (one per product).

### Tier 2 — System

**Scope:** The public, semantic layer. The only tier UI references.

**Owns:** `sys.color.*`, `sys.typography.*`, `sys.spacing.*`, `sys.radius.*`, `sys.border-width.*`, `sys.elevation.*`, `sys.motion.*`, `sys.state.*`.

**Does not own:** Raw values.

**File:** `tokens/system.json`. References Product (and Core for non-themed primitives like spacing and radius).

### Full propagation chain

```
sys.color.primary
  ← pd.color.primary          (Product: which core role for this product)
  ← core.color.blue.40        (Core: which tonal primitive)
  ← brand.color.blue.40       (Brand: raw hex value)
  = #075CBA
```

### The critical rule

> **Only `sys.*` tokens are ever applied in UI.**
>
> `core.*`, `product.*` (`pd.*`), and `brand.*` are internal plumbing. A component that references any of them directly will not respond to theme changes and will break white-labeling. This rule is non-negotiable.

---

## Color

### HCT model

The system uses **HCT (Hue, Chroma, Tone)**, not HSL. HCT's tone axis is perceptually calibrated — equal steps in tone correspond to equal steps in perceived lightness regardless of hue. This enables systematic contrast guarantees across hues: a given tone pair (e.g. `40` on `90`) will meet WCAG contrast requirements whether the hue is blue, red, or teal.

### 13-tone ramps

Every hue family in Core has 13 tones:

```
0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100
```

- Tone 0 is pure black for that hue.
- Tone 100 is pure white for that hue.
- Tone 40 is the typical "primary" accent.
- Tones 90, 95, 99 are near-white — used for containers in light mode.

### Semantic role catalog (Tier 2)

At the System tier, color is exposed through a fixed set of semantic roles. Each role has a container variant and an `on-*` pair for text/icons.

**Accent roles**
- `sys.color.primary`, `sys.color.on-primary`, `sys.color.primary-container`, `sys.color.on-primary-container`
- `sys.color.secondary`, `sys.color.on-secondary`, `sys.color.secondary-container`, `sys.color.on-secondary-container`
- `sys.color.tertiary`, `sys.color.on-tertiary`, `sys.color.tertiary-container`, `sys.color.on-tertiary-container`

**Status roles**
- `sys.color.error`, `sys.color.on-error`, `sys.color.error-container`, `sys.color.on-error-container`
- `sys.color.success`, `sys.color.on-success`, `sys.color.success-container`, `sys.color.on-success-container`
- `sys.color.warning`, `sys.color.on-warning`, `sys.color.warning-container`, `sys.color.on-warning-container`
- `sys.color.info`, `sys.color.on-info`, `sys.color.info-container`, `sys.color.on-info-container`

**Surface roles**
- `sys.color.surface`, `sys.color.on-surface`
- `sys.color.surface-container-lowest`
- `sys.color.surface-container-low`
- `sys.color.surface-container`
- `sys.color.surface-container-high`
- `sys.color.surface-container-highest`

**Outline roles**
- `sys.color.outline`
- `sys.color.outline-variant`

**Inverse roles** (for content on dark surfaces)
- `sys.color.inverse-surface`, `sys.color.inverse-on-surface`, `sys.color.inverse-primary`

**Supporting roles**
- `sys.color.scrim` — dim overlay under modals/drawers.
- `sys.color.shadow` — the color used for shadows (typically near-black).

### The pairing principle

Every container has a designated `on-*` color for text and icons. **Never place text on a container without its `on-*` counterpart.** The pairings are pre-verified for WCAG 2.2 AA contrast; ad-hoc color combinations are not.

Correct:
```
background: sys.color.primary-container
color:      sys.color.on-primary-container
```

Incorrect:
```
background: sys.color.primary-container
color:      sys.color.on-surface          /* pairing not guaranteed */
```

---

## Typography

### Families

Two families, chosen for role.

- **Google Sans** — used for display, headline, and title sizes. Expressive, emphatic.
- **Inter** — used for body and label sizes. Optimized for UI legibility at small sizes.

A brand may override these families via the Brand tier (e.g. a white-label client can swap Google Sans for IBM Plex Mono across display/headline sizes). The System layer consumes whatever the brand specifies; component specs remain unchanged.

### Roles and sizes

Five semantic type roles, each with three size variants:

| Role | Size variants | Family (default) |
|------|---------------|------------------|
| `display` | large, medium, small | Google Sans |
| `headline` | large, medium, small | Google Sans |
| `title` | large, medium, small | Google Sans |
| `body` | large, medium, small | Inter |
| `label` | large, medium, small | Inter |

Each size is a composite token bundling font-family, font-size, line-height, font-weight, and letter-spacing. System consumers reference the bundle:

```
sys.typography.display-large
sys.typography.headline-medium
sys.typography.body-small
sys.typography.label-large
```

### Assignment guidance

- **Display** — marketing headers, hero sections, empty-state illustrations.
- **Headline** — page titles, section titles.
- **Title** — card titles, dialog titles, list section headers.
- **Body** — paragraph text, descriptions, long-form content.
- **Label** — UI labels, button text, form labels, chips, tabs.

---

## Spacing

### 4px base unit

Every spacing value is a multiple of 4. This keeps layouts on a visual grid and eliminates one-off values.

### 12-step named scale

| Token | Value |
|-------|-------|
| `sys.spacing.3xs` | 4px |
| `sys.spacing.2xs` | 8px |
| `sys.spacing.xs` | 12px |
| `sys.spacing.sm` | 16px |
| `sys.spacing.md` | 20px |
| `sys.spacing.lg` | 24px |
| `sys.spacing.xl` | 32px |
| `sys.spacing.2xl` | 40px |
| `sys.spacing.3xl` | 48px |
| `sys.spacing.4xl` | 64px |
| `sys.spacing.5xl` | 80px |
| `sys.spacing.6xl` | 96px |

### Three categories

- **Padding** — space inside a container, between its edge and its content.
- **Margin** — space outside a container, between it and its siblings or its parent's edge.
- **Gap** — space between sibling children of a flex or grid container. **Prefer `gap` over `margin`** for sibling spacing; it keeps the container in full control and avoids margin-collapse surprises.

### The proximity principle

Related elements are closer together than unrelated elements. When in doubt:

- Inside a single UI unit (a card, a form field with its label): smaller tokens (`3xs`, `2xs`, `xs`).
- Between UI units inside a section: mid tokens (`sm`, `md`, `lg`).
- Between sections of a page: large tokens (`xl`, `2xl`, `3xl`).
- Between major regions or above/below hero sections: very large tokens (`4xl`, `5xl`, `6xl`).

---

## Elevation

### 6 levels, each tied to a UI context

| Token | Level | Used for |
|-------|-------|----------|
| `sys.elevation.flat` | 0 | Page backgrounds, sections, inline content. ~70% of UI. |
| `sys.elevation.resting` | 1 | Cards, list items, tiles. ~20% of UI. |
| `sys.elevation.interactive` | 2 | Hovered cards, navigation rails. |
| `sys.elevation.floating` | 3 | FABs, search bars, toolbars. |
| `sys.elevation.overlay` | 4 | Menus, dialogs, popovers, drawers. |
| `sys.elevation.modal` | 5 | Full-screen modals, bottom sheets. |

### Two cues

Depth is conveyed through two cues, applied together:

- **Shadow** — primary cue in light mode. An element's shadow grows softer and larger as it elevates.
- **Surface tone shift** — primary cue in dark mode, where shadows are less visible. A subtle tint of `sys.color.primary` is mixed into the surface at increasing opacity as elevation rises.

### Scrim

Modal and drawer surfaces pair with a scrim (`sys.color.scrim` at a configured opacity) over the content below. Scrim is not an elevation level itself — it is part of the overlay/modal presentation.

### When NOT to elevate

- Inside a card, nested elements should stay flat. Elevation within a card implies multiple layers of interaction and is usually a design smell.
- Borders and background tone already communicate grouping. Do not add elevation as a decorative flourish.
- Elevation should correlate with interaction, not just with importance.

---

## Icons

### Library

**Lucide.** Consumers install Lucide directly in their project (`lucide-angular`, `lucide-react-native`, etc.). The design system does not re-export icons as tokens.

### Sizes

| Size | Used for |
|------|----------|
| **16px** | Compact contexts: inline icons in dense tables, badges, chips. |
| **20px** | Small: icons inside inputs, buttons. |
| **24px** | Default: navigation, toolbars, most icon-only buttons. |
| **32px** | Large: empty states, illustrations, card headers. |

### Stroke weights

| Weight | Used for |
|--------|----------|
| **1px** | Light — decorative icons, secondary accents. |
| **2px** | Regular — the default for all UI icons. |
| **3px** | Bold — active/selected navigation items, pressed state. |

### Grid and geometry

- 24px grid (Lucide default).
- Round line caps and joins.
- Consistent visual weight across the set.

### Color

Icon color **inherits from text context**. Never assign icon color independently — it should match the `sys.color.on-*` color of its containing text. For icon-only buttons, assign the same `sys.color.on-*` that the button's text would have.

---

## Border Radius

### 8-value named scale

| Token | Value | Used for |
|-------|-------|----------|
| `sys.radius.none` | 0px | Tables, code blocks, dividers, strict structural elements. |
| *(core `2xs`)* | 2px | Checkboxes, tiny badges. Rarely exposed directly at system tier. |
| `sys.radius.input` | 4px | Inputs, selects, toolbar items. |
| `sys.radius.button` | 8px | Buttons, dropdowns, tooltips. |
| `sys.radius.card` | 12px | **System default.** Cards, dialogs, panels. |
| `sys.radius.modal` | 16px | Large cards, modals. |
| `sys.radius.banner` | 24px | Banners, onboarding cards. |
| `sys.radius.pill` | 9999px | Avatars, pills, FABs, chips (capsule/circle). |

### What radius communicates

- **Interactivity.** Rounded corners suggest touch or click; sharp corners suggest structure.
- **Containment.** Larger radii imply a clearer, more distinct container.
- **Tone.** Sharper = industrial, more technical. Softer = friendly, more human.

### The nesting rule

When an element sits inside another, its radius must be smaller than its container's:

```
inner-radius = outer-radius − padding
```

Example: a card with `sys.radius.card` (12px) and `sys.spacing.sm` padding (16px) contains a button with `sys.radius.button` (8px) — still smaller than the card's outer radius.

Violating the nesting rule produces visible gaps between concentric rounded corners.

---

## Border Width

### 3 values

| Token | Value | Used for |
|-------|-------|----------|
| `sys.border-width.none` | 0 | No border. |
| `sys.border-width.default` | 1px | Default for all borders. |
| `sys.border-width.emphasis` | 2px | Focus, selected, error. |

### Purpose

Borders are used for:

- **Separation** — dividing adjacent content without adding fill color.
- **Containment** — outlining inputs, form fields, cards when elevation is not desired.
- **Emphasis** — signaling state (focus, selected, error) via the 1px → 2px transition.

### State signaling via 1px → 2px

The shift from 1px (default) to 2px (emphasis) is the primary visual signal for interactive state. **To prevent layout shift**, do not change true borders on state change. Instead, use an inset border (`outline` or a `box-shadow` inset) for the 2px state. The element's box size remains constant; only the visual weight changes.

---

## Theming: how products and brands combine

The system resolves an active **product** and an active **brand** at build time (or at runtime, depending on strategy).

- **Product** selects which Core primitives back each semantic role. Across GRO, CRC, GN, and FMLA, `sys.color.primary` resolves to different Core hues — blue for GRO, teal for CRC, purple for GN, green for FMLA — but the role name in components never changes.
- **Brand** selects the raw hex values behind every Core primitive. Across ComPsych, Brand B, Brand C, the `core.color.blue.40` resolves to different hex values, but Core's structure and Product's mappings are unchanged.

This means:

- A component written once against `sys.*` tokens correctly renders for **every (brand × product) combination** with no code changes.
- Adding a new brand means creating one new file: `tokens/brand/<brand>.json`.
- Adding a new product means creating one new file: `tokens/product/<product>.json`.
- Components and specs are never touched.

---

## TODO

Specific token values (HCT triples, exact hex values, type sizes, spacing multipliers, shadow definitions, motion timings) are left as placeholders in the token JSON. They will be populated from the Figma data in a follow-up step. The structure and rules documented here are stable.
