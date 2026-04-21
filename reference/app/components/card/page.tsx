'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Target,
  BookOpen,
  Smartphone,
  GraduationCap,
  ListChecks,
  Globe,
  FileText,
  Presentation,
  Mic,
  Play,
  BarChart3,
  Info,
  type LucideIcon,
} from 'lucide-react';
import { Card, type CardSize } from '@/components/ds/card';
import { Button } from '@/components/ds/button';
import { FoundationPageShell } from '@/components/foundation-page-shell';

// ---------------------------------------------------------------------------
// Category registry — each Content Card category maps to a Lucide icon and
// a label. Icon picks visually track the Figma category glyphs (rounded
// 24px strokes) while staying inside the lucide-react bundle the system
// already ships.
// ---------------------------------------------------------------------------

type CategoryKey =
  | 'video'
  | 'podcast'
  | 'slideshow'
  | 'article'
  | 'online-center'
  | 'guide'
  | 'on-demand-training'
  | 'quiz'
  | 'mobile-app'
  | 'report';

interface Category {
  key: CategoryKey;
  label: string;
  icon: LucideIcon;
  headline: string;
  body: string;
}

const CATEGORIES: Category[] = [
  {
    key: 'video',
    label: 'Video',
    icon: Play,
    headline: 'Does using medications like methadone in addiction treatment replace one drug with another?',
    body: 'Medications like methadone are prescribed under monitored, controlled conditions and are safe and effective for treating opioid addiction when used as directed.',
  },
  {
    key: 'podcast',
    label: 'Podcast',
    icon: Mic,
    headline: 'Building resilience through difficult conversations at work',
    body: 'A 22-minute conversation on how managers can listen through disagreement without collapsing the team\u2019s trust.',
  },
  {
    key: 'slideshow',
    label: 'Slideshow',
    icon: Presentation,
    headline: 'Ten habits that protect mental health during a major life change',
    body: 'A visual walkthrough of the small, durable practices that help people stay steady through moves, loss, and new roles.',
  },
  {
    key: 'article',
    label: 'Article',
    icon: FileText,
    headline: 'What to do when anxiety starts showing up at work',
    body: 'Signs to watch for, language for raising it with your manager, and what ComPsych can help with today.',
  },
  {
    key: 'online-center',
    label: 'Online Center',
    icon: Globe,
    headline: 'Caregiver support \u2014 a connected library of tools',
    body: 'Everything you need when you\u2019re caring for a parent, partner, or child: planners, legal templates, and conversation guides.',
  },
  {
    key: 'guide',
    label: 'Guide',
    icon: BookOpen,
    headline: 'A family guide to talking about substance use',
    body: 'A step-by-step guide for having a conversation you\u2019ve been avoiding \u2014 with prompts, pitfalls, and when to ask for help.',
  },
  {
    key: 'on-demand-training',
    label: 'On-Demand Training',
    icon: GraduationCap,
    headline: 'Leading through burnout \u2014 a four-part training',
    body: 'Self-paced training for people managers on recognising burnout signals, restructuring workloads, and holding space for recovery.',
  },
  {
    key: 'quiz',
    label: 'Quiz',
    icon: ListChecks,
    headline: 'How well do you know your sleep patterns?',
    body: 'A short diagnostic on your sleep quality, with ComPsych-recommended adjustments based on your result.',
  },
  {
    key: 'mobile-app',
    label: 'Mobile App',
    icon: Smartphone,
    headline: 'Meditations and breath-work in your pocket',
    body: 'Guided sessions from ComPsych, downloadable for offline use, with progress synced across devices.',
  },
  {
    key: 'report',
    label: 'Report',
    icon: BarChart3,
    headline: 'State of workplace mental health \u2014 2026 report',
    body: 'The ComPsych annual report on what employees want from their benefits and what employers are funding.',
  },
];

const FEATURE_IMAGE = '/card-images/feature.png';

// ---------------------------------------------------------------------------
// Gallery
// ---------------------------------------------------------------------------

const SIZES: CardSize[] = ['sm', 'md', 'lg', 'xl'];

export default function CardPage() {
  return (
    <FoundationPageShell
      eyebrow="Components"
      title="Card"
      description="A self-contained content block. Four variants, four sizes, with optional interactive, current, and disabled modifiers. Every value resolves to sys.* tokens and re-themes live with the active bundle."
    >
      {/* ==============================================================
          SERVICE CARDS
          ============================================================== */}

      <Section
        heading="Service cards"
        lead="The general-purpose container. Four variants, four sizes, with each composition shown at its canonical size."
      />

      <Section heading="Outlined" lead="The default neutral container.">
        <Surface>
          <div className="flex flex-col gap-6">
            <ServiceCardOutlinedMd />
            <ServiceCardOutlinedSm />
            <ServiceCardOutlinedXs />
          </div>
        </Surface>
      </Section>

      <Section heading="Filled" lead="High-emphasis feature card. Used at the hero sizes.">
        <Surface>
          <div className="flex flex-col gap-6">
            <ServiceCardFilledXl />
            <ServiceCardFilledLg />
          </div>
        </Surface>
      </Section>

      <Section heading="Image" lead="Background imagery with a contrast scrim and a floating action button.">
        <Surface>
          <div className="flex flex-col gap-6">
            <ServiceCardImageXl />
            <ServiceCardImageMd />
          </div>
        </Surface>
      </Section>

      <Section heading="Gradient" lead="Soft emphasis with a subtle wash behind the content.">
        <Surface>
          <div className="flex flex-col gap-6">
            <ServiceCardGradientMd />
            <ServiceCardGradientSm />
          </div>
        </Surface>
      </Section>

      {/* ==============================================================
          CONTENT CARDS
          ============================================================== */}

      <Section
        heading="Content cards"
        lead="Library and marketing tiles across three styles: Gradient, With Icon, and With Chip."
      />

      <Section heading="With Icon" lead="Large category icon on a tinted plate, with a title and body below.">
        <Surface>
          <ContentCardWithIcon category={CATEGORIES[0]} />
        </Surface>
      </Section>

      <Section heading="Gradient" lead="Outer outline, inner gradient panel with round category icon and text.">
        <Surface>
          <ContentCardGradient category={CATEGORIES[0]} />
        </Surface>
      </Section>

      <Section heading="With Chip" lead="Category as a dark pill chip at top; tighter composition without the icon plate.">
        <Surface>
          <ContentCardWithChip category={CATEGORIES[0]} />
        </Surface>
      </Section>

      {/* ==============================================================
          INTERACTIVE (Action / Metric patterns)
          ============================================================== */}

      <Section
        heading="Interactive patterns"
        lead="Action Cards and Metric Cards are compositions on the interactive Card base, with hover feedback, a ripple on press, and a focus ring for keyboard users."
      >
        <Surface>
          <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            <Composition label="Action card">
              <div style={{ width: 311 }}>
                <Card interactive size="md" onClick={() => {}}>
                  <ActionCardContent />
                </Card>
              </div>
            </Composition>
            <Composition label="Action card \u00b7 current">
              <div style={{ width: 311 }}>
                <Card interactive current size="md" onClick={() => {}}>
                  <ActionCardContent />
                </Card>
              </div>
            </Composition>
            <Composition label="Action card \u00b7 disabled">
              <div style={{ width: 311 }}>
                <Card interactive disabled size="md" onClick={() => {}}>
                  <ActionCardContent />
                </Card>
              </div>
            </Composition>
            <Composition label="Metric card">
              <div style={{ width: 240 }}>
                <Card interactive size="sm" onClick={() => {}}>
                  <MetricCardContent />
                </Card>
              </div>
            </Composition>
          </div>
        </Surface>
      </Section>

      {/* ==============================================================
          SIZES (isolation)
          ============================================================== */}

      <Section heading="Sizes" lead="Padding, radius, and gap scale across sm, md, lg, and xl.">
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
                    Padding and radius scale proportionally.
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
            hint="Figma link"
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

// ===========================================================================
// Service Card compositions — match Figma layouts 1:1.
// ===========================================================================

const onSurface = 'var(--sys-color-roles-surface-surface-sys-on-surface, #1b1d22)';
const onSurfaceVariant =
  'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)';
const primary = 'var(--sys-color-roles-accent-primary-sys-primary, #075cba)';
const onPrimary = 'var(--sys-color-roles-accent-primary-sys-on-primary, #ffffff)';
const onContainer =
  'var(--sys-color-roles-accent-primary-sys-on-primary-container, #ffffff)';
const onContainerVariant =
  'var(--sys-color-roles-accent-primary-sys-on-primary-container-variant, #badcff)';

/** md Outlined — the canonical Service Card. 420 wide in Figma. */
/**
 * The interior of the canonical Service Card. Extracted so the Playground
 * can drop it inside whatever variant the user selects without reinventing
 * the composition.
 */
function ServiceCardBody() {
  return (
    <>
      <div className="flex items-start justify-between">
        <Target size={48} style={{ color: primary }} strokeWidth={1.5} />
        <div className="flex items-center gap-2">
          <InfoChip label="Primary" />
          <ArrowUpRight size={24} style={{ color: onSurfaceVariant }} />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="ref-caption" style={{ color: onSurfaceVariant }}>Label</div>
        <div
          style={{
            fontSize: 20,
            lineHeight: '28px',
            fontWeight: 400,
            color: onSurface,
          }}
        >
          Title
        </div>
      </div>
      <div className="ref-body" style={{ color: onSurfaceVariant }}>
        Description
      </div>
    </>
  );
}

function ServiceCardOutlinedMd() {
  return (
    <div style={{ maxWidth: 420 }}>
      <Card size="md">
        <ServiceCardBody />
      </Card>
    </div>
  );
}

/** sm Outlined — 420×148. No icon block, tighter padding. */
function ServiceCardOutlinedSm() {
  return (
    <div style={{ maxWidth: 420 }}>
      <Card size="sm">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="ref-caption" style={{ color: onSurfaceVariant }}>Label</div>
            <div
              style={{
                fontSize: 16,
                lineHeight: '22.4px',
                fontWeight: 500,
                color: onSurface,
              }}
            >
              Title
            </div>
          </div>
          <ArrowUpRight size={20} style={{ color: onSurfaceVariant }} />
        </div>
        <div className="ref-body-sm" style={{ color: onSurfaceVariant }}>
          Short description aligned to the sm size.
        </div>
      </Card>
    </div>
  );
}

/** xs Outlined — 420×56. Single-row pill. */
function ServiceCardOutlinedXs() {
  return (
    <div
      style={{
        maxWidth: 420,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '14px 20px',
        background:
          'var(--sys-color-roles-surface-surface-container-sys-surface-container-lowest, #ffffff)',
        border:
          '1px solid var(--sys-color-roles-outline-sys-outline, #ebecf0)',
        borderRadius: 12,
      }}
    >
      <div className="flex items-center gap-3">
        <Target size={20} style={{ color: primary }} strokeWidth={1.5} />
        <div
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: onSurface,
          }}
        >
          Title
        </div>
      </div>
      <ArrowUpRight size={16} style={{ color: onSurfaceVariant }} />
    </div>
  );
}

/** xl Filled — the hero card. 1408×432 in Figma. */
function ServiceCardFilledXl() {
  return (
    <Card variant="filled" size="xl" fullWidth>
      <Target size={48} style={{ color: onContainerVariant }} strokeWidth={1.25} />
      <div
        className="flex items-end justify-between"
        style={{ marginTop: 'auto', gap: 24 }}
      >
        <div className="flex flex-col gap-6 min-w-0 flex-1">
          <div
            style={{
              fontSize: 28,
              lineHeight: '36.4px',
              color: onContainerVariant,
            }}
          >
            Title
          </div>
          <div
            style={{
              fontSize: 64,
              lineHeight: '72px',
              letterSpacing: '-1.6px',
              color: onContainer,
              fontWeight: 400,
            }}
          >
            Headline
          </div>
        </div>
        <Button variant="elevated" size="lg" label="Button" />
      </div>
    </Card>
  );
}

/** lg Filled — 684×332. Same pattern as xl at smaller scale. */
function ServiceCardFilledLg() {
  return (
    <div style={{ maxWidth: 684 }}>
      <Card variant="filled" size="lg">
        <Target size={40} style={{ color: onContainerVariant }} strokeWidth={1.25} />
        <div
          className="flex items-end justify-between"
          style={{ marginTop: 'auto', gap: 16 }}
        >
          <div className="flex flex-col gap-4 min-w-0 flex-1">
            <div style={{ fontSize: 20, lineHeight: '28px', color: onContainerVariant }}>
              Title
            </div>
            <div
              style={{
                fontSize: 40,
                lineHeight: '48px',
                letterSpacing: '-1px',
                color: onContainer,
                fontWeight: 400,
              }}
            >
              Headline
            </div>
          </div>
          <Button variant="elevated" size="lg" label="Button" />
        </div>
      </Card>
    </div>
  );
}

/** xl Image — full-bleed photo, gradient scrim, heading + CTA. */
function ServiceCardImageXl() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: 432,
        borderRadius:
          'calc(var(--sys-dimensions-border-radius-sys-radius-xl, 24) * 1px)',
        overflow: 'hidden',
        backgroundImage: `url(${FEATURE_IMAGE})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Figma scrim: linear 0deg 0→0.3, 30→0.09, 70→0.09, 100→0.3 black. */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.09) 30%, rgba(0,0,0,0.09) 70%, rgba(0,0,0,0.3) 100%)',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'relative',
          height: '100%',
          padding: 48,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: onPrimary,
        }}
      >
        <Target size={48} style={{ color: onPrimary }} strokeWidth={1.25} />
        <div className="flex items-end justify-between" style={{ gap: 24 }}>
          <div className="flex flex-col gap-6 min-w-0 flex-1" style={{ color: onPrimary }}>
            <div style={{ fontSize: 28, lineHeight: '36.4px' }}>Title</div>
            <div
              style={{
                fontSize: 64,
                lineHeight: '72px',
                letterSpacing: '-1.6px',
                fontWeight: 400,
              }}
            >
              Headline
            </div>
          </div>
          <Button variant="elevated" size="lg" label="Button" />
        </div>
      </div>
    </div>
  );
}

/** md Image — 420×244. */
function ServiceCardImageMd() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 420,
        height: 244,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundImage: `url(${FEATURE_IMAGE})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.05) 60%, rgba(0,0,0,0.4) 100%)',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'relative',
          height: '100%',
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: onPrimary,
        }}
      >
        <Target size={32} style={{ color: onPrimary }} strokeWidth={1.25} />
        <div className="flex flex-col gap-2">
          <div style={{ fontSize: 20, lineHeight: '28px', fontWeight: 500 }}>Title</div>
          <div style={{ fontSize: 14, lineHeight: '20px', opacity: 0.9 }}>
            Medium image card with scrim.
          </div>
        </div>
      </div>
    </div>
  );
}

/** md Gradient — 420×284. Figma nesting: inner gap 32 → text+button gap 24 → text gap 12 → title+label gap 4. */
function ServiceCardGradientMd() {
  return (
    <div style={{ maxWidth: 420 }}>
      <Card variant="gradient" size="md">
        {/* Icon + Label row */}
        <div className="flex items-start justify-between">
          <IconBadge />
          <div className="flex items-center gap-2">
            <InfoChip label="Primary" />
            <ArrowUpRight size={24} style={{ color: onSurfaceVariant }} />
          </div>
        </div>

        {/* Text + Button wrapper — gap 24 (sys-padding-24) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'flex-start' }}>
          {/* Text wrapper — gap 12 (sys-padding-12) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
            {/* Title + Label — gap 4 (sys-padding-4) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div className="ref-caption" style={{ color: onSurfaceVariant }}>
                Label
              </div>
              <div style={{ fontSize: 20, lineHeight: '28px', color: onSurface }}>
                Title
              </div>
            </div>
            <div className="ref-body" style={{ color: onSurfaceVariant }}>
              Description
            </div>
          </div>
          <Button variant="outlined" size="lg" label="Button" />
        </div>
      </Card>
    </div>
  );
}

/** sm Gradient — 420×183. */
function ServiceCardGradientSm() {
  return (
    <div style={{ maxWidth: 420 }}>
      <Card variant="gradient" size="sm">
        <div className="flex items-start justify-between">
          <IconBadge small />
          <ArrowUpRight size={20} style={{ color: onSurfaceVariant }} />
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="ref-caption" style={{ color: onSurfaceVariant }}>Label</div>
          <div style={{ fontSize: 16, lineHeight: '22.4px', fontWeight: 500, color: onSurface }}>
            Title
          </div>
        </div>
      </Card>
    </div>
  );
}

// ===========================================================================
// Content Card compositions — 10 categories × 3 styles. All token-driven.
// ===========================================================================

function ContentCardGradient({ category }: { category: Category }) {
  const Icon = category.icon;
  return (
    <div style={{ width: 328 }}>
      <div
        style={{
          background:
            'var(--sys-color-roles-surface-surface-container-sys-surface-container-lowest, #ffffff)',
          border:
            '1px solid var(--sys-color-roles-outline-sys-outline, #ebecf0)',
          borderRadius: 24,
          padding: 8,
          /* Figma: 328 × 290 = 8 outer padding + 274 inner panel (gradient). */
          height: 290,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            flex: '1 1 auto',
            padding: 16,
            borderRadius: 16,
            backgroundImage:
              'linear-gradient(180deg, var(--sys-color-roles-transparent-primary-sys-primary-08, rgba(7,92,186,0.08)), var(--sys-color-roles-transparent-neutral-sys-white-10, rgba(255,255,255,0.1)))',
            display: 'flex',
            flexDirection: 'column',
            /* Figma: inner panel gap icon-row → text = sys-padding-32. */
            gap: 32,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span
              style={{
                width: 44,
                height: 44,
                borderRadius: 9999,
                background: primary,
                color: onPrimary,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon size={22} strokeWidth={2} />
            </span>
            <div
              style={{
                fontSize: 16,
                lineHeight: '22.4px',
                fontWeight: 500,
                color: primary,
              }}
            >
              {category.label}
            </div>
          </div>
          {/* Text block — gap sys-padding-16 between headline and body. */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0 }}>
            <Clamp
              style={{ fontSize: 16, lineHeight: '22.4px', fontWeight: 500, color: onSurface }}
              lines={4}
            >
              {category.headline}
            </Clamp>
            <Clamp
              style={{ fontSize: 14, lineHeight: '20px', color: onSurfaceVariant }}
              lines={4}
            >
              {category.body}
            </Clamp>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentCardWithIcon({ category }: { category: Category }) {
  const Icon = category.icon;
  return (
    <div style={{ width: 328 }}>
      <div
        style={{
          background:
            'var(--sys-color-roles-surface-surface-container-sys-surface-container-lowest, #ffffff)',
          border:
            '1px solid var(--sys-color-roles-outline-sys-outline, #ebecf0)',
          borderRadius: 16,
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          /* Figma: outer card is 386 tall (16 + 120 + 12 + 222 + 16). */
          height: 386,
        }}
      >
        <div
          style={{
            height: 120,
            width: '100%',
            borderRadius: 8,
            background:
              'var(--sys-color-roles-add-on-primary-fixed-sys-primary-fixed-dim, #e3f2fd)',
            color: primary,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={48} strokeWidth={1.5} />
        </div>
        <div
          style={{
            padding: 8,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: '1 1 auto',
            /* Figma: inner container is 222 tall (content + its 16 padding). */
            height: 222,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 14, lineHeight: '20px', fontWeight: 500, color: onSurfaceVariant }}>
              {category.label}
            </div>
            <Clamp
              style={{ fontSize: 16, lineHeight: '22.4px', fontWeight: 500, color: onSurface }}
              lines={3}
            >
              {category.headline}
            </Clamp>
          </div>
          <Clamp
            style={{ fontSize: 16, lineHeight: '24px', color: onSurfaceVariant }}
            lines={4}
          >
            {category.body}
          </Clamp>
        </div>
      </div>
    </div>
  );
}

function ContentCardWithChip({ category }: { category: Category }) {
  const Icon = category.icon;
  return (
    <div style={{ width: 328 }}>
      <div
        style={{
          background:
            'var(--sys-color-roles-surface-surface-container-sys-surface-container-lowest, #ffffff)',
          border:
            '1px solid var(--sys-color-roles-outline-sys-outline, #ebecf0)',
          borderRadius: 16,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          /* Figma: 328 × 270 exact. */
          height: 270,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            alignSelf: 'flex-start',
            gap: 6,
            padding: '4px 12px',
            height: 32,
            borderRadius: 9999,
            background:
              'var(--sys-color-primary-core-primary-10, #050a24)',
            color: onPrimary,
            flexShrink: 0,
          }}
        >
          <Icon size={20} strokeWidth={2} style={{ color: onPrimary }} />
          <span style={{ fontSize: 14, lineHeight: '20px', fontWeight: 500 }}>
            {category.label}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: '1 1 auto',
            /* Figma: inner text block is 166 tall. */
            height: 166,
          }}
        >
          <Clamp
            style={{ fontSize: 16, lineHeight: '22.4px', fontWeight: 500, color: onSurface }}
            lines={3}
          >
            {category.headline}
          </Clamp>
          <Clamp
            style={{ fontSize: 14, lineHeight: '20px', color: onSurfaceVariant }}
            lines={4}
          >
            {category.body}
          </Clamp>
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// Interactive Card compositions
// ===========================================================================

function ActionCardContent() {
  return (
    <div className="flex items-center gap-4">
      <Info size={32} style={{ color: primary }} strokeWidth={1.5} />
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

function MetricCardContent() {
  return (
    <>
      <div className="ref-caption" style={{ color: onSurfaceVariant }}>
        Sessions this week
      </div>
      <div
        style={{
          fontSize: 40,
          lineHeight: 1.2,
          fontWeight: 500,
          color: onSurface,
          margin: 0,
        }}
      >
        12
      </div>
      <div className="ref-body-sm" style={{ color: primary }}>
        +3 vs last week
      </div>
    </>
  );
}

// ===========================================================================
// Small shared atoms used across the card compositions
// ===========================================================================

function InfoChip({ label }: { label: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 24,
        padding: '0 12px',
        borderRadius: 9999,
        background:
          'var(--sys-color-roles-custom-info-sys-info-container, #daecff)',
        color: 'var(--sys-color-roles-custom-info-sys-on-info-container, #162755)',
        fontSize: 14,
        lineHeight: '20px',
        fontWeight: 500,
      }}
    >
      {label}
    </span>
  );
}

function IconBadge({ small = false }: { small?: boolean }) {
  const size = small ? 44 : 60;
  const iconSize = small ? 22 : 32;
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: 9999,
        background: primary,
        color: onPrimary,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Target size={iconSize} strokeWidth={2} />
    </span>
  );
}

// Multi-line clamp helper — pure CSS via -webkit-line-clamp, falls back to
// overflow:hidden on engines that don't support it.
function Clamp({
  children,
  lines,
  style,
}: {
  children: ReactNode;
  lines: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: lines,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ===========================================================================
// Gallery scaffolding
// ===========================================================================

function Section({
  heading,
  lead,
  children,
}: {
  heading: string;
  lead?: string;
  children?: ReactNode;
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

function Composition({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 items-start">
      {children}
      <div
        className="ref-caption font-mono"
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
      <span className="flex items-center gap-3">
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
        <ArrowUpRight
          size={16}
          aria-hidden
          style={{
            color:
              'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
            flexShrink: 0,
          }}
        />
      </span>
    </Link>
  );
}

