/**
 * Code Connect mapping for the Figma Cards component (node 1117:9829 in
 * the ComPsych DS — Core Components file).
 *
 * Figma has four separate card sub-families; this mapping targets the
 * canonical Service Card shape, which is the one `<Card />` in the
 * React reference directly implements. Content / Action / Metric cards
 * are compositions on top of the same base — they can be added as
 * separate figma.connect() calls when those specializations ship.
 *
 * Figma variant props (Service Card) → React props:
 *   Size     → size  (sm / md / lg / xl — xs not exposed on the React API)
 *   Style    → variant  (Outlined / Filled / Image / Gradient)
 *   State    → mostly Enabled; Disabled maps to `disabled`
 *   Viewport → not a prop on the React side (responsive by containment)
 *
 * To publish: `npx @figma/code-connect publish` with a Figma PAT once the
 * DS Figma file is published as a library. MCP add_code_connect_map
 * returns "Published component not found" until that happens — same
 * note as on button.figma.tsx.
 */

import figma from '@figma/code-connect';
import { Card } from './card';

figma.connect(
  Card,
  'https://www.figma.com/design/VFBn7KCDy3FSIlvhNo3ylq/ComPsych-Design-System---Core-Components?node-id=1117-9829',
  {
    props: {
      variant: figma.enum('Style', {
        Outlined: 'outlined',
        Filled: 'filled',
        Image: 'image',
        Gradient: 'gradient',
      }),
      size: figma.enum('Size', {
        sm: 'sm',
        md: 'md',
        lg: 'lg',
        xl: 'xl',
      }),
      disabled: figma.enum('State', {
        Enabled: false,
        Hovered: false,
        Focused: false,
        Pressed: false,
        Disabled: true,
        Current: false,
      }),
      current: figma.enum('State', {
        Enabled: false,
        Hovered: false,
        Focused: false,
        Pressed: false,
        Disabled: false,
        Current: true,
      }),
    },
    example: ({ variant, size, disabled, current }) => (
      <Card
        variant={variant}
        size={size}
        disabled={disabled}
        current={current}
      >
        Content
      </Card>
    ),
  },
);
