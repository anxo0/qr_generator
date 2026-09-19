import { useId } from 'react';

interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  /** Texto que se muestra a la derecha (por defecto el valor). */
  format?: (v: number) => string;
  className?: string;
}

export function Slider({ label, value, min, max, step = 1, onChange, format, className = '' }: Props) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className={className}>
      <div className="mb-1 flex items-baseline justify-between">
        <label htmlFor={id} className="label-mono">
          {label}
        </label>
        <output htmlFor={id} className="font-mono text-xs tabular-nums text-ink">
          {format ? format(value) : value}
        </output>
      </div>
      <input
        id={id}
        type="range"
        className="range"
        style={{ '--pct': `${pct}%` } as React.CSSProperties}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
