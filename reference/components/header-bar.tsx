'use client';

import { useTheme } from '@/lib/theme-context';
import { ThemeSwitcher } from './theme-switcher';

/**
 * Sticky header that sits above the main content column and houses the
 * brand × product theme switcher plus a live data-theme readout. The bar
 * spans the full width of the content column (i.e. everything to the
 * right of the sidebar) and is the primary — and only — live surface for
 * the theme selection UI. See Nav for the sidebar, which no longer
 * embeds the switcher.
 *
 * Every color, border, and spacing value resolves through `sys.*` tokens;
 * this component follows the same rule the rest of the gallery
 * demonstrates.
 */
export function HeaderBar() {
  const { themeKey } = useTheme();

  return (
    <header
      className="sticky top-0 z-10 flex items-center gap-4 px-10 shrink-0"
      style={{
        height: 56,
        backgroundColor:
          'var(--sys-color-roles-surface-surface-container-sys-surface-container-low, #f9fafb)',
        borderBottom:
          '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
      }}
    >
      <span
        className="text-[11px] uppercase tracking-wider font-medium"
        style={{
          color:
            'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
        }}
      >
        Theme
      </span>

      <ThemeSwitcher />

      <div className="flex-1" />

      <code
        className="text-xs font-mono whitespace-nowrap"
        style={{
          color:
            'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
        }}
        aria-live="polite"
      >
        data-theme=&quot;{themeKey}&quot;
      </code>
    </header>
  );
}
