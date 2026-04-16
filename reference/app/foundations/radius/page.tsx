'use client';

import { sys, flattenLeaves } from '@/lib/tokens';
import { PageHeader } from '@/components/page-header';
import { PlaceholderBanner } from '@/components/placeholder-banner';
import { RadiusSample } from '@/components/radius-sample';
import { TokenTable } from '@/components/token-table';

const USAGE: Record<string, string> = {
  sysRadiusNone:         'Sharp — tables, code blocks, dividers.',
  sysRadiusXs:           'Inputs, selects, toolbar items.',
  sysRadiusSm:           'Buttons, dropdowns, tooltips.',
  sysRadiusMd:           'System default — cards, dialogs, panels.',
  sysRadiusLg:           'Large cards, modals.',
  sysRadiusLgIncreased:  'Softer variant of lg.',
  sysRadiusXl:           'Banners, onboarding cards.',
  sysRadiusXlIncreased:  'Softer variant of xl.',
  sysRadiusFull:         'Pill / capsule — avatars, chips, FABs.',
};

export default function RadiusPage() {
  const tokens = flattenLeaves(sys.dimensions.borderRadius, ['dimensions', 'borderRadius']);

  return (
    <>
      <PlaceholderBanner />
      <PageHeader
        eyebrow="Foundations"
        title="Radius"
        description="Corner-radius scale mapped to component categories. Nesting rule: inner-radius = outer-radius − padding. Violating the nesting rule produces visible gaps between concentric rounded corners."
      />

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Scale</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {tokens.map((t) => {
            const leafKey = t.path.at(-1) ?? '';
            return <RadiusSample key={t.cssVar} token={t} usage={USAGE[leafKey]} />;
          })}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">All radius tokens</h2>
        <TokenTable tokens={tokens} valueKind="number" />
      </section>
    </>
  );
}
