'use client';

import { Home } from 'lucide-react';
import { sys, flattenLeaves, type TokenLeaf } from '@/lib/tokens';
import { FoundationPageShell } from '@/components/foundation-page-shell';
import { CopyChip } from '@/components/copy-chip';
import { useCssVar, toPx } from '@/lib/utils';

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
  const sorted = [...tokens].sort(
    (a, b) => Number(a.defaultValue) - Number(b.defaultValue),
  );

  return (
    <FoundationPageShell
      title="Iconography"
      description="A size scale for icons, matched to typography and spacing. Icons inherit their color from the surrounding text context."
      whyThisMatters={
        <>
          A small, purposeful set of icon sizes keeps UI surfaces calm and
          predictable. The system doesn&rsquo;t ship its own icon set —
          adopters install <a href="https://lucide.dev" target="_blank" rel="noopener noreferrer">Lucide</a>{' '}
          directly, so icon choice is flexible while sizing stays consistent.
        </>
      }
    >
      <section className="flex flex-col gap-5">
        <div className="flex flex-col gap-1 max-w-3xl">
          <h3 className="ref-heading-lg" style={{ margin: 0 }}>
            Sizes
          </h3>
          <p
            className="ref-body"
            style={{
              color:
                'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
              margin: 0,
            }}
          >
            Each size maps to a UI context. Pick by role, not by pixel count.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {sorted.map((t) => (
            <IconSample key={t.cssVar} token={t} usage={USAGE[t.path.at(-1) ?? '']} />
          ))}
        </div>
      </section>
    </FoundationPageShell>
  );
}

function IconSample({
  token,
  usage,
}: {
  token: TokenLeaf;
  usage?: string;
}) {
  const value = useCssVar(token.cssVar);
  const px = Number(value || token.defaultValue || 24);

  return (
    <div className="flex flex-col gap-2">
      <div
        className="w-full aspect-[3/2] flex items-center justify-center rounded-md"
        style={{
          backgroundColor:
            'var(--sys-color-roles-surface-surface-container-sys-surface-container, #f3f4f6)',
          color:
            'var(--sys-color-roles-accent-primary-sys-primary, #075cba)',
        }}
      >
        <Home size={px} aria-hidden />
      </div>
      <div className="flex flex-col gap-1">
        <div className="ref-body font-medium">
          {prettyLeafName(token.path.at(-1) ?? '')}
        </div>
        <div
          className="ref-body-sm font-mono"
          style={{
            color:
              'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
          }}
        >
          {toPx(value)}
        </div>
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

function prettyLeafName(leaf: string): string {
  const stripped = leaf.replace(/^sys/, '');
  const spaced = stripped
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Za-z])(\d)/g, '$1 $2');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
}
