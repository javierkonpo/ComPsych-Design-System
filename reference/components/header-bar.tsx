'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/lib/theme-context';
import { BrandSelect, ProductSelect } from './theme-switcher';

/**
 * Sticky header above the main content column.
 *
 * Product switcher is the headline: prominent, always visible, first.
 * Brand switcher is advanced — hidden behind a "White-label preview"
 * text button. When the toggle is off, the active brand is force-reset
 * to `compsych` so stakeholders always see the canonical ComPsych look
 * unless they explicitly opted into the white-label preview mode.
 *
 * Toggle state is intentionally local (not persisted). Every reload
 * starts with the advanced Brand control hidden.
 */
export function HeaderBar() {
  const { themeKey, brand, setBrand } = useTheme();
  const [showWhiteLabel, setShowWhiteLabel] = useState(false);

  // Lock brand to `compsych` whenever the white-label toggle is off.
  // Covers the edge case where localStorage persisted a non-default brand
  // from a prior session with the toggle on.
  useEffect(() => {
    if (!showWhiteLabel && brand !== 'compsych') {
      setBrand('compsych');
    }
  }, [showWhiteLabel, brand, setBrand]);

  return (
    <header
      className="sticky top-0 z-10 flex items-center gap-5 px-10 shrink-0"
      style={{
        height: 64,
        backgroundColor:
          'var(--sys-color-roles-surface-surface-container-sys-surface-container-low, #f9fafb)',
        borderBottom:
          '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
      }}
    >
      <span
        className="ref-caption uppercase tracking-wider font-semibold"
        style={{
          color:
            'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
        }}
      >
        Theme
      </span>

      <ProductSelect />

      {showWhiteLabel && (
        <>
          <span
            aria-hidden
            style={{
              width: 1,
              height: 22,
              backgroundColor:
                'var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
            }}
          />
          <BrandSelect />
        </>
      )}

      <div className="flex-1" />

      <code
        className="ref-caption whitespace-nowrap hidden md:inline"
        style={{
          color:
            'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
        }}
        aria-live="polite"
      >
        data-theme=&quot;{themeKey}&quot;
      </code>

      <button
        type="button"
        onClick={() => setShowWhiteLabel((v) => !v)}
        className="text-xs font-medium px-3 py-1.5 rounded transition-colors"
        style={{
          color: showWhiteLabel
            ? 'var(--sys-color-roles-accent-primary-sys-on-primary-container, #ffffff)'
            : 'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
          backgroundColor: showWhiteLabel
            ? 'var(--sys-color-roles-accent-primary-sys-primary-container, #070f36)'
            : 'transparent',
          border:
            '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
        }}
        aria-pressed={showWhiteLabel}
      >
        {showWhiteLabel ? 'Hide white-label' : 'White-label preview'}
      </button>
    </header>
  );
}
