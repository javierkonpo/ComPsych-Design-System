'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Heart, Download, ArrowRight, Plus } from 'lucide-react';
import { Button, type ButtonVariant, type ButtonSize } from '@/components/ds/button';
import { FoundationPageShell } from '@/components/foundation-page-shell';

const VARIANTS: Array<{ value: ButtonVariant; label: string; description: string }> = [
  { value: 'filled', label: 'Filled', description: 'Primary call to action.' },
  { value: 'tonal', label: 'Tonal', description: 'Secondary action with quiet emphasis.' },
  { value: 'outlined', label: 'Outlined', description: 'Neutral action with a visible edge.' },
  { value: 'elevated', label: 'Elevated', description: 'Floating action; lifts off the page.' },
  { value: 'text', label: 'Text', description: 'Lightest emphasis; inline with copy.' },
  { value: 'danger', label: 'Danger', description: 'Destructive confirmation.' },
  { value: 'danger-outlined', label: 'Danger Outlined', description: 'Low-emphasis destructive action.' },
];

const SIZES: ButtonSize[] = ['sm', 'md', 'lg', 'xl'];

export default function ButtonPage() {
  return (
    <FoundationPageShell
      eyebrow="Components"
      title="Button"
      description="The canonical interactive element. Seven visual variants, four sizes, five states — every value driven by sys.* tokens so the button re-themes with the active brand × product bundle."
    >
      {/* ------------------------------------------------------------------
          Live demo
          ------------------------------------------------------------------ */}
      <Section heading="Live demo" lead="The canonical button with default props (filled, md, with label).">
        <Surface>
          <Button label="Get started" leadingIcon={<ArrowRight />} />
        </Surface>
      </Section>

      {/* ------------------------------------------------------------------
          Variants
          ------------------------------------------------------------------ */}
      <Section heading="Variants" lead="Seven visual styles. Lower rows = lower emphasis.">
        <Surface>
          <div className="flex flex-wrap items-center gap-4">
            {VARIANTS.map((v) => (
              <div key={v.value} className="flex flex-col items-center gap-2">
                <Button variant={v.value} label="Button" />
                <div
                  className="ref-caption font-mono"
                  style={{
                    color:
                      'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
                  }}
                >
                  {v.value}
                </div>
              </div>
            ))}
          </div>
        </Surface>
      </Section>

      {/* ------------------------------------------------------------------
          Sizes
          ------------------------------------------------------------------ */}
      <Section heading="Sizes" lead="Four sizes: sm (32), md (40), lg (48), xl (56). Each has its own padding, typography, and icon size.">
        <Surface>
          <div className="flex flex-wrap items-end gap-4">
            {SIZES.map((s) => (
              <div key={s} className="flex flex-col items-center gap-2">
                <Button size={s} label={`Size ${s}`} leadingIcon={<Heart />} />
                <div
                  className="ref-caption font-mono"
                  style={{
                    color:
                      'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
                  }}
                >
                  {s}
                </div>
              </div>
            ))}
          </div>
        </Surface>
      </Section>

      {/* ------------------------------------------------------------------
          Icon compositions
          ------------------------------------------------------------------ */}
      <Section heading="Icon compositions" lead="Four compositions: leading-icon, trailing-icon, text-only, icon-only. Icons pass through as React nodes — use any Lucide icon.">
        <Surface>
          <div className="flex flex-wrap items-center gap-6">
            <Composition label="Leading icon">
              <Button label="Download" leadingIcon={<Download />} />
            </Composition>
            <Composition label="Trailing icon">
              <Button label="Continue" trailingIcon={<ArrowRight />} />
            </Composition>
            <Composition label="Text only">
              <Button label="Save" />
            </Composition>
            <Composition label="Icon only">
              <Button iconOnly leadingIcon={<Plus />} aria-label="Create new" />
            </Composition>
          </div>
        </Surface>
      </Section>

      {/* ------------------------------------------------------------------
          States
          ------------------------------------------------------------------ */}
      <Section
        heading="States"
        lead="Default, hover, focus, pressed, and disabled. Hover / focus / pressed require interaction — the dedicated columns show the static approximation via .ref-force-* utility classes."
      >
        <Surface>
          <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
            <StateColumn label="Default">
              <Button label="Button" />
            </StateColumn>
            <StateColumn label="Hover (hover me)">
              <Button label="Button" />
            </StateColumn>
            <StateColumn label="Focus (tab to focus)">
              <Button label="Button" autoFocus={false} />
            </StateColumn>
            <StateColumn label="Disabled">
              <Button label="Button" disabled />
            </StateColumn>
            <StateColumn label="Loading">
              <Button label="Saving" loading />
            </StateColumn>
          </div>
        </Surface>
      </Section>

      {/* ------------------------------------------------------------------
          Full width
          ------------------------------------------------------------------ */}
      <Section heading="Full width" lead="When the button needs to stretch to fill its container — typical inside forms on narrow screens.">
        <Surface>
          <div style={{ maxWidth: 360 }}>
            <Button fullWidth label="Continue" trailingIcon={<ArrowRight />} />
          </div>
        </Surface>
      </Section>

      {/* ------------------------------------------------------------------
          API reference
          ------------------------------------------------------------------ */}
      <Section heading="API reference" lead="Full prop contract. Web names. On React Native, onClick → onPress, aria-label → accessibilityLabel.">
        <div
          className="rounded-lg overflow-hidden"
          style={{
            border:
              '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
            backgroundColor:
              'var(--sys-color-roles-surface-surface-container-sys-surface-container-lowest, #ffffff)',
          }}
        >
          <PropsTable />
        </div>
      </Section>

      {/* ------------------------------------------------------------------
          Links
          ------------------------------------------------------------------ */}
      <Section heading="Canonical sources">
        <div className="flex flex-col gap-2">
          <LinkRow
            label="Specification"
            href="https://github.com/javierkonpo/ComPsych-Design-System/blob/main/specs/button.spec.md"
            hint="specs/button.spec.md"
          />
          <LinkRow
            label="Figma component"
            href="https://www.figma.com/design/VFBn7KCDy3FSIlvhNo3ylq/ComPsych-Design-System---Core-Components?node-id=17-1332"
            hint="ComPsych DS — Core Components"
          />
          <LinkRow
            label="React reference"
            href="https://github.com/javierkonpo/ComPsych-Design-System/tree/main/reference/components/ds/button"
            hint="reference/components/ds/button/"
          />
        </div>
      </Section>
    </FoundationPageShell>
  );
}

// ---------------------------------------------------------------------------
// Local page helpers (kept inline — this is the only page that uses them).
// ---------------------------------------------------------------------------

function Section({
  heading,
  lead,
  children,
}: {
  heading: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 max-w-3xl">
        <h2 className="ref-heading-lg" style={{ margin: 0 }}>
          {heading}
        </h2>
        {lead && (
          <p
            className="ref-body"
            style={{
              color:
                'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
              margin: 0,
            }}
          >
            {lead}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

function Surface({ children }: { children: ReactNode }) {
  return (
    <div
      className="rounded-lg p-8 flex items-center justify-center"
      style={{
        border:
          '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
        backgroundColor:
          'var(--sys-color-roles-surface-surface-container-sys-surface-container-low, #f9fafb)',
      }}
    >
      {children}
    </div>
  );
}

function Composition({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      {children}
      <div
        className="ref-caption font-mono"
        style={{
          color:
            'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
        }}
      >
        {label}
      </div>
    </div>
  );
}

function StateColumn({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      {children}
      <div
        className="ref-caption"
        style={{
          color:
            'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
        }}
      >
        {label}
      </div>
    </div>
  );
}

function LinkRow({
  label,
  href,
  hint,
}: {
  label: string;
  href: string;
  hint?: string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between rounded-md px-4 py-3"
      style={{
        border:
          '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
        backgroundColor:
          'var(--sys-color-roles-surface-surface-container-sys-surface-container-lowest, #ffffff)',
        color:
          'var(--sys-color-roles-surface-surface-sys-on-surface, #1b1d22)',
        textDecoration: 'none',
      }}
    >
      <span className="ref-body font-medium">{label}</span>
      {hint && (
        <span
          className="ref-caption font-mono"
          style={{
            color:
              'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
          }}
        >
          {hint}
        </span>
      )}
    </Link>
  );
}

function PropsTable() {
  const rows: Array<{
    name: string;
    type: string;
    def: string;
    notes: string;
  }> = [
    {
      name: 'variant',
      type: "'filled' | 'tonal' | 'outlined' | 'elevated' | 'text' | 'danger' | 'danger-outlined'",
      def: "'filled'",
      notes: 'Visual style.',
    },
    { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl'", def: "'md'", notes: 'Height, padding, typography, icon size.' },
    { name: 'iconOnly', type: 'boolean', def: 'false', notes: 'Square icon-only button. Requires aria-label.' },
    { name: 'leadingIcon', type: 'ReactNode', def: '—', notes: 'Rendered before label. Use a Lucide element.' },
    { name: 'trailingIcon', type: 'ReactNode', def: '—', notes: 'Rendered after label.' },
    { name: 'loading', type: 'boolean', def: 'false', notes: 'Swaps leading icon for spinner; suppresses activation.' },
    { name: 'disabled', type: 'boolean', def: 'false', notes: 'Disables interaction; applies disabled visual.' },
    { name: 'fullWidth', type: 'boolean', def: 'false', notes: 'Stretches the button to its container width.' },
    { name: 'label', type: 'string', def: '—', notes: 'Required unless iconOnly. React: children also accepted.' },
    { name: 'onClick', type: '(event) => void', def: '—', notes: 'Fires on activation. RN equivalent: onPress.' },
    { name: 'type', type: "'button' | 'submit' | 'reset'", def: "'button'", notes: 'Web only.' },
  ];
  return (
    <table className="w-full" style={{ borderCollapse: 'collapse' }}>
      <thead>
        <tr
          style={{
            backgroundColor:
              'var(--sys-color-roles-surface-surface-container-sys-surface-container, #f3f4f6)',
          }}
        >
          <HeaderCell>Prop</HeaderCell>
          <HeaderCell>Type</HeaderCell>
          <HeaderCell>Default</HeaderCell>
          <HeaderCell>Notes</HeaderCell>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr
            key={r.name}
            style={{
              borderTop:
                i === 0
                  ? 'none'
                  : '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
            }}
          >
            <Cell>
              <code className="ref-caption font-mono">{r.name}</code>
            </Cell>
            <Cell>
              <code
                className="ref-caption font-mono"
                style={{
                  color:
                    'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
                }}
              >
                {r.type}
              </code>
            </Cell>
            <Cell>
              <code className="ref-caption font-mono">{r.def}</code>
            </Cell>
            <Cell>
              <span className="ref-body-sm">{r.notes}</span>
            </Cell>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function HeaderCell({ children }: { children: ReactNode }) {
  return (
    <th
      className="text-left px-4 py-3 ref-body-sm font-semibold"
      style={{
        color: 'var(--sys-color-roles-surface-surface-sys-on-surface, #1b1d22)',
      }}
    >
      {children}
    </th>
  );
}

function Cell({ children }: { children: ReactNode }) {
  return (
    <td
      className="px-4 py-3 align-top"
      style={{
        color: 'var(--sys-color-roles-surface-surface-sys-on-surface, #1b1d22)',
      }}
    >
      {children}
    </td>
  );
}
