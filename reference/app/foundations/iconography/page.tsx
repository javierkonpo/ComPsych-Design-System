'use client';

import { Home } from 'lucide-react';
import { sys, flattenLeaves, type TokenLeaf } from '@/lib/tokens';
import { PageHeader } from '@/components/page-header';
import { PlaceholderBanner } from '@/components/placeholder-banner';
import { TokenTable } from '@/components/token-table';
import { useCssVar, toPx } from '@/lib/utils';
import { CopyChip } from '@/components/copy-chip';

const USAGE: Record<string, string> = {
  sysSizeXxs: 'Tiny — inline indicators, dense tables.',
  sysSizeXs:  'Compact — chips, badges, inline icons.',
  sysSizeSm:  'Small — icons inside inputs and compact buttons.',
  sysSizeMd:  'Default — navigation, toolbars, icon-only buttons.',
  sysSizeLg:  'Large — card headers, feature callouts.',
  sysSizeXl:  'Extra-large — empty states, hero illustrations.',
};

export default function IconographyPage() {
  const tokens = flattenLeaves(sys.iconography, ['iconography']);

  // Sort by numeric value.
  const sorted = [...tokens].sort(
    (a, b) => Number(a.defaultValue) - Number(b.defaultValue),
  );

  return (
    <>
      <PlaceholderBanner />
      <PageHeader
        eyebrow="Foundations"
        title="Iconography"
        description="Icon size tokens for consistent rendering across contexts. The ComPsych Design System does NOT re-export icons — adopters install Lucide (`lucide-angular`, `lucide-react-native`, `lucide-react`) directly in their project. Icon color inherits from its text context; never assign icon color independently."
      />

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Sizes</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {sorted.map((t) => (
            <IconSizeSample
              key={t.cssVar}
              token={t}
              usage={USAGE[t.path.at(-1) ?? '']}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">All iconography tokens</h2>
        <TokenTable tokens={tokens} valueKind="number" />
      </section>
    </>
  );
}

function IconSizeSample({ token, usage }: { token: TokenLeaf; usage?: string }) {
  const value = useCssVar(token.cssVar);
  const px = Number(value || token.defaultValue || 24);

  return (
    <div className="flex flex-col gap-2 items-start">
      <div
        className="flex items-center justify-center rounded w-full aspect-[3/2]"
        style={{
          backgroundColor:
            'var(--sys-color-roles-surface-surface-container-sys-surface-container, #f3f4f6)',
          color:
            'var(--sys-color-roles-accent-primary-sys-primary, #075cba)',
        }}
      >
        <Home size={px} aria-hidden />
      </div>
      <div className="flex flex-col gap-1 text-xs w-full">
        <div className="font-medium">{token.path.at(-1)}</div>
        <div className="font-mono opacity-70">{toPx(value)}</div>
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
