'use client';

import { sys, flattenLeaves, type TokenLeaf } from '@/lib/tokens';
import { FoundationPageShell } from '@/components/foundation-page-shell';
import { RulesGrid, InContextPanel } from '@/components/rules-grid';
import { ColorSwatch } from '@/components/color-swatch';
import { ColorRamp } from '@/components/color-ramp';

interface Pairing {
  title: string;
  usage: string;
  bgPath: string[];
  fgPath: string[];
}

const PAIRINGS: Pairing[] = [
  {
    title: 'Primary',
    usage: 'Main calls-to-action, active states, brand moments.',
    bgPath: ['colorRoles', 'accent', 'primary', 'sysPrimary'],
    fgPath: ['colorRoles', 'accent', 'primary', 'sysOnPrimary'],
  },
  {
    title: 'Primary container',
    usage: 'Supporting surfaces tied to the primary brand moment.',
    bgPath: ['colorRoles', 'accent', 'primary', 'sysPrimaryContainer'],
    fgPath: ['colorRoles', 'accent', 'primary', 'sysOnPrimaryContainer'],
  },
  {
    title: 'Secondary',
    usage: 'Complementary accent for less-critical actions.',
    bgPath: ['colorRoles', 'accent', 'secondary', 'sysSecondary'],
    fgPath: ['colorRoles', 'accent', 'secondary', 'sysOnSecondary'],
  },
  {
    title: 'Tertiary',
    usage: 'Tertiary accents for variety, tags, illustrations.',
    bgPath: ['colorRoles', 'accent', 'tertiary', 'sysTertiary'],
    fgPath: ['colorRoles', 'accent', 'tertiary', 'sysOnTertiary'],
  },
  {
    title: 'Error',
    usage: 'Destructive actions, validation failures, alerts.',
    bgPath: ['colorRoles', 'error', 'sysError'],
    fgPath: ['colorRoles', 'error', 'sysOnError'],
  },
  {
    title: 'Error container',
    usage: 'Error banners and secondary error surfaces.',
    bgPath: ['colorRoles', 'error', 'sysErrorContainer'],
    fgPath: ['colorRoles', 'error', 'sysOnErrorContainer'],
  },
  {
    title: 'Success',
    usage: 'Confirmations, completed states, positive feedback.',
    bgPath: ['colorRoles', 'custom', 'success', 'sysSuccess'],
    fgPath: ['colorRoles', 'custom', 'success', 'sysOnSuccess'],
  },
  {
    title: 'Warning',
    usage: 'Caution states requiring user attention.',
    bgPath: ['colorRoles', 'custom', 'warning', 'sysWarning'],
    fgPath: ['colorRoles', 'custom', 'warning', 'sysOnWarning'],
  },
  {
    title: 'Info',
    usage: 'Neutral informational banners and badges.',
    bgPath: ['colorRoles', 'custom', 'info', 'sysInfo'],
    fgPath: ['colorRoles', 'custom', 'info', 'sysOnInfo'],
  },
  {
    title: 'Surface',
    usage: 'Default page and card backgrounds.',
    bgPath: ['colorRoles', 'surface', 'surface', 'sysSurface'],
    fgPath: ['colorRoles', 'surface', 'surface', 'sysOnSurface'],
  },
  {
    title: 'Inverse surface',
    usage: 'Dark-on-light moments: tooltips, snackbars.',
    bgPath: ['colorRoles', 'surface', 'inverse', 'sysInverseSurface'],
    fgPath: ['colorRoles', 'surface', 'inverse', 'sysInverseOnSurface'],
  },
];

function leafAt(path: string[]): TokenLeaf {
  let node: unknown = sys;
  for (const seg of path) {
    if (node && typeof node === 'object') {
      node = (node as Record<string, unknown>)[seg];
    }
  }
  const defaultValue =
    typeof node === 'string' || typeof node === 'number' ? node : '';
  return {
    path,
    cssVar: `--sys-${path.map(kebab).join('-')}`,
    defaultValue,
  };
}

function kebab(s: string): string {
  return s
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Za-z])(\d)/g, '$1-$2')
    .toLowerCase();
}

export default function ColorPage() {
  const chartTokens = flattenLeaves(sys.colorRoles.chart, ['colorRoles', 'chart']);

  return (
    <FoundationPageShell
      eyebrow="Foundations"
      title="Color"
      description="A semantic palette of roles — not hues. Components reach for roles (primary, surface, error), and the system maps those roles to the right color for the active product and brand."
      whyThisMatters={
        <>
          Color is what users perceive first and remember longest. Using{' '}
          <strong>named roles</strong> instead of raw hues lets a single
          component render in GRO blue, CRC teal, or FMLA green without a
          single change in component code. It also guarantees that text always
          lands on a paired <code>on-*</code> color with verified contrast.
        </>
      }
      rules={
        <RulesGrid
          dos={[
            'Reach for a semantic role (primary, surface, error) not a hue.',
            'Pair every container with its dedicated on-* color for text and icons.',
            'Trust the system — the role meanings hold across all products and brands.',
          ]}
          donts={[
            'Hardcode hex values in a component.',
            'Reference a core, product, or brand token directly — only sys tokens are public.',
            'Mix an on-primary text color over a surface container; contrast is not guaranteed.',
          ]}
        />
      }
    >
      <section className="flex flex-col gap-5">
        <SectionHeading
          title="Accent and status roles"
          description="Each container role carries a dedicated on-* color. Samples below render the pair together so contrast is visible at a glance."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PAIRINGS.map((p) => (
            <ColorSwatch
              key={p.title}
              token={leafAt(p.bgPath)}
              onToken={leafAt(p.fgPath)}
              label={p.title}
              usage={p.usage}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <SectionHeading
          title="Surface containers"
          description="Layered surfaces for cards, panels, and nested chrome. Deeper levels recede visually."
        />
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {flattenLeaves(sys.colorRoles.surface.surfaceContainer, [
            'colorRoles',
            'surface',
            'surfaceContainer',
          ]).map((t) => (
            <ColorSwatch
              key={t.cssVar}
              token={t}
              label={prettyLeafName(t.path.at(-1) ?? '')}
              size="sm"
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <SectionHeading
          title="Outline"
          description="Borders, dividers, focus rings. Subtle by default — variant and fixed exist for higher emphasis."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {flattenLeaves(sys.colorRoles.outline, ['colorRoles', 'outline']).map(
            (t) => (
              <ColorSwatch
                key={t.cssVar}
                token={t}
                label={prettyLeafName(t.path.at(-1) ?? '')}
                size="sm"
              />
            ),
          )}
        </div>
      </section>

      {chartTokens.length > 0 && (
        <section className="flex flex-col gap-5">
          <SectionHeading
            title="Chart palette"
            description="Ordered set for data visualisation. Uses perceptually-spaced steps of the primary hue."
          />
          <ColorRamp label="Chart scale" tokens={chartTokens} />
        </section>
      )}

      <InContextPanel>
        <div className="flex flex-col gap-3 max-w-2xl">
          <p className="ref-body">
            Below: a small card composed entirely of semantic roles — primary
            for the CTA, surface for the background, outline for the border,
            on-surface-variant for the secondary text. Flip the Product in the
            header to watch every role reskin.
          </p>
          <MiniCard />
        </div>
      </InContextPanel>
    </FoundationPageShell>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 max-w-3xl">
      <h3 className="ref-heading-lg" style={{ margin: 0 }}>
        {title}
      </h3>
      {description && (
        <p
          className="ref-body"
          style={{
            color:
              'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
            margin: 0,
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}

function MiniCard() {
  return (
    <article
      className="rounded-lg p-5 flex flex-col gap-3"
      style={{
        backgroundColor:
          'var(--sys-color-roles-surface-surface-container-sys-surface-container-lowest, #ffffff)',
        border:
          '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
      }}
    >
      <div className="ref-heading-md">Upcoming appointment</div>
      <p
        className="ref-body-sm"
        style={{
          color:
            'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
          margin: 0,
        }}
      >
        Thursday at 2:00 PM with Dr. Chen. Join link sent to your email.
      </p>
      <button
        type="button"
        className="self-start rounded-md px-4 py-2 ref-body-sm font-medium transition-opacity hover:opacity-90"
        style={{
          backgroundColor:
            'var(--sys-color-roles-accent-primary-sys-primary, #075cba)',
          color:
            'var(--sys-color-roles-accent-primary-sys-on-primary, #ffffff)',
        }}
      >
        Add to calendar
      </button>
    </article>
  );
}

function prettyLeafName(leaf: string): string {
  // "sysSurfaceContainerHigh" -> "Surface container high"
  const stripped = leaf.replace(/^sys/, '');
  const spaced = stripped
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Za-z])(\d)/g, '$1 $2');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
}
