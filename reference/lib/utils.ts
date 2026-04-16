'use client';

import { useEffect, useState } from 'react';
import { useTheme } from './theme-context';

/**
 * Reads the current resolved value of a CSS custom property from <body>.
 * Re-reads whenever the active theme changes. Returns an empty string during
 * SSR / before hydration.
 */
export function useCssVar(varName: string): string {
  const { themeKey } = useTheme();
  const [value, setValue] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const read = () => {
      const v = getComputedStyle(document.body).getPropertyValue(varName).trim();
      setValue(v);
    };
    read();
    // Re-read on the next frame too; the `data-theme` attribute update and
    // the surrounding layout/style work may not have committed by the time
    // this effect runs.
    const id = window.requestAnimationFrame(read);
    return () => window.cancelAnimationFrame(id);
  }, [varName, themeKey]);

  return value;
}

/**
 * Font weight keywords emitted by the token build are plain text
 * (`regular`, `medium`, `semibold`, `bold`, …). CSS `font-weight` only
 * accepts `normal`, `bold`, `lighter`, `bolder`, or a numeric 100–900 —
 * unknown keywords are ignored by the browser. Map to numeric so the
 * right weight actually renders.
 */
const FONT_WEIGHT_MAP: Record<string, number> = {
  thin: 100,
  extralight: 200,
  light: 300,
  regular: 400,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
};

export function normalizeFontWeight(v: string | number | undefined): number {
  if (typeof v === 'number') return v;
  if (!v) return 400;
  const key = String(v).toLowerCase().replace(/\s+/g, '').trim();
  return FONT_WEIGHT_MAP[key] ?? 400;
}

/**
 * Token values for font/size/spacing/radius come through as bare numbers
 * (no `px` unit). CSS needs a unit on those properties. Append `px` unless
 * the value is already unit-qualified or clearly unit-less (weight, ratio).
 */
export function toPx(v: string | number | undefined): string {
  if (v === undefined || v === null || v === '') return '0';
  if (typeof v === 'number') return `${v}px`;
  const trimmed = v.trim();
  if (trimmed === '') return '0';
  // Already has a unit?
  if (/[a-z%]$/i.test(trimmed)) return trimmed;
  // Numeric string → append px.
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return `${trimmed}px`;
  return trimmed;
}

/**
 * A hardcoded fallback font stack. The token export specifies `google sans`
 * as the family, but Google Sans is not a public Google Font — applying it
 * directly in CSS produces a silent fallback to whatever the browser picks.
 * Use a real stack so the rendered text has a consistent identity.
 */
export const UI_FONT_STACK =
  'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

/**
 * Copy helper — returns a promise, triggers clipboard write. Callers can
 * display a confirmation on resolve.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
