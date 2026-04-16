'use client';

import { sys, flattenLeaves } from '@/lib/tokens';
import { PageHeader } from '@/components/page-header';
import { PlaceholderBanner } from '@/components/placeholder-banner';
import { TypeSpecimen } from '@/components/type-specimen';
import { TokenTable } from '@/components/token-table';

const TYPE_ROLES: Array<{ role: keyof typeof sys.typeScale; label: string }> = [
  { role: 'displayLarge',   label: 'Display · Large' },
  { role: 'displayMedium',  label: 'Display · Medium' },
  { role: 'displaySmall',   label: 'Display · Small' },
  { role: 'headlineLarge',  label: 'Headline · Large' },
  { role: 'headlineMedium', label: 'Headline · Medium' },
  { role: 'headlineSmall',  label: 'Headline · Small' },
  { role: 'titleLarge',     label: 'Title · Large' },
  { role: 'titleMedium',    label: 'Title · Medium' },
  { role: 'titleSmall',     label: 'Title · Small' },
  { role: 'bodyLarge',      label: 'Body · Large' },
  { role: 'bodyMedium',     label: 'Body · Medium' },
  { role: 'bodySmall',      label: 'Body · Small' },
  { role: 'labelLarge',     label: 'Label · Large' },
  { role: 'labelMedium',    label: 'Label · Medium' },
  { role: 'labelSmall',     label: 'Label · Small' },
];

export default function TypographyPage() {
  const allTokens = flattenLeaves(sys.typeScale, ['typeScale']);

  return (
    <>
      <PlaceholderBanner />
      <PageHeader
        eyebrow="Foundations"
        title="Typography"
        description="Five role families × three size variants, each with regular and emphasized weight. Every specimen below renders at its actual sys.typeScale.* values. Note: the token export specifies Google Sans as the family, but Google Sans is not a public Google Font — the reference app falls back to a system UI stack so rendering stays consistent."
      />

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Specimens</h2>
        <div className="flex flex-col gap-4">
          {TYPE_ROLES.map((r) => (
            <TypeSpecimen key={r.role} role={r.role} label={r.label} />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Emphasized variants</h2>
        <p
          className="text-sm mb-4"
          style={{
            color:
              'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
          }}
        >
          Each role has a second weight (<code>sys-font-weight-emphasized</code>)
          for in-paragraph emphasis and calls-to-action. Samples below use the
          emphasized weight of Body Large, Title Medium, and Headline Small.
        </p>
        <div className="flex flex-col gap-4">
          <TypeSpecimen role="bodyLarge"     label="Body · Large (emphasized)"     emphasized />
          <TypeSpecimen role="titleMedium"   label="Title · Medium (emphasized)"   emphasized />
          <TypeSpecimen role="headlineSmall" label="Headline · Small (emphasized)" emphasized />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">All typography tokens</h2>
        <TokenTable tokens={allTokens} valueKind="text" />
      </section>
    </>
  );
}
