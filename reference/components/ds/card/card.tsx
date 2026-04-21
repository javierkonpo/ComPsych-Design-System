'use client';

import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { useRipple } from '../ripple';
import styles from './card.module.css';

export type CardVariant = 'outlined' | 'filled' | 'image' | 'gradient';
export type CardSize = 'sm' | 'md' | 'lg' | 'xl';

interface CardOwnProps {
  /** Visual style. */
  variant?: CardVariant;
  /** Size controls padding, radius, and internal gap. */
  size?: CardSize;
  /** Makes the card a pressable surface (state-layer + focus + ripple). */
  interactive?: boolean;
  /** Only meaningful with `interactive`. */
  disabled?: boolean;
  /** Highlights as the active/selected item in a set. */
  current?: boolean;
  /** If set, the card renders as an anchor and forces interactive. */
  href?: string;
  /** Polymorphic element override (`div` / `article` / `section` / `a` / `button`). */
  as?: ElementType;
  /** Required for variant='image'. CSS background-image URL. */
  backgroundImage?: string;
  /** Stretches the card to 100% of its container width. */
  fullWidth?: boolean;
  /** Card content — compose freely. */
  children?: ReactNode;
  /** Additional class name. */
  className?: string;
  /** Additional inline style. */
  style?: CSSProperties;
}

// The union of element-specific event / accessibility props. Kept narrow on
// purpose: most consumers use one of a handful of tags; spreading via `...rest`
// covers the rest.
type PolymorphicProps = CardOwnProps &
  Omit<HTMLAttributes<HTMLElement>, keyof CardOwnProps | 'color'> &
  Pick<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    'href' | 'target' | 'rel'
  > &
  Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>;

export type CardProps = PolymorphicProps;

/**
 * Card — self-contained, bordered or surfaced content block.
 *
 * Spec: specs/card.spec.md
 *
 * Four variants (outlined, filled, image, gradient), four sizes
 * (sm/md/lg/xl), optional interactive / current / disabled / full-width
 * modifiers. All visual properties resolve to sys.* CSS custom
 * properties so the card re-themes live with the active bundle.
 */
export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  {
    variant = 'outlined',
    size = 'md',
    interactive: interactiveProp = false,
    disabled = false,
    current = false,
    href,
    as,
    backgroundImage,
    fullWidth = false,
    children,
    className,
    style,
    onClick,
    onPointerDown,
    onKeyDown,
    type,
    ...rest
  },
  ref,
) {
  // A card with href is implicitly interactive.
  const interactive = interactiveProp || Boolean(href);

  // Pick the default element: anchor when href is present, button when
  // interactive-but-no-href, div otherwise. Consumer can override via `as`.
  const Element: ElementType =
    as ?? (href ? 'a' : interactive ? 'button' : 'div');

  const { ripples, rippleProps } = useRipple({ disabled: disabled || !interactive });

  // variant=image requires a backgroundImage; fall back to outlined and
  // warn in dev if not provided.
  const effectiveVariant: CardVariant =
    variant === 'image' && !backgroundImage
      ? (process.env.NODE_ENV === 'development' &&
          // eslint-disable-next-line no-console
          console.warn(
            '[Card] variant="image" requires `backgroundImage`. Falling back to outlined.',
          ),
        'outlined')
      : variant;

  const variantClass = {
    outlined: styles.outlined,
    filled: styles.filled,
    image: styles.image,
    gradient: styles.gradient,
  }[effectiveVariant];

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
    interactive ? styles.interactive : null,
    current ? styles.current : null,
    fullWidth ? styles.fullWidth : null,
    className ?? null,
  ]
    .filter(Boolean)
    .join(' ');

  const combinedStyle: CSSProperties = {
    ...style,
    ...(effectiveVariant === 'image' && backgroundImage
      ? { backgroundImage: `url(${backgroundImage})` }
      : null),
  };

  // Build the element-specific attribute bag. We avoid spreading onto an
  // anchor when there's no href, and we set `type="button"` by default on
  // the button element to prevent accidental form submission.
  const elementProps: Record<string, unknown> = {
    ref,
    className: classes,
    style: combinedStyle,
    'aria-disabled': disabled || undefined,
    'aria-current': current ? 'true' : undefined,
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    },
    ...rest,
  };

  if (interactive) {
    elementProps.onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
      rippleProps.onPointerDown(event);
      onPointerDown?.(event);
    };
    elementProps.onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
      rippleProps.onKeyDown(event);
      onKeyDown?.(event);
    };
  } else if (onPointerDown) {
    elementProps.onPointerDown = onPointerDown;
  }

  if (Element === 'a' && href) {
    elementProps.href = disabled ? undefined : href;
  }
  if (Element === 'button') {
    elementProps.type = type ?? 'button';
    elementProps.disabled = disabled;
  }

  const inner =
    effectiveVariant === 'gradient' ? (
      <div className={styles.gradientInner}>{children}</div>
    ) : (
      children
    );

  return (
    <Element {...elementProps}>
      {interactive ? <span className={styles.overlay} aria-hidden /> : null}
      <div className={styles.content}>{inner}</div>
      {interactive ? ripples : null}
    </Element>
  );
});
