'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';

interface Props {
  value: string;
  label?: string;
}

/**
 * Inline chip that shows a monospaced token name and copies it on click.
 */
export function CopyChip({ value, label }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const ok = await copyToClipboard(value);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy ${label ?? value}`}
      className="inline-flex items-center gap-1.5 px-2 py-0.5 font-mono text-[11px] rounded cursor-pointer"
      style={{
        backgroundColor:
          'var(--sys-color-roles-surface-surface-container-sys-surface-container, #f3f4f6)',
        color: 'var(--sys-color-roles-surface-surface-sys-on-surface, #1b1d22)',
        border:
          '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
      }}
    >
      <span className="truncate">{value}</span>
      {copied ? <Check size={12} /> : <Copy size={12} />}
    </button>
  );
}
