import type { ReactNode } from 'react';

interface RulesGridProps {
  dos: string[];
  donts: string[];
}

/**
 * Two-column Do / Don't usage-rule callout. Used at the top of every
 * foundation page so stakeholders see the guardrails before the tokens.
 */
export function RulesGrid({ dos, donts }: RulesGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <RulesColumn kind="do" items={dos} />
      <RulesColumn kind="dont" items={donts} />
    </div>
  );
}

function RulesColumn({
  kind,
  items,
}: {
  kind: 'do' | 'dont';
  items: string[];
}) {
  const isDo = kind === 'do';
  const palette = {
    borderAccent: isDo
      ? 'var(--sys-color-roles-custom-success-sys-success, #278647)'
      : 'var(--sys-color-roles-error-sys-error, #d82727)',
    labelColor: isDo
      ? 'var(--sys-color-roles-custom-success-sys-on-success-container, #030c09)'
      : 'var(--sys-color-roles-error-sys-on-error-container, #570f0f)',
    labelBg: isDo
      ? 'var(--sys-color-roles-custom-success-sys-success-container, #c4e9d0)'
      : 'var(--sys-color-roles-error-sys-error-container, #f7d4d4)',
  };

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{
        border:
          '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
        backgroundColor:
          'var(--sys-color-roles-surface-surface-container-sys-surface-container-lowest, #ffffff)',
      }}
    >
      <div
        className="px-5 py-2.5 ref-caption uppercase tracking-wider font-semibold"
        style={{
          backgroundColor: palette.labelBg,
          color: palette.labelColor,
          borderBottom: `2px solid ${palette.borderAccent}`,
          letterSpacing: '0.08em',
        }}
      >
        {isDo ? 'Do' : "Don't"}
      </div>
      <ul className="p-5 flex flex-col gap-2.5">
        {items.map((item, i) => (
          <li
            key={i}
            className="ref-body flex gap-2.5"
            style={{
              color:
                'var(--sys-color-roles-surface-surface-sys-on-surface, #1b1d22)',
            }}
          >
            <Bullet kind={kind} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Bullet({ kind }: { kind: 'do' | 'dont' }) {
  const color =
    kind === 'do'
      ? 'var(--sys-color-roles-custom-success-sys-success, #278647)'
      : 'var(--sys-color-roles-error-sys-error, #d82727)';
  return (
    <span
      aria-hidden
      className="shrink-0 mt-[7px]"
      style={{
        width: 6,
        height: 6,
        borderRadius: 9999,
        backgroundColor: color,
      }}
    />
  );
}

export function InContextPanel({
  title = 'In context',
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <section
      className="rounded-lg p-6 md:p-8"
      style={{
        backgroundColor:
          'var(--sys-color-roles-surface-surface-container-sys-surface-container, #f3f4f6)',
        border:
          '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
      }}
    >
      <div
        className="ref-caption uppercase tracking-wider font-semibold mb-4"
        style={{
          color:
            'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
          letterSpacing: '0.08em',
        }}
      >
        {title}
      </div>
      {children}
    </section>
  );
}
