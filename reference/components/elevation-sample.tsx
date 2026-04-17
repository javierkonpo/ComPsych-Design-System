'use client';

import { useCssVar } from '@/lib/utils';
import { CopyChip } from './copy-chip';

interface Props {
  level: number;
  label: string;
  usage: string;
}

/**
 * Renders an elevation sample card using the real sys elevation tokens.
 *
 * Each level exposes its drop-shadow as a set of sub-tokens
 * (`--sys-elevation-sys-level-N-shadow[-K]-{x,y,blur,spread,color}`) and a
 * surface-tint opacity. Level 0 has a single shadow; levels 1–5 have two
 * composited shadows. The card stitches those sub-tokens into a valid CSS
 * `box-shadow` string at render time so every elevation actually re-themes
 * when the active bundle changes.
 *
 * Surface tint (Material 3) is expressed as a secondary layer: the primary
 * color blended into the surface at the level's tint opacity. At level 0
 * the opacity is 0 so the tint is invisible.
 */
export function ElevationSample({ level, label, usage }: Props) {
  const shadow = useComposedShadow(level);
  const tintOpacity = useCssVar(
    `--sys-elevation-sys-level-${level}-sys-surface-tint-opacity`,
  );
  const surface = 'var(--sys-color-roles-surface-surface-container-sys-surface-container-lowest, #ffffff)';
  const primary = 'var(--sys-color-roles-accent-primary-sys-primary, #075cba)';

  // Blend primary into surface at the tint opacity. color-mix is supported
  // in every evergreen browser target the reference app ships.
  const tintedBackground = tintOpacity && Number(tintOpacity) > 0
    ? `color-mix(in srgb, ${surface} ${100 - Number(tintOpacity) * 100}%, ${primary})`
    : surface;

  return (
    <div className="flex flex-col gap-3">
      <div
        className="w-full h-28 rounded-lg flex items-center justify-center text-xs font-mono"
        style={{
          background: tintedBackground,
          boxShadow: shadow,
          color:
            'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
        }}
      >
        Level {level}
      </div>
      <div className="flex flex-col gap-1">
        <div className="ref-body font-medium">{label}</div>
        <div
          className="ref-body-sm"
          style={{
            color:
              'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
          }}
        >
          {usage}
        </div>
        <CopyChip block value={`sys.elevation.sysLevel${level}`} />
      </div>
    </div>
  );
}

/**
 * Reads the 5 primitives (x, y, blur, spread, color) for each shadow slot
 * exposed by the current theme and stitches them into a `box-shadow` string.
 * Level 0 has one slot (no suffix), levels 1–5 have two slots (`-1` and `-2`).
 */
function useComposedShadow(level: number): string {
  // The rules of hooks require a fixed call order, so we always read both
  // slots and drop the empty one. Level 0 has no numbered suffix; it lives at
  // `--sys-elevation-sys-level-0-shadow-*` (no slot number), so we read that
  // base-pathed variable too.
  const base = `--sys-elevation-sys-level-${level}-shadow`;

  const baseX = useCssVar(`${base}-x`);
  const baseY = useCssVar(`${base}-y`);
  const baseBlur = useCssVar(`${base}-blur`);
  const baseSpread = useCssVar(`${base}-spread`);
  const baseColor = useCssVar(`${base}-color`);

  const slot1X = useCssVar(`${base}-1-x`);
  const slot1Y = useCssVar(`${base}-1-y`);
  const slot1Blur = useCssVar(`${base}-1-blur`);
  const slot1Spread = useCssVar(`${base}-1-spread`);
  const slot1Color = useCssVar(`${base}-1-color`);

  const slot2X = useCssVar(`${base}-2-x`);
  const slot2Y = useCssVar(`${base}-2-y`);
  const slot2Blur = useCssVar(`${base}-2-blur`);
  const slot2Spread = useCssVar(`${base}-2-spread`);
  const slot2Color = useCssVar(`${base}-2-color`);

  const parts: string[] = [];
  const push = (x: string, y: string, blur: string, spread: string, color: string) => {
    if (!color) return;
    parts.push(
      `${numPx(x)} ${numPx(y)} ${numPx(blur)} ${numPx(spread)} ${color}`.trim(),
    );
  };

  push(baseX, baseY, baseBlur, baseSpread, baseColor);
  push(slot1X, slot1Y, slot1Blur, slot1Spread, slot1Color);
  push(slot2X, slot2Y, slot2Blur, slot2Spread, slot2Color);

  return parts.length > 0 ? parts.join(', ') : 'none';
}

function numPx(v: string): string {
  const trimmed = (v ?? '').trim();
  if (trimmed === '') return '0';
  if (/[a-z%]$/i.test(trimmed)) return trimmed;
  return `${trimmed}px`;
}
