'use client';

import { useCssVar } from '@/lib/utils';
import { CopyChip } from './copy-chip';
import type { TokenLeaf } from '@/lib/tokens';

interface Props {
  token: TokenLeaf;
  /** Optional second token rendered as text over the first — for on-* pairings. */
  onToken?: TokenLeaf;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * A labelled color swatch. `token` colors the background; if `onToken` is
 * provided it colors the label text and icon, demonstrating a pairing.
 */
export function ColorSwatch({ token, onToken, label, size = 'md' }: Props) {
  const resolved = useCssVar(token.cssVar);
  const height = size === 'sm' ? 56 : size === 'lg' ? 128 : 88;

  return (
    <div
      className="flex flex-col rounded overflow-hidden"
      style={{
        border:
          '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
      }}
    >
      <div
        className="flex items-center justify-center px-3 text-sm font-medium"
        style={{
          height,
          backgroundColor: `var(${token.cssVar})`,
          color: onToken ? `var(${onToken.cssVar})` : 'inherit',
        }}
      >
        {onToken ? <span>Aa · on-pairing text</span> : null}
      </div>
      <div
        className="p-2 flex flex-col gap-1.5 text-xs"
        style={{
          backgroundColor:
            'var(--sys-color-roles-surface-surface-container-sys-surface-container-lowest, #ffffff)',
        }}
      >
        <div className="font-medium truncate">{label ?? token.path.at(-1)}</div>
        <div className="font-mono opacity-70 truncate">{resolved || '—'}</div>
        <CopyChip value={`var(${token.cssVar})`} />
      </div>
    </div>
  );
}
