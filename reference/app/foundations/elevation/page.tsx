'use client';

import { FoundationPageShell } from '@/components/foundation-page-shell';
import { ElevationSample } from '@/components/elevation-sample';
import { Callout } from '@/components/callout';

const LEVELS = [
  { level: 0, label: 'Flat (lv0)',          usage: 'Page backgrounds, sections, inline content. Most of the UI.',       shadow: 'none' },
  { level: 1, label: 'Resting (lv1)',       usage: 'Cards, list items, tiles.',                                          shadow: '0 1px 2px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)' },
  { level: 2, label: 'Interactive (lv2)',   usage: 'Hovered cards, navigation rails.',                                   shadow: '0 2px 4px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)' },
  { level: 3, label: 'Floating (lv3)',      usage: 'Floating action buttons, search bars, toolbars.',                     shadow: '0 4px 6px rgba(0,0,0,0.07), 0 4px 14px rgba(0,0,0,0.06)' },
  { level: 4, label: 'Overlay (lv4)',       usage: 'Menus, dialogs, popovers, drawers.',                                  shadow: '0 8px 10px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.08)' },
  { level: 5, label: 'Modal (lv5)',         usage: 'Full-screen modals, bottom sheets.',                                  shadow: '0 16px 24px rgba(0,0,0,0.10), 0 16px 40px rgba(0,0,0,0.10)' },
];

export default function ElevationPage() {
  return (
    <FoundationPageShell
      title="Elevation"
      description="Six levels of surface layering, each tied to a specific UI context. Higher levels sit visually closer to the viewer."
      whyThisMatters={
        <>
          Elevation tells a user which surface is interactive, which is
          floating, and which is modal — without instructions. A consistent
          ladder means users learn the metaphor once and apply it everywhere.
        </>
      }
    >
      <Callout tone="info" title="Tokens pending upstream">
        Elevation tokens are reserved for the next Tokens Studio export. The
        Brand tier already defines <code>Elevation.lv1</code>–<code>lv5</code>{' '}
        as box-shadow composites, but no Sys roles reference them yet. This
        page documents the intended structure; sample cards below use
        illustrative shadows until the tokens land.
      </Callout>

      <section className="flex flex-col gap-5">
        <div className="flex flex-col gap-1 max-w-3xl">
          <h3 className="ref-heading-lg" style={{ margin: 0 }}>
            Levels
          </h3>
          <p
            className="ref-body"
            style={{
              color:
                'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
              margin: 0,
            }}
          >
            Each level maps to a single UI context. Mixing contexts at the
            same level is a signal to simplify.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
    </FoundationPageShell>
  );
}
