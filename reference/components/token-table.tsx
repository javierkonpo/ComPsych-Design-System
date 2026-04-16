'use client';

import { useCssVar } from '@/lib/utils';
import { CopyChip } from './copy-chip';
import type { TokenLeaf } from '@/lib/tokens';

interface Props {
  tokens: TokenLeaf[];
  showResolvedSwatch?: boolean;
  valueKind?: 'color' | 'number' | 'text';
}

export function TokenTable({ tokens, showResolvedSwatch = false, valueKind = 'text' }: Props) {
  return (
    <div
      className="overflow-x-auto rounded"
      style={{
        border: '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
      }}
    >
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr
            style={{
              backgroundColor:
                'var(--sys-color-roles-surface-surface-container-sys-surface-container, #f3f4f6)',
            }}
          >
            <Th>Token path</Th>
            <Th>CSS variable</Th>
            <Th>Resolved value</Th>
            {showResolvedSwatch && <Th style={{ width: 80 }}>Preview</Th>}
          </tr>
        </thead>
        <tbody>
          {tokens.map((t) => (
            <Row
              key={t.cssVar}
              token={t}
              showResolvedSwatch={showResolvedSwatch}
              valueKind={valueKind}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <th
      className="text-left px-3 py-2 text-xs uppercase tracking-wide font-medium"
      style={{
        borderBottom:
          '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
        ...style,
      }}
    >
      {children}
    </th>
  );
}

function Row({
  token,
  showResolvedSwatch,
  valueKind,
}: {
  token: TokenLeaf;
  showResolvedSwatch: boolean;
  valueKind: 'color' | 'number' | 'text';
}) {
  const resolved = useCssVar(token.cssVar) || String(token.defaultValue);
  const displayValue = valueKind === 'number' && resolved && !/[a-z%]/i.test(resolved)
    ? `${resolved}px`
    : resolved;

  return (
    <tr
      style={{
        borderTop:
          '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
      }}
    >
      <Td>
        <code className="text-xs">sys.{token.path.join('.')}</code>
      </Td>
      <Td>
        <CopyChip value={`var(${token.cssVar})`} label={token.cssVar} />
      </Td>
      <Td>
        <span className="font-mono text-xs">{displayValue || '—'}</span>
      </Td>
      {showResolvedSwatch && (
        <Td>
          <span
            className="inline-block w-10 h-6 rounded"
            style={{
              backgroundColor: `var(${token.cssVar})`,
              border:
                '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
            }}
            aria-hidden
          />
        </Td>
      )}
    </tr>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-3 py-2 align-middle">{children}</td>;
}
