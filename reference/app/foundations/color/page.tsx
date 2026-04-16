'use client';

import { sys, flattenLeaves, type TokenLeaf } from '@/lib/tokens';
import { PageHeader } from '@/components/page-header';
import { PlaceholderBanner } from '@/components/placeholder-banner';
import { ColorSwatch } from '@/components/color-swatch';
import { ColorRamp } from '@/components/color-ramp';
import { TokenTable } from '@/components/token-table';

// Role pairings: (container-role, on-role). Each pair shows that the on-*
// color is readable on its paired container background.
interface Pairing {
  title: string;
  bgPath: string[]; // camelCase path into sys
  fgPath: string[];
}

const PAIRINGS: Pairing[] = [
  { title: 'Primary',                   bgPath: ['colorRoles', 'accent', 'primary',   'sysPrimary'],            fgPath: ['colorRoles', 'accent', 'primary',   'sysOnPrimary'] },
  { title: 'Primary container',         bgPath: ['colorRoles', 'accent', 'primary',   'sysPrimaryContainer'],   fgPath: ['colorRoles', 'accent', 'primary',   'sysOnPrimaryContainer'] },
  { title: 'Secondary',                 bgPath: ['colorRoles', 'accent', 'secondary', 'sysSecondary'],          fgPath: ['colorRoles', 'accent', 'secondary', 'sysOnSecondary'] },
  { title: 'Secondary container',       bgPath: ['colorRoles', 'accent', 'secondary', 'sysSecondaryContainer'], fgPath: ['colorRoles', 'accent', 'secondary', 'sysOnSecondaryContainer'] },
  { title: 'Tertiary',                  bgPath: ['colorRoles', 'accent', 'tertiary',  'sysTertiary'],           fgPath: ['colorRoles', 'accent', 'tertiary',  'sysOnTertiary'] },
  { title: 'Error',                     bgPath: ['colorRoles', 'error',               'sysError'],              fgPath: ['colorRoles', 'error',               'sysOnError'] },
  { title: 'Error container',           bgPath: ['colorRoles', 'error',               'sysErrorContainer'],     fgPath: ['colorRoles', 'error',               'sysOnErrorContainer'] },
  { title: 'Success',                   bgPath: ['colorRoles', 'custom', 'success',   'sysSuccess'],            fgPath: ['colorRoles', 'custom', 'success',   'sysOnSuccess'] },
  { title: 'Warning',                   bgPath: ['colorRoles', 'custom', 'warning',   'sysWarning'],            fgPath: ['colorRoles', 'custom', 'warning',   'sysOnWarning'] },
  { title: 'Info',                      bgPath: ['colorRoles', 'custom', 'info',      'sysInfo'],               fgPath: ['colorRoles', 'custom', 'info',      'sysOnInfo'] },
  { title: 'Surface',                   bgPath: ['colorRoles', 'surface', 'surface',  'sysSurface'],            fgPath: ['colorRoles', 'surface', 'surface',  'sysOnSurface'] },
  { title: 'Inverse surface',           bgPath: ['colorRoles', 'surface', 'inverse',  'sysInverseSurface'],     fgPath: ['colorRoles', 'surface', 'inverse',  'sysInverseOnSurface'] },
];

function leafAt(path: string[]): TokenLeaf {
  // Read the default value from the typed import for this path.
  let node: unknown = sys;
  for (const seg of path) {
    if (node && typeof node === 'object') node = (node as Record<string, unknown>)[seg];
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
  const allColorTokens = flattenLeaves(sys.colorRoles, ['colorRoles']);

  const chartTokens = flattenLeaves(sys.colorRoles.chart, ['colorRoles', 'chart']);

  return (
    <>
      <PlaceholderBanner />
      <PageHeader
        eyebrow="Foundations"
        title="Color"
        description="Semantic color roles at the sys tier. Every value below is read from its CSS custom property — change the active brand or product in the sidebar and watch the roles reskin. Never place text on a container without its paired on-* color."
      />

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Role pairings</h2>
        <p
          className="text-sm mb-4 max-w-3xl"
          style={{
            color:
              'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
          }}
        >
          Each container has a designated <code>on-*</code> color for text and
          icons. Every swatch below renders its <code>on-*</code> text over its
          container to demonstrate the pairing works.
        </p>
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
          {PAIRINGS.map((p) => (
            <ColorSwatch
              key={p.title}
              token={leafAt(p.bgPath)}
              onToken={leafAt(p.fgPath)}
              label={p.title}
            />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Surface containers</h2>
        <div className="grid gap-3 md:grid-cols-5">
          {flattenLeaves(sys.colorRoles.surface.surfaceContainer, [
            'colorRoles',
            'surface',
            'surfaceContainer',
          ]).map((t) => (
            <ColorSwatch key={t.cssVar} token={t} label={t.path.at(-1)} />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Outline</h2>
        <div className="grid gap-3 md:grid-cols-4">
          {flattenLeaves(sys.colorRoles.outline, ['colorRoles', 'outline']).map((t) => (
            <ColorSwatch key={t.cssVar} token={t} label={t.path.at(-1)} />
          ))}
        </div>
      </section>

      {chartTokens.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4">Chart colors</h2>
          <ColorRamp label="Chart palette" tokens={chartTokens} />
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold mb-4">All color tokens</h2>
        <TokenTable tokens={allColorTokens} showResolvedSwatch valueKind="text" />
      </section>
    </>
  );
}
