'use client';

import { FoundationPageShell } from '@/components/foundation-page-shell';
import { ElevationSample } from '@/components/elevation-sample';

const LEVELS = [
  {
    level: 0,
    label: 'sysLevel0 · Flat',
    usage: 'Page backgrounds, sections, inline content. Most of the UI.',
  },
  {
    level: 1,
    label: 'sysLevel1 · Resting',
    usage: 'Cards, list items, tiles at rest.',
  },
  {
    level: 2,
    label: 'sysLevel2 · Interactive',
    usage: 'Hovered cards, navigation rails, active filters.',
  },
  {
    level: 3,
    label: 'sysLevel3 · Floating',
    usage: 'Floating action buttons, search bars, toolbars.',
  },
  {
    level: 4,
    label: 'sysLevel4 · Overlay',
    usage: 'Menus, popovers, dropdowns, drawers.',
  },
  {
    level: 5,
    label: 'sysLevel5 · Modal',
    usage: 'Dialogs, full-screen modals, bottom sheets.',
  },
];

export default function ElevationPage() {
  return (
    <FoundationPageShell
      title="Elevation"
      description="Six Material 3 elevation roles (sysLevel0–sysLevel5), each a composite of a drop shadow and a surface-tint overlay. Higher levels sit visually closer to the viewer."
      whyThisMatters={
        <>
          Elevation tells a user which surface is interactive, which is
          floating, and which is modal — without instructions. A consistent
          ladder means users learn the metaphor once and apply it everywhere.
        </>
      }
    >
      <section className="flex flex-col gap-5">
        <div className="flex flex-col gap-1 max-w-3xl">
          <h3 className="ref-heading-lg" style={{ margin: 0 }}>
            Roles
          </h3>
          <p
            className="ref-body"
            style={{
              color:
                'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
              margin: 0,
            }}
          >
            Each role maps to a single UI context. Mixing contexts at the
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
            />
          ))}
        </div>
      </section>
    </FoundationPageShell>
  );
}
