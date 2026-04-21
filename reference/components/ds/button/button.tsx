'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import styles from './button.module.css';

export type ButtonVariant =
  | 'filled'
  | 'tonal'
  | 'outlined'
  | 'elevated'
  | 'text'
  | 'danger'
  | 'danger-outlined';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Visual variant. Defaults to `filled`. */
  variant?: ButtonVariant;
  /** Size. Defaults to `md`. */
  size?: ButtonSize;
  /** Render a square icon-only button. Requires `aria-label`. */
  iconOnly?: boolean;
  /** Icon rendered before the label. Ignored when `loading`. */
  leadingIcon?: ReactNode;
  /** Icon rendered after the label. */
  trailingIcon?: ReactNode;
  /** When true, swaps the leading icon for a spinner and suppresses activation. */
  loading?: boolean;
  /** Stretch the button to the full width of its container. */
  fullWidth?: boolean;
  /** The label. Required unless `iconOnly` is true. */
  label?: string;
  /**
   * Accepted for convenience so consumers can write
   * `<Button>Save</Button>` in React. Maps to `label` under the hood.
   */
  children?: ReactNode;
}

/**
 * Button — the canonical interactive element in the ComPsych Design System.
 *
 * Spec: specs/button.spec.md
 *
 * Seven visual variants, four sizes, five states. All visual properties
 * come from `sys.*` CSS custom properties so the button re-themes live
 * when the active brand × product bundle changes.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'filled',
      size = 'md',
      iconOnly = false,
      leadingIcon,
      trailingIcon,
      loading = false,
      fullWidth = false,
      disabled = false,
      type = 'button',
      label,
      children,
      className,
      onClick,
      ...rest
    },
    ref,
  ) {
    // React ergonomics: `children` is the idiomatic way to pass a label in
    // React, but the framework-agnostic spec names the prop `label`. We
    // accept both and prefer `label` when both are supplied.
    const effectiveLabel =
      label ?? (typeof children === 'string' ? children : undefined) ?? children;

    const isDisabled = disabled || loading;

    // Map variant → CSS module class. Danger-outlined is kebab in the
    // public API but camelCase at the style level — no consumer should
    // care.
    const variantClass = {
      filled: styles.filled,
      tonal: styles.tonal,
      outlined: styles.outlined,
      elevated: styles.elevated,
      text: styles.text,
      danger: styles.danger,
      'danger-outlined': styles.dangerOutlined,
    }[variant];

    const sizeClass = {
      sm: styles.sm,
      md: styles.md,
      lg: styles.lg,
      xl: styles.xl,
    }[size];

    const classes = [
      styles.root,
      variantClass,
      sizeClass,
      iconOnly ? styles.iconOnly : null,
      fullWidth ? styles.fullWidth : null,
      className ?? null,
    ]
      .filter(Boolean)
      .join(' ');

    // Leading icon is replaced by the spinner when loading.
    const leadingSlot = loading ? (
      <span className={`${styles.icon} ${styles.spinner}`} aria-hidden>
        <Loader2 />
      </span>
    ) : leadingIcon ? (
      <span className={styles.icon} aria-hidden>
        {leadingIcon}
      </span>
    ) : null;

    const trailingSlot = trailingIcon ? (
      <span className={styles.icon} aria-hidden>
        {trailingIcon}
      </span>
    ) : null;

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={isDisabled}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        onClick={(event) => {
          if (isDisabled) {
            event.preventDefault();
            return;
          }
          onClick?.(event);
        }}
        {...rest}
      >
        {/* State-layer overlay. Absolutely positioned behind content; opacity
            is driven by :hover / :active via the stylesheet. */}
        <span className={styles.overlay} aria-hidden />

        <span className={styles.content}>
          {leadingSlot}
          {!iconOnly && effectiveLabel !== undefined ? (
            <span className={styles.label}>{effectiveLabel}</span>
          ) : null}
          {trailingSlot}
        </span>
      </button>
    );
  },
);
