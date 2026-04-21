'use client';

import {
  useState,
  type ComponentType,
  type ReactNode,
} from 'react';
import styles from './playground.module.css';

// ---------------------------------------------------------------------------
// Schema — describes one knob in the playground's controls panel. The
// playground reads the schema to (a) build the initial state, (b) render
// the right input widget, and (c) diff against defaults when generating
// the JSX code snippet.
// ---------------------------------------------------------------------------

export interface PlaygroundEnumControl {
  name: string;
  type: 'enum';
  options: readonly string[];
  defaultValue: string;
  label?: string;
}

export interface PlaygroundBooleanControl {
  name: string;
  type: 'boolean';
  defaultValue: boolean;
  label?: string;
}

export interface PlaygroundStringControl {
  name: string;
  type: 'string';
  defaultValue: string;
  placeholder?: string;
  label?: string;
}

export type PlaygroundControl =
  | PlaygroundEnumControl
  | PlaygroundBooleanControl
  | PlaygroundStringControl;

export interface PlaygroundProps {
  /**
   * The REAL component from `reference/components/ds/…`. The playground
   * never renders a reimplementation — what you see in the stage is the
   * same JSX an adopter would ship. Optional when `render` is provided.
   */
  component?: ComponentType<Record<string, unknown>>;
  /** One entry per prop you want to expose as a control. */
  controls: readonly PlaygroundControl[];
  /**
   * Props merged into the component in addition to the control-driven
   * values, but NOT exposed in the controls panel. Use for demo-only
   * glue (e.g. a `backgroundImage` for Card's image variant, or a
   * `leadingIcon` node).
   */
  staticProps?: Record<string, unknown>;
  /**
   * Optional function that returns children to render inside the
   * component. Receives the current live props in case the children
   * depend on them.
   */
  renderChildren?: (props: Record<string, unknown>) => ReactNode;
  /**
   * Advanced: full control over what renders in the stage. Receives the
   * current state map and a setter so the live component can round-trip
   * interactions back to the controls (e.g. clicking a Checkbox updates
   * the `selection` control). When provided, this takes precedence over
   * `component` + `renderChildren`.
   */
  render?: (
    values: Record<string, unknown>,
    setValue: (name: string, value: unknown) => void,
  ) => ReactNode;
}

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

export function Playground({
  component: Component,
  controls,
  staticProps = {},
  renderChildren,
  render,
}: PlaygroundProps) {
  const [values, setValues] = useState<Record<string, unknown>>(() =>
    buildInitialState(controls),
  );

  function setValue(name: string, value: unknown) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  const combinedProps = { ...staticProps, ...values };

  // Stage content: explicit render override > component + renderChildren.
  // Exactly one of `render` or `component` is expected.
  let stage: ReactNode = null;
  if (render) {
    stage = render(values, setValue);
  } else if (Component) {
    stage = (
      <Component {...combinedProps}>
        {renderChildren ? renderChildren(combinedProps) : undefined}
      </Component>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.main}>
        <div className={styles.stage}>{stage}</div>
        <div className={styles.controls}>
          {controls.map((c) => (
            <ControlRow
              key={c.name}
              control={c}
              value={values[c.name]}
              onChange={setValue}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildInitialState(
  controls: readonly PlaygroundControl[],
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const c of controls) {
    out[c.name] = c.defaultValue;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Control row — dispatches to the right widget per control type.
// ---------------------------------------------------------------------------

function ControlRow({
  control,
  value,
  onChange,
}: {
  control: PlaygroundControl;
  value: unknown;
  onChange: (name: string, value: unknown) => void;
}) {
  return (
    <div className={styles.controlRow}>
      <label className={styles.controlLabel}>
        {control.label ?? control.name}
      </label>
      <div className={styles.controlField}>
        {control.type === 'enum' && (
          <SegmentedControl
            options={control.options}
            value={String(value)}
            onChange={(v) => onChange(control.name, v)}
          />
        )}
        {control.type === 'boolean' && (
          <Switch
            checked={Boolean(value)}
            onChange={(v) => onChange(control.name, v)}
          />
        )}
        {control.type === 'string' && (
          <TextInput
            value={String(value ?? '')}
            placeholder={control.placeholder}
            onChange={(v) => onChange(control.name, v)}
          />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Widgets
// ---------------------------------------------------------------------------

function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div role="radiogroup" className={styles.segmented}>
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={active}
            className={`${styles.segment} ${active ? styles.segmentActive : ''}`}
            onClick={() => onChange(opt)}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function Switch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={`${styles.switch} ${checked ? styles.switchOn : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className={styles.switchThumb} aria-hidden />
    </button>
  );
}

function TextInput({
  value,
  placeholder,
  onChange,
}: {
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      type="text"
      className={styles.textInput}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
