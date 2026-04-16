'use client';

import type { TokenLeaf } from '@/lib/tokens';
import { useCssVar } from '@/lib/utils';

interface Props {
  label: string;
  tokens: TokenLeaf[];
}

/**
 * A horizontal ramp of color swatches, typically one color role family's
 * tonal progression or a chart scale. Renders each swatch with its token
 * name and computed hex value.
 */
export function ColorRamp({ label, tokens }: Props) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-sm font-medium">{label}</h3>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${tokens.length}, minmax(0, 1fr))` }}
      >
        {tokens.map((token) => (
          <Cell key={token.cssVar} token={token} />
        ))}
      </div>
    </section>
  );
}

function Cell({ token }: { token: TokenLeaf }) {
  const value = useCssVar(token.cssVar);
  return (
    <div
      className="rounded overflow-hidden"
      style={{
        border:
          '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
      }}
    >
      <div style={{ height: 56, backgroundColor: `var(${token.cssVar})` }} />
      <div
        className="p-1.5 text-[10px] font-mono"
        style={{
          backgroundColor:
            'var(--sys-color-roles-surface-surface-container-sys-surface-container-lowest, #ffffff)',
        }}
      >
        <div className="truncate">{token.path.at(-1)}</div>
        <div className="opacity-70 truncate">{value || '—'}</div>
      </div>
    </div>
  );
}
