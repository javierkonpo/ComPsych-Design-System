'use client';

import { sys, flattenLeaves, type TokenLeaf } from '@/lib/tokens';
import { FoundationPageShell } from '@/components/foundation-page-shell';
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

