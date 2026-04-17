# ComPsych Design System — React Native Adopter Instructions

This file is dropped into the root of a React Native project that consumes the ComPsych Design System (DS). It teaches a Claude Code session working inside that project how to consume tokens, apply the active product theme, and follow the system's rules.

---

## What this project consumes

- **Tokens** as a TypeScript export from the `@compsych/design-system` npm package (published to GitHub Packages under the `@compsych` scope).
- **Component specs** shipped inside the same package at `@compsych/design-system/specs/<component-name>.spec.md`. Canonical source lives in the DS repo at `specs/<component-name>.spec.md`.

This project does NOT import components from the DS. React Native components are implemented here, generated from the specs. The specs — not the React reference — are authoritative.

---

## Installing and importing tokens

Install once:

```bash
npm install @compsych/design-system
```

(Requires a `.npmrc` that points the `@compsych` scope at GitHub Packages. See the repo's [`INSTALL.md`](../../INSTALL.md).)

Import the theme bundle that matches the product this codebase ships. Both named exports are supported:

```ts
// Pick one:
import { sys } from '@compsych/design-system/themes/compsych-gro';
import { tokens } from '@compsych/design-system/themes/compsych-gro';
// tokens.sys === sys
```

Swap `compsych-gro` for the brand × product your build targets — one of `compsych-{gro,crc,gn,fmla}` or `brand-{b,c}-{gro,crc,gn,fmla}`.

Real shape of the current generated `tokens.ts`:

```ts
export const sys = {
  colorRoles: {
    accent: {
      primary: {
        sysPrimary: '#075cba',
        sysOnPrimary: '#ffffff',
        sysPrimaryContainer: '#070f36',
        sysOnPrimaryContainer: '#ffffff',
        sysOnPrimaryContainerVariant: '#b9dcff',
      },
      secondary: { /* sysSecondary, sysOnSecondary, ... */ },
      tertiary:  { /* ... */ },
    },
    custom:  { success: { /* ... */ }, warning: { /* ... */ }, info: { /* ... */ } },
    error:   { sysError: '#...', sysOnError: '#...', /* ... */ },
    surface: { surface: { /* ... */ }, surfaceContainer: { /* ... */ }, inverse: { /* ... */ } },
    outline: { sysOutline: '#...', sysOutlineVariant: '#...', /* ... */ },
    addOn:   { primaryFixed: { /* ... */ }, secondaryFixed: { /* ... */ }, surfaces: { /* ... */ } },
    chart:   { /* ... */ },
  },
  typeScale: {
    displayLarge: { sysFontFamily: 'google sans', sysFontSize: 80, sysLineHeight: 80, sysFontWeight: 'regular', sysTracking: -2.4, sysFontWeightEmphasized: 'medium' },
    bodyMedium:   { /* ... */ },
    /* ...14 other roles */
  },
  dimensions: {
    spacing: { padding: { /* sysPadding2, sysPadding4, ... */ }, margin: { /* ... */ }, spacer: { /* ... */ } },
    borderRadius: { sysRadiusNone: 0, sysRadiusXs: 4, sysRadiusSm: 8, sysRadiusMd: 12, sysRadiusLg: 16, sysRadiusFull: 999, /* ... */ },
    borderWidth:  { /* sysBorderThin, sysBorderThick, ... */ },
  },
  iconography: { sysSizeXs: 12, sysSizeSm: 16, sysSizeMd: 20, sysSizeLg: 24, sysSizeXl: 32, sysSizeXxs: 8 },
  stateLayer:  { sysHover: 8, sysFocused: 12, sysPressed: 12, sysDisabledContainer: 0.12, sysDisabledContent: 0.38, sysScrim: 0.32 },
} as const;
```

Names are verbose because every leaf carries a `sys-*` prefix in the Figma source (disambiguating tiers inside Tokens Studio's flat resolution). Property names are camelCase (TS idiom). The imported `tokens.ts` in your bundle is the authoritative catalog and is fully typed — IDE autocomplete surfaces everything available.

---

## The critical rule

> **Only `sys.*` tokens are applied in component code.**
>
> Never `core.*`, never `pd.*` / `product.*`, never `brand.*`. A component that references any of them directly will not respond to theme changes and will break white-labeling. This rule is non-negotiable.

Correct:
```ts
const styles = StyleSheet.create({
  button: {
    backgroundColor: sys.colorRoles.accent.primary.sysPrimary,
    paddingHorizontal: sys.dimensions.spacing.padding.sysPadding4,
    paddingVertical: sys.dimensions.spacing.padding.sysPadding2,
    borderRadius: sys.dimensions.borderRadius.sysRadiusSm,
  },
  label: {
    color: sys.colorRoles.accent.primary.sysOnPrimary,
    fontFamily: sys.typeScale.labelLarge.sysFontFamily,
    fontSize: sys.typeScale.labelLarge.sysFontSize,
    lineHeight: sys.typeScale.labelLarge.sysLineHeight,
  },
});
```

Incorrect:
```ts
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#075CBA',                          // raw hex
    paddingHorizontal: 16,                               // raw px
    color: core.color.primary.corePrimary100,            // wrong tier
  },
});
```

---

## Applying the active product theme

React Native has no CSS. Each bundle is a self-contained `sys` tree — the simplest pattern is to import one bundle and expose its `sys` value through React context.

```tsx
import { createContext, useContext, PropsWithChildren } from 'react';
import { sys as defaultSys } from '@compsych/design-system/themes/compsych-gro';

type Sys = typeof defaultSys;

const DsContext = createContext<Sys>(defaultSys);

export function DsProvider({ sys, children }: PropsWithChildren<{ sys: Sys }>) {
  return <DsContext.Provider value={sys}>{children}</DsContext.Provider>;
}

export function useSys() {
  return useContext(DsContext);
}
```

At the app root, pick the bundle that matches your build:

```tsx
import { sys } from '@compsych/design-system/themes/compsych-fmla';
// ...
<DsProvider sys={sys}>
  <App />
</DsProvider>
```

If the project needs to swap themes at runtime (e.g. a white-label preview for internal tooling), import multiple bundles and switch the context value. Coordinate with the DS team before building this — most production surfaces ship one bundle.

Inside components, read tokens via the hook:

```tsx
export function Button({ label, onPress }: Props) {
  const sys = useSys();
  const { primary } = sys.colorRoles.accent.primary;
  const { labelLarge } = sys.typeScale;
  return (
    <Pressable onPress={onPress} style={{
      backgroundColor: primary.sysPrimary,
      paddingHorizontal: sys.dimensions.spacing.padding.sysPadding4,
      paddingVertical: sys.dimensions.spacing.padding.sysPadding2,
      borderRadius: sys.dimensions.borderRadius.sysRadiusSm,
    }}>
      <Text style={{
        color: primary.sysOnPrimary,
        fontFamily: labelLarge.sysFontFamily,
        fontSize: labelLarge.sysFontSize,
        lineHeight: labelLarge.sysLineHeight,
      }}>
        {label}
      </Text>
    </Pressable>
  );
}
```

Destructure the roles you need at the top of the render to keep the inline paths short.

---

## Finding the canonical spec

Before implementing any UI, read the spec. The specs ship inside the package:

```
node_modules/@compsych/design-system/specs/<component-name>.spec.md
```

(The same files live in the DS repo at `specs/<component-name>.spec.md` if you prefer to browse them on GitHub.)

Pay special attention to:

- The API contract — React Native-specific naming (`onPress` instead of `onClick`, `label` instead of `children`).
- The States section — React Native doesn't have hover. Pressed is the primary interaction feedback.
- The Accessibility → React Native subsection — `accessibilityRole`, `accessibilityState`, `accessibilityLabel`, `accessibilityHint`.

---

## Rules for Claude Code sessions in this React Native project

Follow these strictly:

1. **Never use raw hex codes, raw numeric sizes, or raw font sizes.** Every style must reference a `sys.*` token via the `useSys` hook (or imported `sys` namespace).
2. **Never reference `core.*`, `pd.*`, or `brand.*`.** Only `sys.*` is allowed in component code.
3. **Check the spec before implementing.** The spec is authoritative.
4. **Match the spec's API exactly,** translated to React Native naming. `onPress` not `onClick`, `accessibilityLabel` for labeling, `label` or explicit props instead of `children` text.
5. **Use `StyleSheet.create()`** for styles. Inline style objects are acceptable when they depend on props or context.
6. **Use `lucide-react-native`** for icons. Import icons by name from the spec.

---

## How to implement a component from a spec

1. **Read the spec file end-to-end.** Focus on the React Native-specific accessibility and the web-vs-RN differences in the States section.
2. **Create the component** in `src/components/<component-name>/<ComponentName>.tsx`.
3. **Implement the API.** Use RN-native prop names (`onPress`, `label`, etc.) as listed in the spec's API contract.
4. **Style with `sys.*` tokens only.** Use `useSys()` to read the active theme.
5. **Implement every state.**
   - Hover and focus generally don't apply in React Native (unless targeting Web via React Native Web, tvOS, or hardware keyboards).
   - **Pressed** is the primary feedback state. Use `<Pressable>` and its `style` callback to render the pressed visual.
   - Disabled: pass `disabled` to `<Pressable>` and apply `sys.stateLayer.sysDisabledContainer` / `sys.stateLayer.sysDisabledContent` opacity.
   - Loading: replace leading icon with an `<ActivityIndicator>` or equivalent.
6. **Implement accessibility.** Apply `accessibilityRole`, `accessibilityState`, `accessibilityLabel`, and optional `accessibilityHint` as documented in the spec. Ensure touch target is at least 44×44 pt (use `hitSlop` if the visual target is smaller).

---

## Common patterns

### Pressed feedback

```tsx
<Pressable
  onPress={onPress}
  disabled={disabled}
  accessibilityRole="button"
  accessibilityState={{ disabled, busy: loading }}
  accessibilityLabel={label}
  style={({ pressed }) => [
    baseStyle,
    pressed && { opacity: 1 - sys.stateLayer.sysPressed / 100 },
    disabled && { opacity: sys.stateLayer.sysDisabledContainer },
  ]}
>
  {/* ... */}
</Pressable>
```

### Focus on tvOS / hardware keyboards

If the project targets tvOS or supports hardware keyboards, render a focus ring when the element has focus. On mobile-only targets, skip.

### Typography composition

Each `sys.typeScale.*` role is an object with `sysFontFamily`, `sysFontSize`, `sysLineHeight`, `sysFontWeight`, `sysTracking`, and `sysFontWeightEmphasized`. Map them to the React Native `Text` style fields:

```tsx
const body = sys.typeScale.bodyMedium;
const surface = sys.colorRoles.surface.surface;
<Text style={{
  color: surface.sysOnSurface,
  fontFamily: body.sysFontFamily,
  fontSize: body.sysFontSize,
  lineHeight: body.sysLineHeight,
  letterSpacing: body.sysTracking,
}}>
  {children}
</Text>
```

Consider writing a small helper (e.g. `typographyStyle(sys.typeScale.bodyMedium)`) so you never forget a property when switching roles.
