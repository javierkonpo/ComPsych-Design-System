import type { ReactNode } from 'react';

type Tone = 'info' | 'success' | 'warning' | 'error' | 'neutral' | 'rule';

interface Props {
  tone?: Tone;
  title?: string;
  children: ReactNode;
}

/**
 * Themed callout box for "why this matters", "the rule", "in context",
 * and similar prose blocks. Every color resolves through sys tokens so
 * the tone stays coherent across brands and products.
 */
export function Callout({ tone = 'neutral', title, children }: Props) {
  const palette = palettes[tone];
  return (
    <aside
      className="rounded-lg p-5 md:p-6"
      style={{
        backgroundColor: palette.bg,
        color: palette.fg,
        border: `1px solid ${palette.border}`,
      }}
    >
      {title && (
        <div
          className="ref-heading-md mb-2"
          style={{ color: palette.titleColor ?? palette.fg }}
        >
          {title}
        </div>
      )}
      <div className="ref-body">{children}</div>
    </aside>
  );
}

interface PaletteEntry {
  bg: string;
  fg: string;
  border: string;
  titleColor?: string;
}

const palettes: Record<Tone, PaletteEntry> = {
  neutral: {
    bg: 'var(--sys-color-roles-surface-surface-container-sys-surface-container, #f3f4f6)',
    fg: 'var(--sys-color-roles-surface-surface-sys-on-surface, #1b1d22)',
    border: 'var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
  },
  info: {
    bg: 'var(--sys-color-roles-custom-info-sys-info-container, #daecff)',
    fg: 'var(--sys-color-roles-custom-info-sys-on-info-container, #162755)',
    border: 'var(--sys-color-roles-custom-info-sys-info, #226cee)',
  },
  success: {
    bg: 'var(--sys-color-roles-custom-success-sys-success-container, #c4e9d0)',
    fg: 'var(--sys-color-roles-custom-success-sys-on-success-container, #030c09)',
    border: 'var(--sys-color-roles-custom-success-sys-success, #278647)',
  },
  warning: {
    bg: 'var(--sys-color-roles-custom-warning-sys-warning-container, #fdeed9)',
    fg: 'var(--sys-color-roles-custom-warning-sys-on-warning-container, #3a2304)',
    border: 'var(--sys-color-roles-custom-warning-sys-warning, #d67d00)',
  },
  error: {
    bg: 'var(--sys-color-roles-error-sys-error-container, #f7d4d4)',
    fg: 'var(--sys-color-roles-error-sys-on-error-container, #570f0f)',
    border: 'var(--sys-color-roles-error-sys-error, #d82727)',
  },
  rule: {
    bg: 'var(--sys-color-roles-accent-primary-sys-primary-container, #070f36)',
    fg: 'var(--sys-color-roles-accent-primary-sys-on-primary-container, #ffffff)',
    border: 'var(--sys-color-roles-accent-primary-sys-primary, #075cba)',
  },
};
