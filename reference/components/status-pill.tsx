type StatusKind = 'complete' | 'in-progress' | 'planned';

interface Props {
  kind: StatusKind;
  label?: string;
}

/**
 * Small colored dot + label. Used on the About page to communicate
 * deliverable status without emoji. Shapes, not glyphs.
 */
export function StatusPill({ kind, label }: Props) {
  const { dot, ring, text } = palettes[kind];
  return (
    <span
      className="inline-flex items-center gap-2 ref-caption font-medium"
      style={{ color: text }}
    >
      <span
        aria-hidden
        className="inline-block"
        style={{
          width: 10,
          height: 10,
          borderRadius: 9999,
          backgroundColor: dot,
          boxShadow: `0 0 0 3px ${ring}`,
        }}
      />
      {label ?? defaultLabel[kind]}
    </span>
  );
}

const defaultLabel: Record<StatusKind, string> = {
  complete: 'Complete',
  'in-progress': 'In progress',
  planned: 'Planned',
};

const palettes: Record<StatusKind, { dot: string; ring: string; text: string }> = {
  complete: {
    dot: 'var(--sys-color-roles-custom-success-sys-success, #278647)',
    ring: 'var(--sys-color-roles-custom-success-sys-success-container, #c4e9d0)',
    text: 'var(--sys-color-roles-custom-success-sys-on-success-container, #030c09)',
  },
  'in-progress': {
    dot: 'var(--sys-color-roles-custom-warning-sys-warning, #d67d00)',
    ring: 'var(--sys-color-roles-custom-warning-sys-warning-container, #fdeed9)',
    text: 'var(--sys-color-roles-custom-warning-sys-on-warning-container, #3a2304)',
  },
  planned: {
    dot: 'var(--sys-color-roles-outline-sys-outline-fixed, #8a96a6)',
    ring: 'var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
    text: 'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
  },
};
