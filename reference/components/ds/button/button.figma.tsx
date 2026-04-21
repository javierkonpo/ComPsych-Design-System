/**
 * Code Connect mapping between the Figma Button component (node 17:1332 in
 * the ComPsych Design System — Core Components file) and the React
 * reference implementation.
 *
 * The Figma component has four variant props:
 *   - Style     : Filled | Tonal | Outlined | Elevated | Text | Danger | Danger Outlined
 *   - Size      : sm | md | lg | xl
 *   - State     : Enabled | Hovered | Focused | Pressed | Disabled
 *   - Icon Only : True | False
 *
 * React maps:
 *   - Style     → `variant`
 *   - Size      → `size`
 *   - Icon Only → `iconOnly`
 *   - State     → not a prop. Default/Disabled are controlled via the
 *                 `disabled` prop; Hovered / Focused / Pressed are
 *                 visual-only states produced by real user interaction and
 *                 don't map to a component prop.
 *
 * To publish: `npx @figma/code-connect publish`. Requires a Figma personal
 * access token. This file is the template Code Connect consumes.
 *
 * Note: MCP `add_code_connect_map` returned "Published component not
 * found" when called against node 17:1332, which suggests the component
 * hasn't been published as a Figma library yet. Once the Core Components
 * file is published as a library (Share → Publish library in Figma), run
 * `npx @figma/code-connect publish --file button.figma.tsx --token $FIGMA_PAT`
 * from this directory to register the mapping. Until then this file is
 * the ready-to-go template; no manual editing required at publish time.
 */

import figma from '@figma/code-connect';
import { Button } from './button';

figma.connect(
  Button,
  'https://www.figma.com/design/VFBn7KCDy3FSIlvhNo3ylq/ComPsych-Design-System---Core-Components?node-id=17-1332',
  {
    props: {
      variant: figma.enum('Style', {
        Filled: 'filled',
        Tonal: 'tonal',
        Outlined: 'outlined',
        Elevated: 'elevated',
        Text: 'text',
        Danger: 'danger',
        'Danger Outlined': 'danger-outlined',
      }),
      size: figma.enum('Size', {
        sm: 'sm',
        md: 'md',
        lg: 'lg',
        xl: 'xl',
      }),
      iconOnly: figma.enum('Icon Only', {
        True: true,
        False: false,
      }),
      disabled: figma.enum('State', {
        Enabled: false,
        Hovered: false,
        Focused: false,
        Pressed: false,
        Disabled: true,
      }),
    },
    example: ({ variant, size, iconOnly, disabled }) => (
      <Button
        variant={variant}
        size={size}
        iconOnly={iconOnly}
        disabled={disabled}
        label="Button"
      />
    ),
  },
);
