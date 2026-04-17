'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';

interface Props {
  value: string;
  label?: string;
  /**
   * When true the chip becomes a block-level element that fills its parent's
   * width, so long token paths truncate with an ellipsis instead of
   * overflowing the card. Default: false (intrinsic inline-flex sizing).
   */
  block?: boolean;
  className?: string;
}

/**
 * Inline chip that shows a monospaced token name and copies it on click.
 *
 * By default the chip sizes to its content (inline-flex). Pass `block` when
 * the chip lives inside a fixed-width card — it will stretch to fill the
 * parent and truncate the value with an ellipsis, with the full value still
 * available via the native title tooltip and the copy action.
 */
export function CopyChip({ value, label, block = false, className }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const ok = await copyToClipboard(value);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    }
  }

  const layout = block
    ? 'flex w-full max-w-full items-center gap-1.5'
    : 'inline-flex max-w-full items-center gap-1.5';

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy ${label ?? value}`}
      title={value}
      className={`${layout} px-2 py-0.5 font-mono text-[11px] rounded cursor-pointer ${className ?? ''}`}
      style={{
        backgroundColor:
          'var(--sys-color-roles-surface-surface-container-sys-surface-container, #f3f4f6)',
        color: 'var(--sys-color-roles-surface-surface-sys-on-surface, #1b1d22)',
        border:
          '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
      }}
    >
      {/* min-w-0 is required so the truncate on the span actually kicks in
          inside the flex parent — without it the span reports its intrinsic
          content width and the button overflows the card. */}
      <span className="min-w-0 flex-1 truncate text-left">{value}</span>
      {copied ? (
        <Check size={12} className="shrink-0" />
      ) : (
        <Copy size={12} className="shrink-0" />
      )}
    </button>
  );
}
