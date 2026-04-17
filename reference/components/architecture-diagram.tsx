/**
 * Four-tier architecture diagram. HTML/CSS boxes + arrow glyphs, themed
 * through sys tokens. Stakeholder-facing — each tier carries a plain-
 * language description, not a technical shorthand.
 */
export function ArchitectureDiagram() {
  return (
    <div className="w-full">
      <ol
        className="flex flex-col md:flex-row md:items-stretch gap-3 md:gap-0"
        role="list"
        aria-label="Four-tier token architecture"
      >
        {TIERS.map((t, i) => (
          <li key={t.key} className="flex items-stretch flex-1 min-w-0">
            <TierCard tier={t} />
            {i < TIERS.length - 1 && <TierArrow />}
          </li>
        ))}
      </ol>
    </div>
  );
}

interface Tier {
  key: string;
  label: string;
  tag: string;
  description: string;
  tone: 'internal' | 'public';
}

const TIERS: Tier[] = [
  {
    key: 'brand',
    label: 'Brand',
    tag: 'Tier 4',
    description:
      'Raw color values per white-label brand. The entry point for brand-specific overrides.',
    tone: 'internal',
  },
  {
    key: 'core',
    label: 'Core',
    tag: 'Tier 1',
    description:
      'Primitives: tonal color ramps, spacing scale, type scale, motion. No semantic meaning.',
    tone: 'internal',
  },
  {
    key: 'product',
    label: 'Product',
    tag: 'Tier 3',
    description:
      'Semantic role mappings per product (GRO, CRC, GN, FMLA). Where products differ.',
    tone: 'internal',
  },
  {
    key: 'system',
    label: 'System',
    tag: 'Tier 2',
    description:
      'What components consume. The only tier referenced in UI code.',
    tone: 'public',
  },
];

function TierCard({ tier }: { tier: Tier }) {
  const isPublic = tier.tone === 'public';
  return (
    <div
      className="rounded-lg p-5 flex-1 flex flex-col gap-2 min-w-0"
      style={{
        backgroundColor: isPublic
          ? 'var(--sys-color-roles-accent-primary-sys-primary-container, #070f36)'
          : 'var(--sys-color-roles-surface-surface-container-sys-surface-container-lowest, #ffffff)',
        color: isPublic
          ? 'var(--sys-color-roles-accent-primary-sys-on-primary-container, #ffffff)'
          : 'var(--sys-color-roles-surface-surface-sys-on-surface, #1b1d22)',
        border: isPublic
          ? '1px solid var(--sys-color-roles-accent-primary-sys-primary, #075cba)'
          : '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
      }}
    >
      <div
        className="ref-caption uppercase tracking-wider font-semibold"
        style={{
          color: isPublic
            ? 'var(--sys-color-roles-accent-primary-sys-on-primary-container-variant, #b9dcff)'
            : 'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
          letterSpacing: '0.08em',
        }}
      >
        {tier.tag}
      </div>
      <div className="ref-heading-md">{tier.label}</div>
      <p className="ref-body-sm" style={{ opacity: isPublic ? 0.92 : 1 }}>
        {tier.description}
      </p>
      {isPublic && (
        <div
          className="ref-caption mt-1 font-medium"
          style={{
            color:
              'var(--sys-color-roles-accent-primary-sys-on-primary-container-variant, #b9dcff)',
          }}
        >
          Used in UI →
        </div>
      )}
    </div>
  );
}

function TierArrow() {
  return (
    <div
      aria-hidden
      className="hidden md:flex items-center justify-center shrink-0"
      style={{ width: 36 }}
    >
      <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
        <path
          d="M0 6H22M22 6L16 1M22 6L16 11"
          stroke="var(--sys-color-roles-outline-sys-outline-fixed, #8a96a6)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
