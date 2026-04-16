'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { PlaceholderBanner } from '@/components/placeholder-banner';

interface CardDef {
  href: string;
  title: string;
  description: string;
  preview: 'color' | 'typography' | 'spacing' | 'elevation' | 'radius' | 'border-width' | 'iconography';
}

const CARDS: CardDef[] = [
  {
    href: '/foundations/color',
    title: 'Color',
    description:
      'Semantic color roles: primary, secondary, tertiary, surface, error, success, warning, info, outline, and more.',
    preview: 'color',
  },
  {
    href: '/foundations/typography',
    title: 'Typography',
    description:
      'Five roles × three sizes, plus emphasized variants. Rendered from the sys.typeScale tokens.',
    preview: 'typography',
  },
  {
    href: '/foundations/spacing',
    title: 'Spacing',
    description:
      'Padding, margin, and spacer scales. 4px base unit.',
    preview: 'spacing',
  },
  {
    href: '/foundations/elevation',
    title: 'Elevation',
    description:
      'Six levels mapped to UI contexts: flat, resting, interactive, floating, overlay, modal.',
    preview: 'elevation',
  },
  {
    href: '/foundations/radius',
    title: 'Radius',
    description:
      'Corner-radius scale from sharp to pill. Nesting rule: inner-radius = outer-radius − padding.',
    preview: 'radius',
  },
  {
    href: '/foundations/border-width',
    title: 'Border Width',
    description:
      'Stroke scale. The 1px → 2px transition is the primary state signal.',
    preview: 'border-width',
  },
  {
    href: '/foundations/iconography',
    title: 'Iconography',
    description:
      'Icon size tokens. Lucide is consumed directly by adopters, not re-exported by the DS.',
    preview: 'iconography',
  },
];

export default function FoundationsIndex() {
  return (
    <>
      <PlaceholderBanner />
      <PageHeader
        eyebrow="Foundations"
        title="Foundations gallery"
        description="Every foundation renders live from CSS custom properties emitted by the token pipeline. Switch the active theme in the sidebar and watch the page reskin."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {CARDS.map((c) => (
          <Card key={c.href} card={c} />
        ))}
      </div>
    </>
  );
}

function Card({ card }: { card: CardDef }) {
  return (
    <Link
      href={card.href}
      className="block p-5 rounded"
      style={{
        border:
          '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
        backgroundColor:
          'var(--sys-color-roles-surface-surface-container-sys-surface-container-lowest, #ffffff)',
      }}
    >
      <Preview kind={card.preview} />
      <div className="mt-4 text-base font-semibold">{card.title}</div>
      <div
        className="mt-1 text-sm"
        style={{
          color:
            'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
        }}
      >
        {card.description}
      </div>
    </Link>
  );
}

function Preview({ kind }: { kind: CardDef['preview'] }) {
  if (kind === 'color') {
    const vars = [
      '--sys-color-roles-accent-primary-sys-primary',
      '--sys-color-roles-accent-secondary-sys-secondary',
      '--sys-color-roles-accent-tertiary-sys-tertiary',
      '--sys-color-roles-error-sys-error',
      '--sys-color-roles-custom-success-sys-success',
      '--sys-color-roles-custom-warning-sys-warning',
    ];
    return (
      <div className="flex gap-1 h-10">
        {vars.map((v) => (
          <div
            key={v}
            className="flex-1 rounded"
            style={{
              backgroundColor: `var(${v})`,
              border:
                '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
            }}
          />
        ))}
      </div>
    );
  }
  if (kind === 'typography') {
    return (
      <div className="h-10 flex items-end gap-2" aria-hidden>
        <span style={{ fontSize: 12, fontWeight: 400 }}>Aa</span>
        <span style={{ fontSize: 18, fontWeight: 500 }}>Aa</span>
        <span style={{ fontSize: 28, fontWeight: 600 }}>Aa</span>
        <span style={{ fontSize: 40, fontWeight: 700, lineHeight: 1 }}>Aa</span>
      </div>
    );
  }
  if (kind === 'spacing') {
    return (
      <div className="flex items-center gap-2 h-10">
        {[4, 8, 16, 24, 32, 48].map((n) => (
          <div
            key={n}
            className="rounded"
            style={{
              width: n,
              height: n,
              backgroundColor:
                'var(--sys-color-roles-accent-primary-sys-primary-container, #070f36)',
            }}
          />
        ))}
      </div>
    );
  }
  if (kind === 'elevation') {
    return (
      <div className="flex gap-3 h-12 items-end">
        {[1, 2, 3, 4, 5].map((lv) => (
          <div
            key={lv}
            className="rounded flex-1 h-8"
            style={{
              backgroundColor:
                'var(--sys-color-roles-surface-surface-container-sys-surface-container-lowest, #fff)',
              boxShadow: `0 ${lv}px ${lv * 2}px rgba(0,0,0,0.08)`,
            }}
          />
        ))}
      </div>
    );
  }
  if (kind === 'radius') {
    const steps = [
      '--sys-dimensions-border-radius-sys-radius-xs',
      '--sys-dimensions-border-radius-sys-radius-sm',
      '--sys-dimensions-border-radius-sys-radius-md',
      '--sys-dimensions-border-radius-sys-radius-lg',
      '--sys-dimensions-border-radius-sys-radius-xl',
    ];
    return (
      <div className="flex gap-2 h-12 items-center">
        {steps.map((v) => (
          <div
            key={v}
            className="h-10 flex-1"
            style={{
              backgroundColor:
                'var(--sys-color-roles-accent-primary-sys-primary-container, #070f36)',
              borderRadius: `calc(var(${v}, 0) * 1px)`,
            }}
          />
        ))}
      </div>
    );
  }
  if (kind === 'border-width') {
    const widths = [1, 1.5, 2, 3, 4];
    return (
      <div className="flex gap-2 h-10 items-center">
        {widths.map((w) => (
          <div
            key={w}
            className="flex-1 h-10 rounded"
            style={{
              border: `${w}px solid var(--sys-color-roles-accent-primary-sys-primary, #075cba)`,
            }}
          />
        ))}
      </div>
    );
  }
  if (kind === 'iconography') {
    return (
      <div className="flex items-end gap-3 h-10">
        {[12, 16, 20, 24, 32].map((s) => (
          <div
            key={s}
            className="rounded"
            style={{
              width: s,
              height: s,
              backgroundColor:
                'var(--sys-color-roles-accent-primary-sys-primary, #075cba)',
            }}
          />
        ))}
      </div>
    );
  }
  return null;
}
