'use client';

import { sys, flattenLeaves, type TokenLeaf } from '@/lib/tokens';
import { PageHeader } from '@/components/page-header';
import { PlaceholderBanner } from '@/components/placeholder-banner';
import { TokenTable } from '@/components/token-table';
import { useCssVar, toPx } from '@/lib/utils';
import { CopyChip } from '@/components/copy-chip';

const USAGE: Record<string, string> = {
  sysStrokeThin:     'Subtle — default for borders and dividers.',
  sysStrokeMedium:   'Slightly heavier — inputs, list separators.',
  sysStrokeThick:    'Emphasis — focus, selected, error. Use inset to prevent layout shift.',
  sysStrokeHeavier:  'Strong emphasis — active navigation, bold callouts.',
  sysStrokeBold:     'Reserved for heavy ornamentation. Use sparingly.',
};

export default function BorderWidthPage() {
  const tokens = flattenLeaves(sys.dimensions.borderWidth, ['dimensions', 'borderWidth']);

  return (
    <>
      <PlaceholderBanner />
      <PageHeader
        eyebrow="Foundations"
        title="Border Width"
        description="Stroke scale. The 1px → 2px transition is the primary visual signal for interactive state. To prevent layout shift, use an inset border (outline or box-shadow inset) for focus/selected states rather than changing a real border-width."
      />

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Scale</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {tokens.map((t) => (
            <BorderSample key={t.cssVar} token={t} usage={USAGE[t.path.at(-1) ?? '']} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">All border-width tokens</h2>
        <TokenTable tokens={tokens} valueKind="number" />
      </section>
    </>
  );
}

function BorderSample({ token, usage }: { token: TokenLeaf; usage?: string }) {
  const value = useCssVar(token.cssVar);
  return (
    <div className="flex flex-col gap-2">
      <div
        className="w-full aspect-[3/2] flex items-center justify-center rounded"
        style={{
          border: `${toPx(value)} solid var(--sys-color-roles-accent-primary-sys-primary, #075cba)`,
          backgroundColor:
            'var(--sys-color-roles-surface-surface-container-sys-surface-container-lowest, #ffffff)',
        }}
      >
        <span className="text-xs font-mono opacity-70">{toPx(value)}</span>
      </div>
      <div className="flex flex-col gap-1 text-xs">
        <div className="font-medium">{token.path.at(-1)}</div>
        {usage && (
          <div
            className="opacity-70"
            style={{
              color:
                'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
            }}
          >
            {usage}
          </div>
        )}
        <CopyChip value={`var(${token.cssVar})`} />
      </div>
    </div>
  );
}
