/**
 * Code Connect mapping for the Figma Checkbox component (node 17:1179 in
 * the ComPsych DS Core Components file).
 *
 * Figma variant props -> React props:
 *   Size      -> size        (sm / md)
 *   Selection -> checked     (Unselected -> false, Selected -> true,
 *                             Indeterminate -> 'indeterminate')
 *   State     -> disabled / invalid (Disabled -> disabled=true,
 *                                    Danger -> invalid=true;
 *                                    Enabled/Hovered/Focused/Pressed
 *                                    are interaction states and do
 *                                    not map to props)
 *
 * Publish with `npx @figma/code-connect publish` once the Core Components
 * file is published as a Figma library.
 */

import figma from '@figma/code-connect';
import { Checkbox } from './checkbox';

figma.connect(
  Checkbox,
  'https://www.figma.com/design/VFBn7KCDy3FSIlvhNo3ylq/ComPsych-Design-System---Core-Components?node-id=17-1179',
  {
    props: {
      size: figma.enum('Size', {
        Sm: 'sm',
        Md: 'md',
      }),
      checked: figma.enum('Selection', {
        Unselected: false,
        Selected: true,
        Indeterminate: 'indeterminate',
      }),
      disabled: figma.enum('State', {
        Enabled: false,
        Hovered: false,
        Focused: false,
        Pressed: false,
        Disabled: true,
        Danger: false,
      }),
      invalid: figma.enum('State', {
        Enabled: false,
        Hovered: false,
        Focused: false,
        Pressed: false,
        Disabled: false,
        Danger: true,
      }),
    },
    example: ({ size, checked, disabled, invalid }) => (
      <Checkbox
        size={size}
        checked={checked}
        disabled={disabled}
        invalid={invalid}
        label="Label"
      />
    ),
  },
);
