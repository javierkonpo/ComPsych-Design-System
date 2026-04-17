'use client';

import { sys, flattenLeaves, type TokenLeaf } from '@/lib/tokens';
import { FoundationPageShell } from '@/components/foundation-page-shell';
import { RulesGrid, InContextPanel } from '@/components/rules-grid';
import { RadiusSample } from '@/components/radius-sample';

const USAGE: Record<string, string> = {
  sysRadiusNone:         'Sharp — tables, code blocks, dividers.',
  sysRadiusXs:           'Inputs, selects, toolbar items.',
  sysRadiusSm:           'Buttons, dropdowns, tooltips.',
  sysRadiusMd:           'System default — cards, dialogs, panels.',
  sysRadiusLg:           'Large cards, modals.',
  sysRadiusLgIncreased:  'Softer variant of lg for richer canvases.',
  sysRadiusXl:           'Banners, onboarding cards.',
  sysRadiusXlIncreased:  'Softer variant of xl.',
  sysRadiusFull:         'Pill / capsule — avatars, chips, FABs.',
};

export default function RadiusPage() {
  const tokens = flattenLeaves(sys.dimensions.borderRadius, [
    'dimensions',
    'borderRadius',
  ]);

  return (
    <FoundationPageShell
      title="Radius"
      description="A stepwise corner-radius scale that maps to component categories. Nested elements follow a simple nesting rule so concentric corners stay aligned."
      whyThisMatters={
        <>
          Corner radius is a quiet signal of friendliness and formality. A
          scale with clear steps prevents arbitrary radii, keeps shapes
          recognisable across products, and makes nested radii mathematically
          clean.
        </>
      }
      rules={
        <RulesGrid
          dos={[
            'Use radius-md as the default for cards and panels.',
            'Use radius-full only for genuinely capsule-shaped elements (avatars, pills).',
            'Follow the nesting rule: inner-radius = outer-radius − padding.',
          ]}
          donts={[
            'Apply radius-xl to every element on a page — it loses meaning.',
            'Mix radii across siblings that should clearly feel paired.',
            'Pick a radius to make a one-off design fit; adjust the design.',
          ]}
        />
      }
    >
      <section className="flex flex-col gap-5">
        <div className="flex flex-col gap-1 max-w-3xl">
          <h3 className="ref-heading-lg" style={{ margin: 0 }}>
            Scale
          </h3>
          <p
            className="ref-body"
            style={{
              color:
                'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
              margin: 0,
            }}
          >
            Every step exists for a purpose. Match the step to the component
            category, not to a visual impulse.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {tokens.map((t: TokenLeaf) => (
            <RadiusSample
              key={t.cssVar}
              token={t}
              usage={USAGE[t.path.at(-1) ?? '']}
            />
          ))}
        </div>
      </section>

      <InContextPanel>
        <p className="ref-body max-w-2xl mb-5">
          Nested radii: the outer card uses <code>radius-lg</code>, the button
          inside uses <code>radius-sm</code>. The difference gives the inner
          element breathing room and keeps both corners visually clean.
        </p>
        <NestedExample />
      </InContextPanel>
    </FoundationPageShell>
  );
}

function NestedExample() {
  return (
    <div
      className="p-5 max-w-sm"
      style={{
        backgroundColor:
          'var(--sys-color-roles-surface-surface-container-sys-surface-container-lowest, #ffffff)',
        border:
          '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
        borderRadius:
          'calc(var(--sys-dimensions-border-radius-sys-radius-lg, 16) * 1px)',
      }}
    >
      <div className="ref-heading-md mb-2">Outer card — radius-lg</div>
      <p
        className="ref-body-sm mb-4"
        style={{
          color:
            'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
        }}
      >
        Inner button uses radius-sm.
      </p>
      <button
        type="button"
        className="ref-body-sm font-medium px-4 py-2"
        style={{
          borderRadius:
            'calc(var(--sys-dimensions-border-radius-sys-radius-sm, 8) * 1px)',
          backgroundColor:
            'var(--sys-color-roles-accent-primary-sys-primary, #075cba)',
          color:
            'var(--sys-color-roles-accent-primary-sys-on-primary, #ffffff)',
        }}
      >
        Primary action
      </button>
    </div>
  );
}
