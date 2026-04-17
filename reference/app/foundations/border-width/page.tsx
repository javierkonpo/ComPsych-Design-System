'use client';

import { sys, flattenLeaves, type TokenLeaf } from '@/lib/tokens';
import { FoundationPageShell } from '@/components/foundation-page-shell';
import { RulesGrid, InContextPanel } from '@/components/rules-grid';
import { useCssVar, toPx } from '@/lib/utils';

const USAGE: Record<string, string> = {
  sysStrokeThin:     'Default borders, dividers, subtle separators.',
  sysStrokeMedium:   'Slightly heavier — input fields, list separators.',
  sysStrokeThick:    'Emphasis — focus, selected, error. Use inset to prevent layout shift.',
  sysStrokeHeavier:  'Strong emphasis — active navigation, bold callouts.',
  sysStrokeBold:     'Reserved for ornamentation. Use sparingly.',
};

export default function BorderWidthPage() {
  const tokens = flattenLeaves(sys.dimensions.borderWidth, [
    'dimensions',
    'borderWidth',
  ]);

  return (
    <FoundationPageShell
      title="Border Width"
      description="A five-step stroke scale. The thin → thick transition is the primary visual signal for interactive state."
      whyThisMatters={
        <>
          Border weight is a silent communicator: thin is default, heavier
          means attention. Sticking to a small scale keeps the signal
          consistent so users learn the weight → state mapping without
          thinking.
        </>
      }
      rules={
        <RulesGrid
          dos={[
            'Use stroke-thin as the default for dividers and field borders.',
            'Use an inset outline or box-shadow for focus/selected — not a real border change.',
            'Step up one weight at a time to signal increasing emphasis.',
          ]}
          donts={[
            'Swap border-width on hover or focus — that causes layout shift.',
            'Introduce fractional pixel widths to hit a specific visual.',
            'Use stroke-bold on routine UI — it should stand out, not be everywhere.',
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
            Thin sits at the base; bold signals something special.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {tokens.map((t) => (
            <BorderSample
              key={t.cssVar}
              token={t}
              usage={USAGE[t.path.at(-1) ?? '']}
            />
          ))}
        </div>
      </section>

      <InContextPanel>
        <p className="ref-body max-w-2xl">
          The default bordered input below uses <code>stroke-thin</code>. On
          focus, we swap in an <strong>outline</strong> at{' '}
          <code>stroke-thick</code> — the visible weight doubles, but the
          element&rsquo;s box size doesn&rsquo;t, so nothing shifts.
        </p>
        <DemoInput />
      </InContextPanel>
    </FoundationPageShell>
  );
}

function BorderSample({
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
        className="w-full aspect-[3/2] flex items-center justify-center rounded-md"
        style={{
          border: `${toPx(value)} solid var(--sys-color-roles-accent-primary-sys-primary, #075cba)`,
          backgroundColor:
            'var(--sys-color-roles-surface-surface-container-sys-surface-container-lowest, #ffffff)',
        }}
      >
        <span
          className="ref-body-sm font-mono"
          style={{
            color:
              'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
          }}
        >
          {toPx(value)}
        </span>
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

function DemoInput() {
  return (
    <div
      className="mt-4 flex flex-col gap-2 max-w-sm"
      style={{ color: 'var(--sys-color-roles-surface-surface-sys-on-surface, #1b1d22)' }}
    >
      <label htmlFor="demo-border-input" className="ref-body-sm font-medium">
        Email address
      </label>
      <input
        id="demo-border-input"
        type="email"
        placeholder="you@example.com"
        className="px-3 ref-body"
        style={{
          height: 40,
          borderRadius:
            'calc(var(--sys-dimensions-border-radius-sys-radius-sm, 8) * 1px)',
          border:
            '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
          backgroundColor:
            'var(--sys-color-roles-surface-surface-container-sys-surface-container-lowest, #ffffff)',
        }}
      />
      <div
        className="ref-caption"
        style={{
          color:
            'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
        }}
      >
        Click into the field to see the focus outline — same element size,
        heavier weight.
      </div>
    </div>
  );
}
