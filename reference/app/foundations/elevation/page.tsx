'use client';

import { PageHeader } from '@/components/page-header';
import { PlaceholderBanner } from '@/components/placeholder-banner';
import { ElevationSample } from '@/components/elevation-sample';

// Illustrative shadows. When `sys.elevation.*` tokens land upstream, replace
// these with `var(--sys-elevation-<role>-shadow)` values and drop the
// constants below. See note on the page.
const LEVELS = [
  { level: 0, label: 'Flat (lv0)',          usage: 'Page backgrounds, sections, inline content. ~70% of UI.', shadow: 'none' },
  { level: 1, label: 'Resting (lv1)',       usage: 'Cards, list items, tiles. ~20% of UI.',                   shadow: '0 1px 2px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)' },
  { level: 2, label: 'Interactive (lv2)',   usage: 'Hovered cards, navigation rails.',                        shadow: '0 2px 4px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)' },
  { level: 3, label: 'Floating (lv3)',      usage: 'FABs, search bars, toolbars.',                            shadow: '0 4px 6px rgba(0,0,0,0.07), 0 4px 14px rgba(0,0,0,0.06)' },
  { level: 4, label: 'Overlay (lv4)',       usage: 'Menus, dialogs, popovers, drawers.',                      shadow: '0 8px 10px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.08)' },
  { level: 5, label: 'Modal (lv5)',         usage: 'Full-screen modals, bottom sheets.',                      shadow: '0 16px 24px rgba(0,0,0,0.10), 0 16px 40px rgba(0,0,0,0.10)' },
];

export default function ElevationPage() {
  return (
    <>
      <PlaceholderBanner />
      <PageHeader
        eyebrow="Foundations"
        title="Elevation"
        description="Six levels mapped to UI contexts. Higher levels grow softer and larger in light mode, and combine with a subtle primary surface tint in dark mode."
      />

      <section
        className="mb-10 p-4 rounded text-sm"
        style={{
          backgroundColor:
            'var(--sys-color-roles-custom-info-sys-info-container, #daecff)',
          color: 'var(--sys-color-roles-custom-info-sys-on-info-container, #162755)',
          border:
            '1px solid var(--sys-color-roles-custom-info-sys-info, #226cee)',
        }}
      >
        <strong>Note: </strong>
        The current Tokens Studio export defines elevation <em>only</em> in the
        Brand tier (as W3C DTCG <code>boxShadow</code> composites). No{' '}
        <code>sys.elevation.*</code> role tokens exist yet, so nothing gets
        emitted at the Sys tier. The samples below use illustrative shadows
        so the page stays useful. When the Figma system adds{' '}
        <code>sys.elevation.*</code> roles, this page should read them live via{' '}
        <code>var(--sys-elevation-*)</code>.
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Levels</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {LEVELS.map((l) => (
            <ElevationSample
              key={l.level}
              level={l.level}
              label={l.label}
              usage={l.usage}
              shadow={l.shadow}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Guidance</h2>
        <ul
          className="text-sm list-disc pl-5 flex flex-col gap-2 max-w-3xl"
          style={{
            color:
              'var(--sys-color-roles-surface-surface-sys-on-surface, #1b1d22)',
          }}
        >
          <li>Depth has two cues: shadow (primary in light mode) and surface tone shift (primary in dark mode).</li>
          <li>Don&apos;t nest elevations inside a single card — elevation correlates with interaction, not importance.</li>
          <li>Modal surfaces pair with a scrim over the content below — the scrim itself is not an elevation level.</li>
        </ul>
      </section>
    </>
  );
}
