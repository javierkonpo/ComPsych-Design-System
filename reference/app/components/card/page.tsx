'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Target, Play, Info } from 'lucide-react';
import { Card, type CardVariant, type CardSize } from '@/components/ds/card';
import { Button } from '@/components/ds/button';
import { FoundationPageShell } from '@/components/foundation-page-shell';
import { CopyChip } from '@/components/copy-chip';

const VARIANTS: Array<{ value: CardVariant; label: string; description: string }> = [
  { value: 'outlined', label: 'Outlined', description: 'Neutral container with a 1px outline.' },
  { value: 'filled', label: 'Filled', description: 'High-emphasis feature card on primary-container.' },
  { value: 'image', label: 'Image', description: 'Content overlaid on a background image with a scrim.' },
  { value: 'gradient', label: 'Gradient', description: 'Outer shell + inner primary-to-surface wash.' },
];

const SIZES: CardSize[] = ['sm', 'md', 'lg', 'xl'];

const TOKENS: string[] = [
  'sys.colorRoles.surface.surfaceContainer.sysSurfaceContainerLowest',
  'sys.colorRoles.surface.surface.sysOnSurface',
  'sys.colorRoles.surface.surface.sysOnSurfaceVariant',
  'sys.colorRoles.outline.sysOutline',
  'sys.colorRoles.accent.primary.sysPrimary',
  'sys.colorRoles.accent.primary.sysPrimaryContainer',
  'sys.colorRoles.accent.primary.sysOnPrimaryContainer',
  'sys.colorRoles.accent.primary.sysOnPrimaryContainerVariant',
  'sys.colorRoles.addOn.primaryFixed.sysOnPrimaryFixedVariant',
  'sys.colorRoles.transparent.primary.sysPrimary08',
  'sys.colorRoles.transparent.neutral.sysWhite10',
  'sys.colorRoles.transparent.neutral.sysWhite50',
  'sys.dimensions.spacing.padding.sysPadding8',
  'sys.dimensions.spacing.padding.sysPadding16',
  'sys.dimensions.spacing.padding.sysPadding24',
  'sys.dimensions.spacing.padding.sysPadding32',
  'sys.dimensions.spacing.padding.sysPadding48',
  'sys.dimensions.borderRadius.sysRadiusMd',
  'sys.dimensions.borderRadius.sysRadiusLg',
  'sys.dimensions.borderRadius.sysRadiusXl',
  'sys.dimensions.borderWidth.sysStrokeThin',
  'sys.dimensions.borderWidth.sysStrokeMedium',
  'sys.dimensions.borderWidth.sysStrokeThick',
  'sys.stateLayer.sysHover',
  'sys.stateLayer.sysPressed',
  'sys.stateLayer.sysDisabledContainer',
  'sys.stateLayer.sysDisabledContent',
  'sys.elevation.sysLevel1',
  'sys.elevation.sysLevel2',
];

// A simple sample image for the Image variant — a Vercel-hosted gradient
// served as an SVG data URL so the gallery doesn't depend on external
// assets at build time.
const SAMPLE_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 240' preserveAspectRatio='xMidYMid slice'>" +
  "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>" +
  "<stop offset='0' stop-color='%23075cba'/>" +
  "<stop offset='1' stop-color='%23070f36'/>" +
  "</linearGradient></defs>" +
  "<rect width='400' height='240' fill='url(%23g)'/>" +
  "<circle cx='320' cy='80' r='80' fill='%234285f4' opacity='0.3'/>" +
  "<circle cx='80' cy='200' r='60' fill='%23badcff' opacity='0.25'/>" +
  "</svg>";

export default function CardPage() {
  return (
    <FoundationPageShell
      eyebrow="Components"
      title="Card"
      description="A self-contained content block. Four variants, four sizes; optional interactive / current / disabled modifiers. Every value resolves to sys.* tokens and re-themes live with the active bundle."
      whyThisMatters={
        <>
          Cards group related content into a single unit. The four variants
          encode emphasis — outlined for neutral, filled for features,
          gradient for soft focus, image for marketing — and the
          interactive modifier turns any card into a pressable surface
          without reimplementing state-layer and ripple feedback.
        </>
      }
    >
      {/* Live demo -------------------------------------------------- */}
      <Section heading="Live demo" lead="Default props — outlined, md, non-interactive.">
        <Surface>
          <div style={{ width: 360 }}>
            <Card>
              <ServiceCardContent />
            </Card>
          </div>
        </Surface>
      </Section>

      {/* Variants --------------------------------------------------- */}
      <Section heading="Variants" lead="Four visual styles. Pick by the emphasis the content deserves.">
        <Surface>
          <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {VARIANTS.map((v) => (
              <div key={v.value} className="flex flex-col gap-3">
                <Card
                  variant={v.value}
                  backgroundImage={v.value === 'image' ? SAMPLE_IMAGE : undefined}
                >
                  {v.value === 'filled' ? (
                    <FilledCardContent />
                  ) : v.value === 'image' ? (
                    <ImageCardContent />
                  ) : (
                    <ServiceCardContent />
                  )}
                </Card>
                <div
                  className="ref-caption font-mono text-center"
                  style={{
                    color:
                      'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
                  }}
                >
                  {v.value}
                </div>
              </div>
            ))}
          </div>
        </Surface>
      </Section>

      {/* Sizes ------------------------------------------------------ */}
      <Section heading="Sizes" lead="sm (padding 16 / radius 12), md (24 / 16), lg (32 / 16), xl (48 / 24). Internal gap scales proportionally.">
        <Surface>
          <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            {SIZES.map((s) => (
              <div key={s} className="flex flex-col gap-3">
                <Card size={s}>
                  <div className="ref-heading-md">Size {s}</div>
                  <div
                    className="ref-body-sm"
                    style={{
                      color:
                        'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
                    }}
                  >
                    Card at size <code>{s}</code>. Padding and radius scale.
                  </div>
                </Card>
                <div
                  className="ref-caption font-mono text-center"
                  style={{
                    color:
                      'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
                  }}
                >
                  {s}
                </div>
              </div>
            ))}
          </div>
        </Surface>
      </Section>

      {/* Interactive + states -------------------------------------- */}
      <Section
        heading="Interactive"
        lead="Pass `interactive` (or `href`) to turn a Card into a pressable surface. Ripple fires on press; keyboard focus shows a ring; disabled suppresses events."
      >
        <Surface>
          <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            <StateColumn label="Interactive (hover / tab / click)">
              <Card interactive onClick={() => {}}>
                <ActionCardContent />
              </Card>
            </StateColumn>
            <StateColumn label="Current">
              <Card interactive current onClick={() => {}}>
                <ActionCardContent />
              </Card>
            </StateColumn>
            <StateColumn label="Disabled">
              <Card interactive disabled onClick={() => {}}>
                <ActionCardContent />
              </Card>
            </StateColumn>
            <StateColumn label="As link (href)">
              <Card href="#card-link-demo">
                <ActionCardContent />
              </Card>
            </StateColumn>
          </div>
        </Surface>
      </Section>

      {/* Composition patterns -------------------------------------- */}
      <Section
        heading="Composition patterns"
        lead="Cards don't prescribe content shape — these are the Figma Service / Content / Metric patterns built on the base."
      >
        <Surface>
          <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            <Composition label="Service card">
              <Card>
                <ServiceCardContent />
              </Card>
            </Composition>
            <Composition label="Content card (video)">
              <Card variant="gradient" size="sm">
                <ContentCardExample />
              </Card>
            </Composition>
            <Composition label="Metric card">
              <Card interactive size="sm" onClick={() => {}}>
                <MetricCardContent />
              </Card>
            </Composition>
          </div>
        </Surface>
      </Section>

      {/* API reference --------------------------------------------- */}
      <Section heading="API reference" lead="Full prop contract. Web names. React Native: onClick → onPress, aria-* → accessibility*.">
        <div
          className="rounded-lg overflow-hidden"
          style={{
            border:
              '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
            backgroundColor:
              'var(--sys-color-roles-surface-surface-container-sys-surface-container-lowest, #ffffff)',
          }}
        >
          <PropsTable />
        </div>
      </Section>

      {/* Tokens ---------------------------------------------------- */}
      <Section heading="Tokens used" lead="Every sys.* token this component consumes. Click to copy.">
        <div className="flex flex-wrap gap-2">
          {TOKENS.map((t) => (
            <CopyChip key={t} value={t} />
          ))}
        </div>
      </Section>

      {/* Sources --------------------------------------------------- */}
      <Section heading="Canonical sources">
        <div className="flex flex-col gap-2">
          <LinkRow
            label="Specification"
            href="https://github.com/javierkonpo/ComPsych-Design-System/blob/main/specs/card.spec.md"
            hint="specs/card.spec.md"
          />
          <LinkRow
            label="Figma component"
            href="https://www.figma.com/design/VFBn7KCDy3FSIlvhNo3ylq/ComPsych-Design-System---Core-Components?node-id=1117-9829"
            hint="ComPsych DS — Core Components"
          />
          <LinkRow
            label="React reference"
            href="https://github.com/javierkonpo/ComPsych-Design-System/tree/main/reference/components/ds/card"
            hint="reference/components/ds/card/"
          />
        </div>
      </Section>
    </FoundationPageShell>
  );
}

// ---------------------------------------------------------------------------
// Example content blocks used across the sections
// ---------------------------------------------------------------------------

function ServiceCardContent() {
  const onSurface = 'var(--sys-color-roles-surface-surface-sys-on-surface, #1b1d22)';
  const onSurfaceVariant =
    'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)';
  return (
    <>
      <div className="flex items-start justify-between">
        <Target
          size={40}
          style={{
            color: 'var(--sys-color-roles-accent-primary-sys-primary, #075cba)',
          }}
        />
        <ArrowUpRight size={20} style={{ color: onSurfaceVariant }} />
      </div>
      <div className="flex flex-col gap-1">
        <div className="ref-heading-md" style={{ color: onSurface }}>
          Goal tracker
        </div>
        <div className="ref-body-sm" style={{ color: onSurfaceVariant }}>
          Log progress and milestones toward your active goals.
        </div>
      </div>
    </>
  );
}

function FilledCardContent() {
  const onContainer =
    'var(--sys-color-roles-accent-primary-sys-on-primary-container, #ffffff)';
  const onContainerVariant =
    'var(--sys-color-roles-accent-primary-sys-on-primary-container-variant, #badcff)';
  return (
    <>
      <div className="flex items-center justify-between">
        <Target size={40} style={{ color: onContainerVariant }} />
        <ArrowUpRight size={20} style={{ color: onContainerVariant }} />
      </div>
      <div className="flex flex-col gap-1">
        <div className="ref-heading-md" style={{ color: onContainer }}>
          Set a goal
        </div>
        <div
          className="ref-body-sm"
          style={{ color: onContainerVariant }}
        >
          Define what you want to work toward. We&rsquo;ll handle the rest.
        </div>
      </div>
    </>
  );
}

function ImageCardContent() {
  return (
    <div
      className="flex flex-col gap-1"
      style={{
        color: 'var(--sys-color-roles-surface-surface-sys-on-surface, #1b1d22)',
        // Put content at the bottom — image variant has a bottom scrim.
        marginTop: 'auto',
      }}
    >
      <div
        className="ref-heading-md"
        style={{
          color: 'var(--sys-color-roles-accent-primary-sys-on-primary, #ffffff)',
        }}
      >
        Feature launch
      </div>
      <div
        className="ref-body-sm"
        style={{
          color: 'var(--sys-color-roles-accent-primary-sys-on-primary, #ffffff)',
          opacity: 0.85,
        }}
      >
        Image variant lays content over a background image + scrim.
      </div>
    </div>
  );
}

function ActionCardContent() {
  const onSurface = 'var(--sys-color-roles-surface-surface-sys-on-surface, #1b1d22)';
  const onSurfaceVariant =
    'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)';
  return (
    <div className="flex items-center gap-4">
      <Info
        size={32}
        style={{
          color: 'var(--sys-color-roles-accent-primary-sys-primary, #075cba)',
        }}
      />
      <div className="flex flex-col gap-0.5">
        <div className="ref-body font-medium" style={{ color: onSurface }}>
          Account settings
        </div>
        <div className="ref-body-sm" style={{ color: onSurfaceVariant }}>
          Email, password, and notifications.
        </div>
      </div>
    </div>
  );
}

function ContentCardExample() {
  const onSurface = 'var(--sys-color-roles-surface-surface-sys-on-surface, #1b1d22)';
  const onSurfaceVariant =
    'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)';
  return (
    <>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 9999,
          backgroundColor: 'var(--sys-color-roles-accent-primary-sys-primary, #075cba)',
          color: 'var(--sys-color-roles-accent-primary-sys-on-primary, #ffffff)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Play size={20} fill="currentColor" />
      </div>
      <div className="flex flex-col gap-0.5">
        <div
          className="ref-caption uppercase font-semibold"
          style={{
            color: 'var(--sys-color-roles-accent-primary-sys-primary, #075cba)',
            letterSpacing: '0.08em',
          }}
        >
          Video
        </div>
        <div className="ref-body font-medium" style={{ color: onSurface }}>
          Meditation 101
        </div>
        <div className="ref-body-sm" style={{ color: onSurfaceVariant }}>
          5 min · beginner
        </div>
      </div>
      <Button size="sm" variant="outlined" label="Watch now" />
    </>
  );
}

function MetricCardContent() {
  const onSurface = 'var(--sys-color-roles-surface-surface-sys-on-surface, #1b1d22)';
  const onSurfaceVariant =
    'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)';
  return (
    <>
      <div className="ref-caption" style={{ color: onSurfaceVariant }}>
        Sessions this week
      </div>
      <div
        className="ref-heading-display"
        style={{ color: onSurface, margin: 0, fontSize: 40, lineHeight: 1.2 }}
      >
        12
      </div>
      <div
        className="ref-body-sm"
        style={{
          color: 'var(--sys-color-roles-accent-primary-sys-primary, #075cba)',
        }}
      >
        +3 vs last week
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Local page helpers (unchanged pattern from the Button gallery)
// ---------------------------------------------------------------------------

function Section({
  heading,
  lead,
  children,
}: {
  heading: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 max-w-3xl">
        <h2 className="ref-heading-lg" style={{ margin: 0 }}>
          {heading}
        </h2>
        {lead && (
          <p
            className="ref-body"
            style={{
              color:
                'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
              margin: 0,
            }}
          >
            {lead}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

function Surface({ children }: { children: ReactNode }) {
  return (
    <div
      className="rounded-lg p-8"
      style={{
        border:
          '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
        backgroundColor:
          'var(--sys-color-roles-surface-surface-container-sys-surface-container-low, #f9fafb)',
      }}
    >
      {children}
    </div>
  );
}

function StateColumn({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      {children}
      <div
        className="ref-caption text-center"
        style={{
          color:
            'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
        }}
      >
        {label}
      </div>
    </div>
  );
}

function Composition({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      {children}
      <div
        className="ref-caption font-mono text-center"
        style={{
          color:
            'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
        }}
      >
        {label}
      </div>
    </div>
  );
}

function LinkRow({
  label,
  href,
  hint,
}: {
  label: string;
  href: string;
  hint?: string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between rounded-md px-4 py-3"
      style={{
        border:
          '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
        backgroundColor:
          'var(--sys-color-roles-surface-surface-container-sys-surface-container-lowest, #ffffff)',
        color: 'var(--sys-color-roles-surface-surface-sys-on-surface, #1b1d22)',
        textDecoration: 'none',
      }}
    >
      <span className="ref-body font-medium">{label}</span>
      {hint && (
        <span
          className="ref-caption font-mono"
          style={{
            color:
              'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
          }}
        >
          {hint}
        </span>
      )}
    </Link>
  );
}

function PropsTable() {
  const rows: Array<{
    name: string;
    type: string;
    def: string;
    notes: string;
  }> = [
    { name: 'variant', type: "'outlined' | 'filled' | 'image' | 'gradient'", def: "'outlined'", notes: 'Visual style.' },
    { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl'", def: "'md'", notes: 'Padding, radius, internal gap.' },
    { name: 'interactive', type: 'boolean', def: 'false', notes: 'Makes the card pressable (state-layer + focus ring + ripple).' },
    { name: 'disabled', type: 'boolean', def: 'false', notes: 'Only meaningful with interactive.' },
    { name: 'current', type: 'boolean', def: 'false', notes: 'Selected/active within a set. Thick primary border.' },
    { name: 'href', type: 'string', def: '—', notes: 'Renders as <a> and forces interactive.' },
    { name: 'as', type: 'ElementType', def: "'div' (or 'a' if href)", notes: "Override the rendered tag. 'article' / 'section' recommended." },
    { name: 'backgroundImage', type: 'string', def: '—', notes: 'Required for variant="image".' },
    { name: 'fullWidth', type: 'boolean', def: 'false', notes: 'Stretch to container width.' },
    { name: 'onClick', type: '(event) => void', def: '—', notes: 'Fires on activation. Suppressed when disabled.' },
  ];
  return (
    <table className="w-full" style={{ borderCollapse: 'collapse' }}>
      <thead>
        <tr
          style={{
            backgroundColor:
              'var(--sys-color-roles-surface-surface-container-sys-surface-container, #f3f4f6)',
          }}
        >
          <HeaderCell>Prop</HeaderCell>
          <HeaderCell>Type</HeaderCell>
          <HeaderCell>Default</HeaderCell>
          <HeaderCell>Notes</HeaderCell>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr
            key={r.name}
            style={{
              borderTop:
                i === 0
                  ? 'none'
                  : '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
            }}
          >
            <Cell><code className="ref-caption font-mono">{r.name}</code></Cell>
            <Cell>
              <code
                className="ref-caption font-mono"
                style={{
                  color:
                    'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
                }}
              >
                {r.type}
              </code>
            </Cell>
            <Cell><code className="ref-caption font-mono">{r.def}</code></Cell>
            <Cell><span className="ref-body-sm">{r.notes}</span></Cell>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function HeaderCell({ children }: { children: ReactNode }) {
  return (
    <th
      className="text-left px-4 py-3 ref-body-sm font-semibold"
      style={{
        color: 'var(--sys-color-roles-surface-surface-sys-on-surface, #1b1d22)',
      }}
    >
      {children}
    </th>
  );
}

function Cell({ children }: { children: ReactNode }) {
  return (
    <td
      className="px-4 py-3 align-top"
      style={{
        color: 'var(--sys-color-roles-surface-surface-sys-on-surface, #1b1d22)',
      }}
    >
      {children}
    </td>
  );
}
