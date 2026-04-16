'use client';

import type { TokenLeaf } from '@/lib/tokens';
import { useCssVar, toPx } from '@/lib/utils';
import { CopyChip } from './copy-chip';

interface Props {
  token: TokenLeaf;
  usage?: string;
}

export function RadiusSample({ token, usage }: Props) {
  const value = useCssVar(token.cssVar);
  return (
    <div className="flex flex-col gap-2">
      <div
        className="w-full aspect-[3/2] flex items-center justify-center"
        style={{
          backgroundColor:
            'var(--sys-color-roles-accent-primary-sys-primary-container, #070f36)',
          color:
            'var(--sys-color-roles-accent-primary-sys-on-primary-container, #ffffff)',
          borderRadius: toPx(value),
        }}
      >
        <span className="text-xs font-mono">{toPx(value)}</span>
      </div>
      <div className="flex flex-col gap-1 text-xs">
        <div className="font-medium">{token.path.at(-1)}</div>
        {usage && (
          <div
            className="opacity-70"
            style={{
              color:
                'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
            }}
          >
            {usage}
          </div>
        )}
        <CopyChip value={`var(${token.cssVar})`} />
      </div>
    </div>
  );
}
