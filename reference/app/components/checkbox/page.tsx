'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Checkbox, type CheckboxCheckedState } from '@/components/ds/checkbox';
import { FoundationPageShell } from '@/components/foundation-page-shell';
import { Playground } from '@/components/playground';

// ---------------------------------------------------------------------------
// Playground wrapper — maps a friendly "selection" enum to the Checkbox's
// tri-state `checked` prop (boolean | 'indeterminate'), so the Playground can
// expose the three selection values as an enum control.
// ---------------------------------------------------------------------------

interface PlaygroundCheckboxProps {
  selection: 'unchecked' | 'checked' | 'indeterminate';
  size: 'sm' | 'md';
  label: string;
  description: string;
  disabled: boolean;
  invalid: boolean;
}

function PlaygroundCheckbox({
  selection,
  size,
  label,
  description,
  disabled,
  invalid,
}: PlaygroundCheckboxProps) {
  const checked: CheckboxCheckedState =
    selection === 'checked'
      ? true
      : selection === 'indeterminate'
        ? 'indeterminate'
        : false;
  return (
    <Checkbox
      checked={checked}
      onChange={() => {}}
      size={size}
      label={label || undefined}
      description={description || undefined}
      disabled={disabled}
      invalid={invalid}
    />
  );
}

export default function CheckboxPage() {
  return (
    <FoundationPageShell
      eyebrow="Components"
      title="Checkbox"
      description="A binary (or tri-state) input for turning a single option on and off, or representing a parent selection that aggregates children. Every value resolves to sys.* tokens and re-themes live with the active bundle."
    >
      {/* Playground ------------------------------------------------ */}
      <Section
        heading="Playground"
        lead="The real Checkbox rendered live. Change any control on the right to see the component update."
      >
        <Playground
          component={PlaygroundCheckbox as never}
          controls={[
            {
              name: 'selection',
              type: 'enum',
              label: 'Selection',
              options: ['unchecked', 'checked', 'indeterminate'],
              defaultValue: 'unchecked',
            },
            {
              name: 'size',
              type: 'enum',
              label: 'Size',
              options: ['sm', 'md'],
              defaultValue: 'md',
            },
            {
              name: 'label',
              type: 'string',
              label: 'Label',
              defaultValue: 'Accept terms and conditions',
            },
            {
              name: 'description',
              type: 'string',
              label: 'Description',
              defaultValue: '',
              placeholder: 'Optional secondary text',
            },
            { name: 'disabled', type: 'boolean', label: 'Disabled', defaultValue: false },
            { name: 'invalid', type: 'boolean', label: 'Invalid', defaultValue: false },
          ]}
        />
      </Section>

      {/* Selection states ----------------------------------------- */}
      <Section
        heading="Selection states"
        lead="Unselected, Selected, and Indeterminate. Tri-state is for parent rows that aggregate children."
      >
        <Surface>
          <div className="grid gap-8" style={{ gridTemplateColumns: 'repeat(3, minmax(180px, 1fr))' }}>
            <StateCell label="Unselected">
              <Checkbox checked={false} onChange={() => {}} />
            </StateCell>
            <StateCell label="Selected">
              <Checkbox checked={true} onChange={() => {}} />
            </StateCell>
            <StateCell label="Indeterminate">
              <Checkbox checked="indeterminate" onChange={() => {}} />
            </StateCell>
          </div>
        </Surface>
      </Section>

      {/* States --------------------------------------------------- */}
      <Section
        heading="States"
        lead="Default, disabled, and invalid. Hover, focus, and pressed render on real pointer or keyboard interaction."
      >
        <Surface>
          <div className="grid gap-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            <StateCell label="Default (hover / tab me)">
              <Checkbox checked={true} onChange={() => {}} />
            </StateCell>
            <StateCell label="Disabled, unchecked">
              <Checkbox checked={false} disabled onChange={() => {}} />
            </StateCell>
            <StateCell label="Disabled, checked">
              <Checkbox checked={true} disabled onChange={() => {}} />
            </StateCell>
            <StateCell label="Invalid (danger)">
              <Checkbox checked={false} invalid onChange={() => {}} />
            </StateCell>
            <StateCell label="Invalid, selected">
              <Checkbox checked={true} invalid onChange={() => {}} />
            </StateCell>
            <StateCell label="Invalid, indeterminate">
              <Checkbox checked="indeterminate" invalid onChange={() => {}} />
            </StateCell>
          </div>
        </Surface>
      </Section>

      {/* Sizes ---------------------------------------------------- */}
      <Section
        heading="Sizes"
        lead="sm = 20 px box with body-small label; md = 24 px box with body-medium label."
      >
        <Surface>
          <div className="flex flex-col gap-4 items-start">
            <Checkbox size="md" label="Medium checkbox (24px)" onChange={() => {}} />
            <Checkbox size="sm" label="Small checkbox (20px)" onChange={() => {}} />
          </div>
        </Surface>
      </Section>

      {/* Labels --------------------------------------------------- */}
      <Section
        heading="With label and description"
        lead="The full label area is clickable. Description renders beneath the label in on-surface-variant."
      >
        <Surface>
          <div className="flex flex-col gap-5 items-start">
            <LabelledDemo />
            <Checkbox
              label="Send me release notes"
              description="Monthly email summarising what changed in the design system."
              onChange={() => {}}
            />
            <Checkbox
              label="I agree to the terms"
              description="You won't be able to submit the form without this."
              invalid
              onChange={() => {}}
            />
          </div>
        </Surface>
      </Section>

      {/* Canonical sources --------------------------------------- */}
      <Section heading="Canonical sources">
        <div className="flex flex-col gap-2">
          <LinkRow
            label="Specification"
            href="https://github.com/javierkonpo/ComPsych-Design-System/blob/main/specs/checkbox.spec.md"
            hint="specs/checkbox.spec.md"
          />
          <LinkRow
            label="Figma component"
            href="https://www.figma.com/design/VFBn7KCDy3FSIlvhNo3ylq/ComPsych-Design-System---Core-Components?node-id=17-1179"
            hint="Figma link"
          />
          <LinkRow
            label="React reference"
            href="https://github.com/javierkonpo/ComPsych-Design-System/tree/main/reference/components/ds/checkbox"
            hint="reference/components/ds/checkbox/"
          />
        </div>
      </Section>
    </FoundationPageShell>
  );
}

// ---------------------------------------------------------------------------
// Interactive demo showing the full click-to-toggle behaviour.
// ---------------------------------------------------------------------------

function LabelledDemo() {
  const [checked, setChecked] = useState(true);
  return (
    <Checkbox
      label="Subscribe to product updates"
      description="We'll email you when a new component ships."
      checked={checked}
      onChange={setChecked}
    />
  );
}

// ---------------------------------------------------------------------------
// Local page helpers
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
      className="rounded-lg p-8"
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

function StateCell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-3">
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
        color: 'var(--sys-color-roles-surface-surface-sys-on-surface, #1b1d22)',
        textDecoration: 'none',
      }}
    >
      <span className="ref-body font-medium">{label}</span>
      <span className="flex items-center gap-3">
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
        <ArrowUpRight
          size={16}
          aria-hidden
          style={{
            color:
              'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
            flexShrink: 0,
          }}
        />
      </span>
    </Link>
  );
}
