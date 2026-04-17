'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HeroDemo } from '@/components/hero-demo';
import { ArchitectureDiagram } from '@/components/architecture-diagram';
import { Callout } from '@/components/callout';

export default function Home() {
  return (
    <div className="flex flex-col gap-20">
      {/* Hero ----------------------------------------------------------- */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 max-w-3xl">
          <div
            className="ref-caption uppercase tracking-wider font-semibold"
            style={{
              color:
                'var(--sys-color-roles-accent-primary-sys-primary, #075cba)',
              letterSpacing: '0.1em',
            }}
          >
            Reference
          </div>
          <h1 className="ref-heading-display" style={{ margin: 0 }}>
            ComPsych Design System
          </h1>
          <p
            className="ref-body-lg"
            style={{
              color:
                'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
              margin: 0,
            }}
          >
            A multi-product design system powering web and mobile experiences
            across ComPsych&rsquo;s four core products.
          </p>
        </div>

        <HeroDemo />

        <p
          className="ref-body-sm"
          style={{
            color:
              'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
          }}
        >
          Switch the <strong>Product</strong> in the header above to see the
          core components reskin.
        </p>
      </section>

      {/* How we structured this ----------------------------------------- */}
      <section className="flex flex-col gap-6">
        <SectionHeading
          eyebrow="How we structured this"
          title="A four-tier token architecture"
          description="Color, type, spacing, and every other design value flow through four tiers. Each tier has one job, and data moves in a single direction — so the system stays coherent as products and brands multiply."
        />
        <ArchitectureDiagram />
        <p
          className="ref-body max-w-3xl"
          style={{
            color:
              'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
          }}
        >
          Products re-theme at the Product tier. White-label partners re-theme
          at the Brand tier. Both work without changing a single line of
          component code, because components only ever read from the System
          tier.
        </p>
      </section>

      {/* Components: core and product-specific -------------------------- */}
      <section className="flex flex-col gap-6">
        <SectionHeading
          eyebrow="Components"
          title="Core and product-specific, clearly separated"
          description="The system organises components into two groups. Core is where most of the library lives; product-specific extensions arrive when each product needs them."
        />
        <div className="grid gap-5 md:grid-cols-2">
          <ComponentCategoryCard
            eyebrow="Shared across products"
            title="Core components"
            body="A button, an input, a modal — same implementation, themed per product. This is where most of the system lives."
            accent
          />
          <ComponentCategoryCard
            eyebrow="Per-product extensions"
            title="Product-specific components"
            body="When a product needs something unique — for example, a claim-tracking widget that only makes sense in FMLA — we extend the system. Added as each product team requires them."
          />
        </div>
        <p
          className="ref-body-sm"
          style={{
            color:
              'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
          }}
        >
          Core components are being built first. Product-specific components
          arrive as each product&rsquo;s needs are defined.
        </p>
      </section>

      {/* The rule ------------------------------------------------------- */}
      <section>
        <Callout tone="rule" title="The one rule">
          Components only consume <strong>System</strong>-tier tokens. Brand,
          Core, and Product tiers are internal plumbing. Referencing them
          directly in a component would break theme switching and
          white-labeling — so we don&rsquo;t.
        </Callout>
      </section>

      {/* Explore -------------------------------------------------------- */}
      <section className="flex flex-col gap-6">
        <SectionHeading
          eyebrow="Explore"
          title="Three ways into the system"
        />
        <div className="grid gap-4 md:grid-cols-3">
          <ExploreCard
            href="/about"
            title="About this system"
            description="Plain-language overview: what the system is, what it ships, and who maintains what."
          />
          <ExploreCard
            href="/foundations/color"
            title="Foundations"
            description="Color, typography, spacing, elevation, radius, border, and icons — rendered live from the token pipeline."
          />
          <ExploreCard
            href="/components"
            title="Components"
            description="Gallery arrives as each spec stabilises."
            muted
          />
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="flex flex-col gap-2 max-w-3xl">
      {eyebrow && (
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
      )}
      <h2 className="ref-heading-xl" style={{ margin: 0 }}>
        {title}
      </h2>
      {description && (
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
      )}
    </header>
  );
}

function ComponentCategoryCard({
  eyebrow,
  title,
  body,
  accent,
}: {
  eyebrow: string;
  title: string;
  body: string;
  accent?: boolean;
}) {
  return (
    <article
      className="rounded-lg p-6 flex flex-col gap-3"
      style={{
        backgroundColor: accent
          ? 'var(--sys-color-roles-accent-primary-sys-primary-container, #070f36)'
          : 'var(--sys-color-roles-surface-surface-container-sys-surface-container-lowest, #ffffff)',
        color: accent
          ? 'var(--sys-color-roles-accent-primary-sys-on-primary-container, #ffffff)'
          : 'var(--sys-color-roles-surface-surface-sys-on-surface, #1b1d22)',
        border: accent
          ? '1px solid var(--sys-color-roles-accent-primary-sys-primary, #075cba)'
          : '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
      }}
    >
      <div
        className="ref-caption uppercase tracking-wider font-semibold"
        style={{
          color: accent
            ? 'var(--sys-color-roles-accent-primary-sys-on-primary-container-variant, #b9dcff)'
            : 'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
          letterSpacing: '0.08em',
        }}
      >
        {eyebrow}
      </div>
      <h3 className="ref-heading-lg" style={{ margin: 0 }}>
        {title}
      </h3>
      <p className="ref-body" style={{ margin: 0 }}>
        {body}
      </p>
    </article>
  );
}

function ExploreCard({
  href,
  title,
  description,
  muted,
}: {
  href: string;
  title: string;
  description: string;
  muted?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group rounded-lg p-5 flex flex-col gap-2 transition-colors"
      style={{
        border:
          '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
        backgroundColor:
          'var(--sys-color-roles-surface-surface-container-sys-surface-container-lowest, #ffffff)',
        opacity: muted ? 0.68 : 1,
        textDecoration: 'none',
        color:
          'var(--sys-color-roles-surface-surface-sys-on-surface, #1b1d22)',
      }}
    >
      <div className="ref-heading-md flex items-center justify-between">
        <span>{title}</span>
        <ArrowRight
          size={16}
          className="transition-transform group-hover:translate-x-0.5"
          style={{
            color:
              'var(--sys-color-roles-accent-primary-sys-primary, #075cba)',
          }}
        />
      </div>
      <p
        className="ref-body-sm"
        style={{
          color:
            'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
          margin: 0,
        }}
      >
        {description}
      </p>
    </Link>
  );
}
