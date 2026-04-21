'use client';

import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  type InputHTMLAttributes,
  type Ref,
} from 'react';
import { useRipple } from '../ripple';
import styles from './checkbox.module.css';

export type CheckboxSize = 'sm' | 'md';

/** `true` / `false` for normal tracking, `'indeterminate'` for tri-state. */
export type CheckboxCheckedState = boolean | 'indeterminate';

export interface CheckboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'size' | 'checked' | 'defaultChecked' | 'onChange' | 'type' | 'children'
  > {
  /** Controlled state. Pass `'indeterminate'` for a parent-level tri-state. */
  checked?: CheckboxCheckedState;
  /** Uncontrolled initial state. Ignored when `checked` is set. */
  defaultChecked?: boolean;
  /** Fires with the new boolean value. Indeterminate + click → `true`. */
  onChange?: (checked: boolean) => void;
  /** Visual size. `md` is the default 24 × 24 box; `sm` is 20 × 20. */
  size?: CheckboxSize;
  /** Visible label rendered alongside the box. */
  label?: string;
  /** Secondary text rendered below the label. */
  description?: string;
  /** Danger / error visual. Red border (unselected) or red fill (selected). */
  invalid?: boolean;
}

/**
 * Checkbox — spec: specs/checkbox.spec.md
 *
 * Native `<input type="checkbox">` wrapped in a `<label>` for full-row
 * click-to-toggle. The input is visually hidden and layered over a
 * custom-drawn box. Indeterminate is mirrored onto the DOM input via
 * `useEffect` so assistive tech reports `aria-checked="mixed"`.
 *
 * All visual properties resolve to sys.* CSS variables.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      checked,
      defaultChecked,
      onChange,
      size = 'md',
      label,
      description,
      invalid = false,
      disabled = false,
      id: idProp,
      className,
      ...rest
    },
    ref,
  ) {
    const autoId = useId();
    const id = idProp ?? autoId;
    const inputRef = useRef<HTMLInputElement | null>(null);
    const { ripples, rippleProps } = useRipple({ disabled });

    const isIndeterminate = checked === 'indeterminate';
    const isChecked = checked === true;

    // Mirror the indeterminate flag onto the DOM input so the browser
    // reports `aria-checked="mixed"` via the accessibility tree.
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = isIndeterminate;
      }
    }, [isIndeterminate]);

    // Merge the local ref with the forwarded ref.
    function setRefs(node: HTMLInputElement | null) {
      inputRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as { current: HTMLInputElement | null }).current = node;
    }

    const classes = [
      styles.root,
      styles[size],
      invalid ? styles.invalid : null,
      disabled ? styles.disabled : null,
      isIndeterminate ? styles.indeterminate : null,
      className ?? null,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <label htmlFor={id} className={classes}>
        <span className={styles.control}>
          <input
            ref={setRefs}
            id={id}
            type="checkbox"
            className={styles.input}
            checked={checked === undefined ? undefined : isChecked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            aria-invalid={invalid || undefined}
            onChange={(event) => onChange?.(event.target.checked)}
            onPointerDown={rippleProps.onPointerDown as unknown as React.PointerEventHandler<HTMLInputElement>}
            onKeyDown={rippleProps.onKeyDown as unknown as React.KeyboardEventHandler<HTMLInputElement>}
            {...rest}
          />
          <span className={styles.box} aria-hidden>
            {isChecked && !isIndeterminate && <CheckGlyph />}
            {isIndeterminate && <DashGlyph />}
          </span>
          {ripples}
        </span>
        {(label || description) && (
          <span className={styles.text}>
            {label && <span className={styles.label}>{label}</span>}
            {description && (
              <span className={styles.description}>{description}</span>
            )}
          </span>
        )}
      </label>
    );
  },
);

// ---------------------------------------------------------------------------
// Glyphs — inline SVGs sized to the parent box.
// ---------------------------------------------------------------------------

function CheckGlyph() {
  return (
    <svg
      viewBox="0 0 20 20"
      className={styles.glyph}
      fill="none"
      aria-hidden
    >
      <path
        d="M5 10.5 L8.5 14 L15.5 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DashGlyph() {
  return (
    <svg
      viewBox="0 0 20 20"
      className={styles.glyph}
      fill="none"
      aria-hidden
    >
      <path
        d="M5 10 L15 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
