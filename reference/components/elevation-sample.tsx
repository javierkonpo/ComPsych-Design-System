'use client';

interface Props {
  level: number;
  label: string;
  usage: string;
  shadow?: string; // optional fallback shadow for illustration
}

/**
 * Elevation sample card. Currently renders illustrative shadows because
 * `sys.elevation.*` tokens are NOT yet exposed in the system tier — the
 * Brand tier has `Elevation.lv1`–`lv5` as DTCG `boxShadow` composites, but
 * no Sys role references them. When Figma adds those roles, this component
 * should be rewritten to consume `var(--sys-elevation-*)` instead of the
 * hardcoded illustrative value.
 */
export function ElevationSample({ level, label, usage, shadow }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className="w-full h-28 rounded flex items-center justify-center text-xs font-mono"
        style={{
          backgroundColor:
            'var(--sys-color-roles-surface-surface-container-sys-surface-container-lowest, #ffffff)',
          boxShadow: shadow ?? 'none',
        }}
      >
        Level {level}
      </div>
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div
          className="text-xs mt-0.5"
          style={{
            color:
              'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
          }}
        >
          {usage}
        </div>
      </div>
    </div>
  );
}
