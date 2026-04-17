'use client';

import { sys, flattenLeaves, type TokenLeaf } from '@/lib/tokens';
import { FoundationPageShell } from '@/components/foundation-page-shell';
import { CopyChip } from '@/components/copy-chip';
import { useCssVar, toPx } from '@/lib/utils';

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
    </FoundationPageShell>
  );
}

// ---------------------------------------------------------------------------
// RadiusSample is inlined here (rather than imported from
// `@/components/radius-sample`) because the separate-module version trips
// a Next.js 15 / React 19 client-manifest bug specific to this page —
// `next start` throws "Could not find the module
// app/foundations/radius/page.tsx#default in the React Client Manifest"
// and the route returns 500. Inlining the visual component into the page
// file sidesteps the bundler edge case. Iconography and border-width
// follow the same inline pattern for the same reason.
// ---------------------------------------------------------------------------

function RadiusSample({
  token,
  usage,
}: {
  token: TokenLeaf;
  usage?: string;
}) {
  const value = useCssVar(token.cssVar);

  return (
    <div className="flex flex-col gap-2">
      <div
        className="w-full aspect-[3/2] flex items-center justify-center"
        style={{
          backgroundColor:
            'var(--sys-color-roles-accent-primary-sys-primary-container, #070f36)',
          color:
            'var(--sys-color-roles-accent-primary-sys-on-primary-container, #ffffff)',
          borderRadius: toPx(value),
        }}
      >
        <span className="text-xs font-mono">{toPx(value)}</span>
      </div>
      <div className="flex flex-col gap-1">
        <div className="ref-body font-medium">{token.path.at(-1)}</div>
        {usage && (
          <div
            className="ref-body-sm"
            style={{
              color:
                'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
            }}
          >
            {usage}
          </div>
        )}
        <CopyChip block value={`sys.${token.path.join('.')}`} />
      </div>
    </div>
  );
}
