'use client';

import { useTheme } from '@/lib/theme-context';

/**
 * Rendered at the top of every Foundations page. When the active product
 * is a known placeholder (e.g. GN), the banner explains why the page may
 * look mostly empty. Otherwise, renders nothing.
 */
export function PlaceholderBanner() {
  const { isPlaceholder, product } = useTheme();
  if (!isPlaceholder) return null;

  return (
    <div
      role="note"
      className="mb-6 p-4 rounded text-sm"
      style={{
        backgroundColor:
          'var(--sys-color-roles-custom-warning-sys-warning-container, #fdeed9)',
        color: 'var(--sys-color-roles-custom-warning-sys-on-warning-container, #3a2304)',
        border:
          '1px solid var(--sys-color-roles-custom-warning-sys-warning, #d67d00)',
      }}
    >
      <strong>Placeholder theme: </strong>
      You&apos;re viewing the <code>{product}</code> theme, which is currently
      a placeholder. Values will populate once the Figma system is defined
      upstream. Swatches, type, and sizes will appear empty or collapsed.
    </div>
  );
}
