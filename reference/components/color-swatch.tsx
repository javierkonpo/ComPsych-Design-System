'use client';

import { useCssVar } from '@/lib/utils';
import type { TokenLeaf } from '@/lib/tokens';
import { CopyChip } from './copy-chip';

interface Props {
  /** Background color token. */
  token: TokenLeaf;
  /** Optional paired on-* token. When present, it colors the label text
   *  rendered over the swatch, demonstrating the pairing. */
  onToken?: TokenLeaf;
  /** Prominent role name, e.g. "Primary" or "Success container". */
  label: string;
  /** Short usage hint — when this role should be reached for. */
  usage?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Stakeholder-first color swatch.
 *
 * Surfaces: role name (prominent), short usage hint, resolved value, and
 * full token path as muted reference text. No copy button, no giant
 * --sys-* chip.
 */
export function ColorSwatch({
  token,
  onToken,
  label,
  usage,
  size = 'md',
}: Props) {
  const resolved = useCssVar(token.cssVar);
  const height = size === 'sm' ? 64 : size === 'lg' ? 132 : 96;

  return (
    <div
      className="flex flex-col rounded-lg overflow-hidden h-full"
      style={{
        border:
          '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
        backgroundColor:
          'var(--sys-color-roles-surface-surface-container-sys-surface-container-lowest, #ffffff)',
      }}
    >
      <div
        className="flex items-center justify-center px-4 ref-body font-medium"
        style={{
          height,
          backgroundColor: `var(${token.cssVar})`,
          color: onToken ? `var(${onToken.cssVar})` : 'transparent',
        }}
      >
        {onToken ? 'Aa · on-pairing text' : null}
      </div>
      <div className="p-4 flex flex-col gap-1.5">
        <div className="ref-heading-md">{label}</div>
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
        <span
          className="ref-body-sm font-mono pt-1"
          style={{
            color:
              'var(--sys-color-roles-surface-surface-sys-on-surface, #1b1d22)',
          }}
        >
          {resolved || '—'}
        </span>
        {/* Full dot-notation path via the shared CopyChip — same pattern as
            every other foundation gallery. Block mode truncates the long
            path with an ellipsis and exposes the full value on hover + copy. */}
        <CopyChip block value={`sys.${token.path.join('.')}`} />
      </div>
    </div>
  );
}
