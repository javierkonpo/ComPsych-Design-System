import Link from 'next/link';
import type { ReactNode } from 'react';
import { StatusPill } from '@/components/status-pill';

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-16">
      <header className="flex flex-col gap-3 max-w-3xl">
        <div
          className="ref-caption uppercase tracking-wider font-semibold"
          style={{
            color:
              'var(--sys-color-roles-accent-primary-sys-primary, #075cba)',
            letterSpacing: '0.1em',
          }}
        >
          Overview
        </div>
        <h1 className="ref-heading-display" style={{ margin: 0 }}>
          About this design system
        </h1>
        <p
          className="ref-body-lg"
          style={{
            color:
              'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
            margin: 0,
          }}
        >
          What this is, what&rsquo;s in it, and how it reaches ComPsych&rsquo;s
          products.
        </p>
      </header>

      <Section heading="What this is">
        <p className="ref-body-lg max-w-3xl">
          This is the design system for ComPsych&rsquo;s web and mobile
          products. It defines the visual language — color, typography, spacing,
          elevation — and the components built on top of that language. The
          system is structured to theme across ComPsych&rsquo;s four products
          (GRO, CRC, GN, FMLA) and to support white-labeling for future brand
          partners.
        </p>
      </Section>

      <Section heading={<>What&rsquo;s in this system</>}>
        <div className="grid gap-4 md:grid-cols-2">
          <InventoryCard title="Tokens">
            The values that define how everything looks. Organised in four
            tiers so the system stays clean as it grows.
          </InventoryCard>
          <InventoryCard title="Specifications">
            The source of truth for how each component should behave, look, and
            respond. Authoritative — framework code is generated from them, not
            the other way around.
          </InventoryCard>
          <InventoryCard title="Reference app">
            This site. A living showcase of the system, used for walkthroughs
            and visual verification.
          </InventoryCard>
          <InventoryCard title="Adopter guides">
            Written instructions for ComPsych&rsquo;s Angular and React Native
            teams on how to consume the system in their codebases.
          </InventoryCard>
        </div>
      </Section>

      <Section heading={<>How this reaches ComPsych&rsquo;s products</>}>
        <p className="ref-body-lg max-w-3xl">
          ComPsych&rsquo;s Angular (web) and React Native (mobile) teams adopt
          this system by importing it as a package in their existing codebases.
          They then use Claude Code — the AI coding assistant they already use
          — to generate framework-specific components that follow the
          specifications in this system.
        </p>
        <p
          className="ref-body-lg max-w-3xl mt-4"
          style={{
            color:
              'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
          }}
        >
          Konpo Studio maintains the tokens, specifications, and this reference
          app. ComPsych&rsquo;s engineering teams own the framework-specific
          implementations.
        </p>
      </Section>

      <Section heading="Who maintains what">
        <div className="grid gap-4 md:grid-cols-2">
          <OwnershipCard
            owner="Konpo Studio"
            items={[
              'Tokens',
              'Specifications',
              'Reference app',
              'Adopter guides',
            ]}
          />
          <OwnershipCard
            owner="ComPsych engineering"
            items={[
              'Angular component implementations (web product codebases)',
              'React Native component implementations (mobile product codebases)',
            ]}
          />
        </div>
      </Section>

      <Section heading="Status">
        <div
          className="rounded-lg overflow-hidden"
          style={{
            border:
              '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
            backgroundColor:
              'var(--sys-color-roles-surface-surface-container-sys-surface-container-lowest, #ffffff)',
          }}
        >
          <StatusRow
            label="Foundations (tokens)"
            status="complete"
            statusLabel="Complete"
          />
          <StatusRow
            label="Core components"
            status="planned"
            statusLabel="Planned"
            detail="Specifications being written; reference implementations following."
          />
          <StatusRow
            label="Product-specific components"
            status="planned"
            statusLabel="Planned"
            detail={<>Added as each product&rsquo;s needs are defined.</>}
          />
          <StatusRow
            label="Package distribution"
            status="planned"
            statusLabel="Planned"
            detail="Internal npm package for ComPsych consumption."
            last
          />
        </div>
      </Section>

      <footer
        className="pt-8 mt-4 ref-body-sm"
        style={{
          borderTop:
            '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
          color:
            'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
        }}
      >
        For developers: see the install guide at{' '}
        <Link
          href="https://github.com/javierkonpo/ComPsych-Design-System/blob/main/INSTALL.md"
          style={{
            color:
              'var(--sys-color-roles-accent-primary-sys-primary, #075cba)',
          }}
        >
          INSTALL.md
        </Link>
        .
      </footer>
    </div>
  );
}

// ---------------------------------------------------------------------------

function Section({
  heading,
  children,
}: {
  heading: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5">
      <h2 className="ref-heading-xl" style={{ margin: 0 }}>
        {heading}
      </h2>
      {children}
    </section>
  );
}

function InventoryCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div
      className="rounded-lg p-6 flex flex-col gap-2"
      style={{
        border:
          '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
        backgroundColor:
          'var(--sys-color-roles-surface-surface-container-sys-surface-container-lowest, #ffffff)',
      }}
    >
      <div className="ref-heading-md">{title}</div>
      <p className="ref-body" style={{ margin: 0 }}>
        {children}
      </p>
    </div>
  );
}

function OwnershipCard({ owner, items }: { owner: string; items: string[] }) {
  return (
    <div
      className="rounded-lg p-6 flex flex-col gap-3"
      style={{
        border:
          '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
        backgroundColor:
          'var(--sys-color-roles-surface-surface-container-sys-surface-container-lowest, #ffffff)',
      }}
    >
      <div className="ref-heading-md">{owner}</div>
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li
            key={item}
            className="ref-body flex gap-2.5 items-start"
            style={{
              color:
                'var(--sys-color-roles-surface-surface-sys-on-surface, #1b1d22)',
            }}
          >
            <span
              aria-hidden
              className="shrink-0"
              style={{
                width: 4,
                height: 4,
                borderRadius: 9999,
                marginTop: 9,
                backgroundColor:
                  'var(--sys-color-roles-accent-primary-sys-primary, #075cba)',
              }}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatusRow({
  label,
  status,
  statusLabel,
  detail,
  last,
}: {
  label: string;
  status: 'complete' | 'in-progress' | 'planned';
  statusLabel: string;
  detail?: ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className="px-5 py-4 grid gap-4 items-start"
      style={{
        gridTemplateColumns: 'minmax(220px, 1fr) auto',
        borderBottom: last
          ? 'none'
          : '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
      }}
    >
      <div className="flex flex-col gap-1">
        <div className="ref-body font-medium">{label}</div>
        {detail && (
          <div
            className="ref-body-sm"
            style={{
              color:
                'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
            }}
          >
            {detail}
          </div>
        )}
      </div>
      <StatusPill kind={status} label={statusLabel} />
    </div>
  );
}
