'use client';

import { sys, flattenLeaves, type TokenLeaf } from '@/lib/tokens';
import { PageHeader } from '@/components/page-header';
import { PlaceholderBanner } from '@/components/placeholder-banner';
import { SpacingSample } from '@/components/spacing-sample';
import { TokenTable } from '@/components/token-table';

function sortByNumericValue(tokens: TokenLeaf[]): TokenLeaf[] {
  return [...tokens].sort(
    (a, b) => Number(a.defaultValue) - Number(b.defaultValue),
  );
}

export default function SpacingPage() {
  const paddingTokens = sortByNumericValue(
    flattenLeaves(sys.dimensions.spacing.padding, ['dimensions', 'spacing', 'padding']),
  );
  const marginTokens = sortByNumericValue(
    flattenLeaves(sys.dimensions.spacing.margin, ['dimensions', 'spacing', 'margin']),
  );
  const spacerTokens = sortByNumericValue(
    flattenLeaves(sys.dimensions.spacing.spacer, ['dimensions', 'spacing', 'spacer']),
  );
  const allTokens = [...paddingTokens, ...marginTokens, ...spacerTokens];

  const maxAbs = Math.max(
    ...allTokens.map((t) => Math.abs(Number(t.defaultValue) || 0)),
    1,
  );

  return (
    <>
      <PlaceholderBanner />
      <PageHeader
        eyebrow="Foundations"
        title="Spacing"
        description="Three categories — padding (inside), margin (outside), spacer (between). Prefer spacer/gap over margin for sibling spacing inside flex and grid. All values are multiples of the 4px base unit (with a few 2px and 6px exceptions)."
      />

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Padding scale</h2>
        <SpacingSample tokens={paddingTokens} maxValue={maxAbs} />
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Margin scale</h2>
        <SpacingSample tokens={marginTokens} maxValue={maxAbs} />
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Spacer scale</h2>
        <SpacingSample tokens={spacerTokens} maxValue={maxAbs} />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">All spacing tokens</h2>
        <TokenTable tokens={allTokens} valueKind="number" />
      </section>
    </>
  );
}
