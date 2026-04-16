'use client';

import { useCssVar, normalizeFontWeight, toPx, UI_FONT_STACK } from '@/lib/utils';
import { pathToCssVar } from '@/lib/tokens';
import { CopyChip } from './copy-chip';

interface Props {
  role: string; // camelCase, e.g. 'displayLarge'
  label: string; // human-readable, e.g. 'Display · Large'
  sample?: string;
  /** Use the emphasized font weight variant. */
  emphasized?: boolean;
}

/**
 * Renders a single typography role sample. Reads every sub-token from
 * `sys.typeScale.<role>.*` at runtime via CSS variables.
 */
export function TypeSpecimen({
  role,
  label,
  sample = 'The quick brown fox jumps over the lazy dog',
  emphasized = false,
}: Props) {
  const basePath = ['typeScale', role];

  const fontSizeVar = pathToCssVar([...basePath, 'sysFontSize']);
  const lineHeightVar = pathToCssVar([...basePath, 'sysLineHeight']);
  const trackingVar = pathToCssVar([...basePath, 'sysTracking']);
  const weightVar = pathToCssVar([
    ...basePath,
    emphasized ? 'sysFontWeightEmphasized' : 'sysFontWeight',
  ]);

  const fontSize = useCssVar(fontSizeVar);
  const lineHeight = useCssVar(lineHeightVar);
  const tracking = useCssVar(trackingVar);
  const weightKeyword = useCssVar(weightVar);

  const weight = normalizeFontWeight(weightKeyword || 400);

  return (
    <section
      className="p-5 rounded"
      style={{
        border:
          '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
        backgroundColor:
          'var(--sys-color-roles-surface-surface-container-sys-surface-container-lowest, #ffffff)',
      }}
    >
      <header className="flex items-baseline justify-between mb-3 gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold">{label}</h3>
          {emphasized && (
            <span
              className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded"
              style={{
                backgroundColor:
                  'var(--sys-color-roles-accent-primary-sys-primary-container, #070f36)',
                color:
                  'var(--sys-color-roles-accent-primary-sys-on-primary-container, #ffffff)',
              }}
            >
              Emphasized
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <CopyChip value={`sys.typeScale.${role}`} label={`sys.typeScale.${role}`} />
        </div>
      </header>

      <p
        style={{
          fontFamily: UI_FONT_STACK,
          fontSize: toPx(fontSize),
          lineHeight: toPx(lineHeight),
          letterSpacing: tracking ? `${tracking}px` : undefined,
          fontWeight: weight,
          margin: 0,
          color:
            'var(--sys-color-roles-surface-surface-sys-on-surface, #1b1d22)',
        }}
      >
        {sample}
      </p>

      <dl
        className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-x-4 gap-y-1 text-xs"
        style={{
          color:
            'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
        }}
      >
        <Pair label="font-size" value={fontSize ? `${fontSize}px` : '—'} />
        <Pair label="line-height" value={lineHeight ? `${lineHeight}px` : '—'} />
        <Pair label="tracking" value={tracking || '0'} />
        <Pair label="weight" value={`${weightKeyword || 'regular'} (${weight})`} />
        <Pair label="family" value={'UI fallback stack'} />
      </dl>
    </section>
  );
}

function Pair({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <dt className="uppercase tracking-wider text-[10px] opacity-60">{label}</dt>
      <dd className="font-mono">{value}</dd>
    </div>
  );
}
