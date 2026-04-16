'use client';

import type { TokenLeaf } from '@/lib/tokens';
import { useCssVar, toPx } from '@/lib/utils';
import { CopyChip } from './copy-chip';

interface Props {
  tokens: TokenLeaf[];
  /** Max value in the scale — used to compute bar-width ratios. */
  maxValue?: number;
}

/**
 * Horizontal bar chart: one row per spacing token, bar width scaled to the
 * token's actual pixel value. Gives a quick visual of the scale.
 */
export function SpacingSample({ tokens, maxValue = 96 }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {tokens.map((t) => (
        <Row key={t.cssVar} token={t} max={maxValue} />
      ))}
    </div>
  );
}

function Row({ token, max }: { token: TokenLeaf; max: number }) {
  const value = useCssVar(token.cssVar);
  const numeric = Number(value || token.defaultValue || 0);
  const widthPct = max > 0 ? Math.max(0, Math.min(100, (Math.abs(numeric) / max) * 100)) : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="w-40 shrink-0 text-xs font-mono truncate">
        sys.{token.path.slice(-3).join('.')}
      </div>
      <div className="flex-1">
        <div
          className="h-4 rounded"
          style={{
            width: `${widthPct}%`,
            backgroundColor:
              'var(--sys-color-roles-accent-primary-sys-primary, #075cba)',
            opacity: numeric < 0 ? 0.35 : 1,
          }}
          title={numeric < 0 ? 'Negative spacing (absolute width shown)' : undefined}
        />
      </div>
      <div className="w-16 shrink-0 text-xs font-mono text-right opacity-80">
        {toPx(value)}
      </div>
      <div className="w-[180px] shrink-0">
        <CopyChip value={`var(${token.cssVar})`} />
      </div>
    </div>
  );
}
