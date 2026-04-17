'use client';

import { Home } from 'lucide-react';
import { sys, flattenLeaves, type TokenLeaf } from '@/lib/tokens';
import { FoundationPageShell } from '@/components/foundation-page-shell';
import { RulesGrid, InContextPanel } from '@/components/rules-grid';
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
      rules={
        <RulesGrid
          dos={[
            'Size icons using the scale below — sm inside compact controls, md for nav, lg for callouts.',
            'Let icon color inherit from its text context; never hard-code a color.',
            'Pick Lucide icons that match the platform conventions your audience expects.',
          ]}
          donts={[
            'Scale icons with arbitrary CSS sizes.',
            'Apply a decorative color to an icon that appears alongside labeled text.',
            'Ship a custom-drawn icon when a Lucide equivalent exists.',
          ]}
        />
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

      <InContextPanel>
        <p className="ref-body max-w-2xl mb-5">
          Icons in an inline row of labels. The icon&rsquo;s color matches the
          surrounding text, and its size steps up with the text size.
        </p>
        <InlineIconRow />
      </InContextPanel>
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
        <code
          className="ref-caption font-mono"
          style={{
            color:
              'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
          }}
        >
          sys.{token.path.join('.')}
        </code>
      </div>
    </div>
  );
}

function InlineIconRow() {
  return (
    <div className="flex items-center gap-8 flex-wrap">
      <span className="flex items-center gap-2 ref-body-sm">
        <Home size={16} strokeWidth={2} />
        Home · size-xs
      </span>
      <span className="flex items-center gap-2 ref-body">
        <Home size={20} strokeWidth={2} />
        Home · size-sm
      </span>
      <span className="flex items-center gap-2 ref-body-lg">
        <Home size={24} strokeWidth={2} />
        Home · size-md
      </span>
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
