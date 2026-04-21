'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import styles from './ripple.module.css';

export interface UseRippleOptions {
  /**
   * CSS color for the ripple fill. Defaults to `currentColor`, which means
   * the ripple inherits the interactive surface's text color — on a filled
   * button (white text on primary) the ripple is white-tinted; on an
   * outlined / text button (dark text on light surface) it's dark-tinted.
   *
   * This matches M3's rule that the pressed-state overlay uses the surface's
   * on-color. Override only when the container's text color doesn't match
   * the intended overlay (e.g. a surface that sets a different icon color).
   */
  color?: string;
  /** Disable ripple (e.g. when the consumer is disabled / loading). */
  disabled?: boolean;
}

export interface UseRippleResult {
  /** Drop inside the interactive container. Absolutely positioned, clipped
   *  to the container's border-radius. Requires the container to be a
   *  positioned element (`position: relative` or any non-static value). */
  ripples: ReactNode;
  /** Spread onto the interactive container — binds pointerdown / keydown. */
  rippleProps: {
    onPointerDown: (event: PointerEvent<HTMLElement>) => void;
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  };
}

interface RippleInstance {
  id: number;
  x: number;
  y: number;
  size: number;
}

/**
 * Duration in ms for the normal (non-reduced-motion) animation. Must match
 * the animation-duration in ripple.module.css so we don't tear down the DOM
 * node before the pulse finishes.
 */
const RIPPLE_DURATION_MS = 450;

/**
 * Material 3 ripple primitive.
 *
 * Usage:
 *
 * ```tsx
 * const { ripples, rippleProps } = useRipple();
 * return (
 *   <button style={{ position: 'relative', overflow: 'hidden' }} {...rippleProps}>
 *     {ripples}
 *     <span>Label</span>
 *   </button>
 * );
 * ```
 *
 * The container must be positioned (`position: relative` or similar) so the
 * ripple layer can fill it, and must clip (`overflow: hidden`) so the
 * animation doesn't escape. The `ripples` node handles the overflow clip
 * itself via `overflow: hidden; border-radius: inherit`, but the PARENT
 * still needs to be a clipping ancestor for browsers that round-clip via
 * the button radius rather than the layer's.
 *
 * Every ripple is a position:absolute circular span that animates from a
 * zero-size dot at the pointer-down coordinate out to the container's
 * farthest-corner radius. Multiple ripples overlap cleanly; the DOM is
 * garbage-collected ~450ms after spawn.
 */
export function useRipple({
  color = 'currentColor',
  disabled = false,
}: UseRippleOptions = {}): UseRippleResult {
  const [instances, setInstances] = useState<RippleInstance[]>([]);
  const counterRef = useRef(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const spawn = useCallback((x: number, y: number, size: number) => {
    const id = ++counterRef.current;
    setInstances((prev) => [...prev, { id, x, y, size }]);
    window.setTimeout(() => {
      if (!mountedRef.current) return;
      setInstances((prev) => prev.filter((r) => r.id !== id));
    }, RIPPLE_DURATION_MS + 50);
  }, []);

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (disabled) return;
      // Only primary button / touch / pen should ripple. Right-click, middle-click
      // etc. are not activations.
      if (event.button !== 0) return;
      const el = event.currentTarget;
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      // Maximum radius = distance from click point to the farthest corner.
      // Doubled to diameter for the animated span's final size.
      const corners: Array<[number, number]> = [
        [0, 0],
        [rect.width, 0],
        [0, rect.height],
        [rect.width, rect.height],
      ];
      const maxRadius = Math.max(
        ...corners.map(([cx, cy]) => Math.hypot(cx - x, cy - y)),
      );
      spawn(x, y, maxRadius * 2);
    },
    [disabled, spawn],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (disabled) return;
      // Only initial press — ignore auto-repeat while the key is held.
      if (event.repeat) return;
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const el = event.currentTarget;
      const rect = el.getBoundingClientRect();
      // Centered ripple sized to cover the full container.
      const size = Math.hypot(rect.width, rect.height);
      spawn(rect.width / 2, rect.height / 2, size);
    },
    [disabled, spawn],
  );

  const ripples = (
    <span className={styles.layer} aria-hidden>
      {instances.map((r) => {
        const style: CSSProperties = {
          left: `${r.x}px`,
          top: `${r.y}px`,
          width: `${r.size}px`,
          height: `${r.size}px`,
          backgroundColor: color,
        };
        return <span key={r.id} className={styles.ripple} style={style} />;
      })}
    </span>
  );

  return {
    ripples,
    rippleProps: { onPointerDown, onKeyDown },
  };
}
