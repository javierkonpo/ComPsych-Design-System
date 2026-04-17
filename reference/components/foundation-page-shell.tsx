'use client';

import type { ReactNode } from 'react';
import { PlaceholderBanner } from './placeholder-banner';

interface Props {
  eyebrow?: string;
  title: string;
  description: string;
  /** 2–3 sentences of plain-language rationale. */
  whyThisMatters: ReactNode;
  /** Typically a <RulesGrid /> with dos/donts. */
  rules?: ReactNode;
  /** Token displays, in-context panels — anything the foundation needs. */
  children: ReactNode;
}

/**
 * Shared layout for every foundation page. Enforces the stakeholder-facing
 * template: header → why this matters → usage rules → tokens → (optional)
 * in-context examples.
 */
export function FoundationPageShell({
  eyebrow = 'Foundations',
  title,
  description,
  whyThisMatters,
  rules,
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

      <section className="flex flex-col gap-4">
        <h2 className="ref-heading-lg" style={{ margin: 0 }}>
          Why this matters
        </h2>
        <p className="ref-body-lg max-w-3xl" style={{ margin: 0 }}>
          {whyThisMatters}
        </p>
      </section>

      {rules && (
        <section className="flex flex-col gap-4">
          <h2 className="ref-heading-lg" style={{ margin: 0 }}>
            Usage
          </h2>
          {rules}
        </section>
      )}

      {children}
    </div>
  );
}
