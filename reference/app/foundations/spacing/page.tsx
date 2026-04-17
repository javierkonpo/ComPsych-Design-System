'use client';

import { sys, flattenLeaves, type TokenLeaf } from '@/lib/tokens';
import { FoundationPageShell } from '@/components/foundation-page-shell';
import { RulesGrid, InContextPanel } from '@/components/rules-grid';
import { SpacingSample } from '@/components/spacing-sample';

function sortByValue(tokens: TokenLeaf[]): TokenLeaf[] {
  return [...tokens].sort(
    (a, b) => Number(a.defaultValue) - Number(b.defaultValue),
  );
}

export default function SpacingPage() {
  const paddingAll = flattenLeaves(sys.dimensions.spacing.padding, [
    'dimensions',
    'spacing',
    'padding',
  ]);
  const positivePadding = sortByValue(
    paddingAll.filter((t) => Number(t.defaultValue) >= 0),
  );
  const negativePadding = sortByValue(
    paddingAll.filter((t) => Number(t.defaultValue) < 0),
  );
  const marginTokens = sortByValue(
    flattenLeaves(sys.dimensions.spacing.margin, [
      'dimensions',
      'spacing',
      'margin',
    ]),
  );
  const spacerTokens = sortByValue(
    flattenLeaves(sys.dimensions.spacing.spacer, [
      'dimensions',
      'spacing',
      'spacer',
    ]),
  );

  const maxAbs = Math.max(
    ...[...positivePadding, ...marginTokens, ...spacerTokens].map((t) =>
      Number(t.defaultValue) || 0,
    ),
    1,
  );

  return (
    <FoundationPageShell
      title="Spacing"
      description="One scale of step-wise spacing values — with three semantic purposes: padding inside components, margin between unrelated blocks, and gap (spacer) between siblings in a flow."
      whyThisMatters={
        <>
          Spacing is the quiet structural force in a UI. A predictable,
          geometric scale makes layouts feel intentional, eliminates one-off
          measurements, and lets the whole design system breathe the same way
          across every product.
        </>
      }
      rules={
        <RulesGrid
          dos={[
            'Prefer gap (spacer) over margin for sibling elements in a flex/grid container.',
            'Use padding tokens for inner component whitespace; margin for separating unrelated blocks.',
            'Reach for the closest step on the scale, even if it rounds the layout.',
          ]}
          donts={[
            'Combine spacing tokens with arithmetic (calc(var(--...) + 2px)) to invent new sizes.',
            'Use negative spacing to fix a broken layout — revisit the parent container instead.',
            'Mix padding and margin tokens interchangeably; they have different meanings.',
          ]}
        />
      }
    >
      <SpacingSection
        title="Padding scale"
        blurb="Inside components. Use these for card padding, button padding, icon padding."
      >
        <SpacingSample tokens={positivePadding} maxValue={maxAbs} />
      </SpacingSection>

      <SpacingSection
        title="Margin scale"
        blurb="Between sections and unrelated blocks. Most components should prefer gap/spacer."
      >
        <SpacingSample tokens={marginTokens} maxValue={maxAbs} />
      </SpacingSection>

      <SpacingSection
        title="Spacer scale"
        blurb="Gap between siblings in a flex or grid container. The preferred way to space siblings."
      >
        <SpacingSample tokens={spacerTokens} maxValue={maxAbs} />
      </SpacingSection>

      {negativePadding.length > 0 && (
        <SpacingSection
          title="Negative spacing (for overlaps)"
          blurb="Reserved for intentional overlaps — avatars overlapping, offset chrome. Not for fixing layouts."
        >
          <SpacingSample tokens={negativePadding} maxValue={maxAbs} />
        </SpacingSection>
      )}

      <InContextPanel>
        <p className="ref-body max-w-2xl mb-5">
          A simple card laid out with spacing tokens. Each whitespace region
          below is labeled with the token that produced it.
        </p>
        <ContextCard />
      </InContextPanel>
    </FoundationPageShell>
  );
}

function SpacingSection({
  title,
  blurb,
  children,
}: {
  title: string;
  blurb: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 max-w-3xl">
        <h3 className="ref-heading-lg" style={{ margin: 0 }}>
          {title}
        </h3>
        <p
          className="ref-body"
          style={{
            color:
              'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
            margin: 0,
          }}
        >
          {blurb}
        </p>
      </div>
      {children}
    </section>
  );
}

function ContextCard() {
  return (
    <div
      className="rounded-lg flex flex-col max-w-lg"
      style={{
        padding:
          'calc(var(--sys-dimensions-spacing-padding-sys-padding-24, 24) * 1px)',
        gap:
          'calc(var(--sys-dimensions-spacing-spacer-sys-spacer-md, 24) * 1px)',
        backgroundColor:
          'var(--sys-color-roles-surface-surface-container-sys-surface-container-lowest, #ffffff)',
        border:
          '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
      }}
    >
      <Annotation token="sys.dimensions.spacing.padding.sysPadding24">
        padding-24 around the card
      </Annotation>
      <div className="flex flex-col gap-2">
        <div className="ref-heading-md">Your weekly check-in</div>
        <p
          className="ref-body-sm"
          style={{
            color:
              'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
            margin: 0,
          }}
        >
          Two items waiting.
        </p>
      </div>
      <Annotation token="sys.dimensions.spacing.spacer.sysSpacerMd">
        spacer-md between header and body
      </Annotation>
      <div
        className="flex"
        style={{
          gap:
            'calc(var(--sys-dimensions-spacing-spacer-sys-spacer-sm, 16) * 1px)',
        }}
      >
        <button
          type="button"
          className="rounded-md ref-body-sm font-medium"
          style={{
            padding:
              'calc(var(--sys-dimensions-spacing-padding-sys-padding-8, 8) * 1px) calc(var(--sys-dimensions-spacing-padding-sys-padding-16, 16) * 1px)',
            backgroundColor:
              'var(--sys-color-roles-accent-primary-sys-primary, #075cba)',
            color:
              'var(--sys-color-roles-accent-primary-sys-on-primary, #ffffff)',
          }}
        >
          Start
        </button>
        <button
          type="button"
          className="rounded-md ref-body-sm font-medium"
          style={{
            padding:
              'calc(var(--sys-dimensions-spacing-padding-sys-padding-8, 8) * 1px) calc(var(--sys-dimensions-spacing-padding-sys-padding-16, 16) * 1px)',
            backgroundColor: 'transparent',
            color:
              'var(--sys-color-roles-surface-surface-sys-on-surface, #1b1d22)',
            border:
              '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
          }}
        >
          Later
        </button>
      </div>
      <Annotation token="sys.dimensions.spacing.spacer.sysSpacerSm">
        spacer-sm between button pair
      </Annotation>
    </div>
  );
}

function Annotation({
  token,
  children,
}: {
  token: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="ref-caption font-mono"
      style={{
        color:
          'var(--sys-color-roles-accent-primary-sys-primary, #075cba)',
      }}
    >
      <span className="font-semibold">{children}</span>{' '}
      <span
        style={{
          color:
            'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
        }}
      >
        — {token}
      </span>
    </div>
  );
}
