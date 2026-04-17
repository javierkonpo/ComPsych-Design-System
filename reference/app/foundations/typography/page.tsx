'use client';

import { sys } from '@/lib/tokens';
import { FoundationPageShell } from '@/components/foundation-page-shell';
import { RulesGrid, InContextPanel } from '@/components/rules-grid';
import { TypeSpecimen } from '@/components/type-specimen';

const SAMPLE = 'ComPsych helps people thrive at work and in life.';
const SECONDARY_SAMPLE =
  'A concise, well-chosen word lands better than a complete, carefully-worded paragraph.';

interface Role {
  key: keyof typeof sys.typeScale;
  label: string;
  usage: string;
  sample?: string;
}

const DISPLAY: Role[] = [
  { key: 'displayLarge',  label: 'Display · Large',  usage: 'Hero moments, marketing headers. Use sparingly.' },
  { key: 'displayMedium', label: 'Display · Medium', usage: 'Secondary hero, onboarding titles.' },
  { key: 'displaySmall',  label: 'Display · Small',  usage: 'Section heroes within a long page.' },
];

const HEADLINE: Role[] = [
  { key: 'headlineLarge',  label: 'Headline · Large',  usage: 'Page titles.' },
  { key: 'headlineMedium', label: 'Headline · Medium', usage: 'Section titles.' },
  { key: 'headlineSmall',  label: 'Headline · Small',  usage: 'Subsection titles.' },
];

const TITLE: Role[] = [
  { key: 'titleLarge',  label: 'Title · Large',  usage: 'Card and modal titles.' },
  { key: 'titleMedium', label: 'Title · Medium', usage: 'List group headers, tab labels.' },
  { key: 'titleSmall',  label: 'Title · Small',  usage: 'Dense list headers, inline labels.' },
];

const BODY: Role[] = [
  { key: 'bodyLarge',  label: 'Body · Large',  usage: 'Lead paragraphs, richer prose.', sample: SAMPLE },
  { key: 'bodyMedium', label: 'Body · Medium', usage: 'Default paragraph text.',        sample: SECONDARY_SAMPLE },
  { key: 'bodySmall',  label: 'Body · Small',  usage: 'Captions, helper text, disclaimers.', sample: SECONDARY_SAMPLE },
];

const LABEL: Role[] = [
  { key: 'labelLarge',  label: 'Label · Large',  usage: 'Primary buttons, prominent labels.' },
  { key: 'labelMedium', label: 'Label · Medium', usage: 'Chips, tabs, field labels.' },
  { key: 'labelSmall',  label: 'Label · Small',  usage: 'Small tags, metadata.' },
];

export default function TypographyPage() {
  return (
    <FoundationPageShell
      title="Typography"
      description="Five role families (Display, Headline, Title, Body, Label) with three sizes each, plus an emphasised weight per role. One consistent scale across every product."
      whyThisMatters={
        <>
          Type is the voice of the product. A predictable scale with a small
          number of roles keeps product surfaces calm and legible — and keeps
          hierarchy decisions out of component code. Use roles, not pixel
          sizes.
        </>
      }
      rules={
        <RulesGrid
          dos={[
            'Pick one Display / Headline per page. Let the hierarchy breathe.',
            'Use Body for prose, Label for controls and chips.',
            'Reach for the emphasised weight variant when mid-paragraph emphasis is truly needed.',
          ]}
          donts={[
            'Invent one-off font sizes to fit a design.',
            'Mix three sizes of headlines on a single page.',
            'Change line-height to shoehorn text into a space — shorten the text instead.',
          ]}
        />
      }
    >
      <TypeSection title="Display" blurb="Biggest type. Marketing and hero moments.">
        {DISPLAY.map((r) => (
          <TypeSpecimen key={r.key} role={r.key} label={r.label} sample={r.sample ?? SAMPLE} />
        ))}
      </TypeSection>

      <TypeSection title="Headline" blurb="Primary page and section titles.">
        {HEADLINE.map((r) => (
          <TypeSpecimen key={r.key} role={r.key} label={r.label} sample={r.sample ?? SAMPLE} />
        ))}
      </TypeSection>

      <TypeSection title="Title" blurb="Card, modal, and group titles.">
        {TITLE.map((r) => (
          <TypeSpecimen key={r.key} role={r.key} label={r.label} sample={r.sample ?? SAMPLE} />
        ))}
      </TypeSection>

      <TypeSection title="Body" blurb="Reading text. Most of your prose lives here.">
        {BODY.map((r) => (
          <TypeSpecimen key={r.key} role={r.key} label={r.label} sample={r.sample ?? SAMPLE} />
        ))}
      </TypeSection>

      <TypeSection title="Label" blurb="UI text: buttons, chips, form labels.">
        {LABEL.map((r) => (
          <TypeSpecimen key={r.key} role={r.key} label={r.label} sample="Start now" />
        ))}
      </TypeSection>

      <InContextPanel>
        <p className="ref-body max-w-2xl">
          The emphasised weight variant exists on every role. Use it for the
          small number of moments where inline emphasis helps comprehension —
          not as a second, louder style.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <TypeSpecimen role="bodyLarge" label="Body · Large (emphasised)" sample={SAMPLE} emphasized />
          <TypeSpecimen role="titleMedium" label="Title · Medium (emphasised)" sample={SAMPLE} emphasized />
        </div>
      </InContextPanel>
    </FoundationPageShell>
  );
}

function TypeSection({
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
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}
