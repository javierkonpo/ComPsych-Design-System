'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';

interface Props {
  /** The literal code to render and copy. */
  code: string;
  /**
   * Optional accessible label read by screen readers. Defaults to
   * "Copy code snippet".
   */
  label?: string;
}

/**
 * Multi-line code block with a click-to-copy affordance.
 *
 * Shows the code in a monospace pre, with a small Copy/Copied button
 * pinned to the top-right. Clicking anywhere on the button copies the
 * full literal `code` to the clipboard and shows a Check for ~1.2s.
 *
 * Styled entirely with sys.* tokens so it re-themes cleanly in the
 * reference app. Use for install / usage snippets on About-style
 * pages where users expect to paste the whole thing verbatim.
 */
export function CopyCodeBlock({ code, label }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const ok = await copyToClipboard(code);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    }
  }

  return (
    <div className="relative">
      <pre
        className="ref-caption font-mono overflow-x-auto"
        style={{
          margin: 0,
          // Reserve space on the right for the copy button so the code
          // never underlaps it at any viewport width.
          padding: '12px 52px 12px 14px',
          borderRadius: 8,
          backgroundColor:
            'var(--sys-color-roles-surface-surface-container-sys-surface-container, #f3f4f6)',
          color:
            'var(--sys-color-roles-surface-surface-sys-on-surface, #1b1d22)',
          fontSize: 12,
          lineHeight: 1.55,
          whiteSpace: 'pre',
        }}
      >
        {code}
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={label ?? 'Copy code snippet'}
        title={copied ? 'Copied' : 'Copy'}
        className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-1 text-[11px] font-mono rounded cursor-pointer transition-colors"
        style={{
          backgroundColor: copied
            ? 'var(--sys-color-roles-custom-success-sys-success-container, #c4e9d0)'
            : 'var(--sys-color-roles-surface-surface-container-sys-surface-container-lowest, #ffffff)',
          color: copied
            ? 'var(--sys-color-roles-custom-success-sys-on-success-container, #030c09)'
            : 'var(--sys-color-roles-surface-surface-sys-on-surface, #1b1d22)',
          border:
            '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
        }}
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
        <span>{copied ? 'Copied' : 'Copy'}</span>
      </button>
    </div>
  );
}
