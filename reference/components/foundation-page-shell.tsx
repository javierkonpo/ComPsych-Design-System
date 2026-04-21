'use client';

import type { ReactNode } from 'react';
import { PlaceholderBanner } from './placeholder-banner';

interface Props {
  eyebrow?: string;
  title: string;
  description: string;
  /** 2–3 sentences of plain-language rationale. Optional — when omitted
   *  the "Why this matters" section is skipped (useful for component
   *  pages that let the live demo carry the intent). */
  whyThisMatters?: ReactNode;
  /** Token displays — anything the foundation needs. */
  children: ReactNode;
}

/**
 * Shared layout for every foundation page. Enforces the stakeholder-facing
 * template: header → why this matters → tokens.
 */
export function FoundationPageShell({
  eyebrow = 'Foundations',
  title,
  description,
  whyThisMatters,
  children,
}: Props) {
  return (
    <div className="flex flex-col gap-14">
      <PlaceholderBanner />

      <header className="flex flex-col gap-3 max-w-3xl">
        <div
          className="ref-caption uppercase tracking-wider font-semibold"
          style={{
            color:
              'var(--sys-color-roles-accent-primary-sys-primary, #075cba)',
            letterSpacing: '0.1em',
          }}
        >
          {eyebrow}
        </div>
        <h1 className="ref-heading-display" style={{ margin: 0 }}>
          {title}
        </h1>
        <p
          className="ref-body-lg"
          style={{
            color:
              'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
            margin: 0,
          }}
        >
          {description}
        </p>
      </header>

      {whyThisMatters && (
        <section className="flex flex-col gap-4">
          <h2 className="ref-heading-lg" style={{ margin: 0 }}>
            Why this matters
          </h2>
          <p className="ref-body-lg max-w-3xl" style={{ margin: 0 }}>
            {whyThisMatters}
          </p>
        </section>
      )}

      {children}
    </div>
  );
}
