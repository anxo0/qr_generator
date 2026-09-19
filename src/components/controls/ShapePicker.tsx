import type { ReactNode } from 'react';

export interface ShapeOption<T extends string> {
  value: T;
  label: string;
  /** Vista previa de la forma, dibujada dentro de un viewBox 0 0 7 7. */
  preview: ReactNode;
  viewBox?: string;
}

interface Props<T extends string> {
  label: string;
  value: T;
  options: ShapeOption<T>[];
  onChange: (v: T) => void;
}

/** Rejilla de formas: cada opción muestra cómo queda dibujada de verdad. */
export function ShapePicker<T extends string>({ label, value, options, onChange }: Props<T>) {
  return (
    <div>
      <span className="label-mono mb-1.5 block">{label}</span>
      <div role="radiogroup" aria-label={label} className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(o.value)}
              className={[
                'group flex flex-col items-center gap-1.5 border px-2 pt-2.5 pb-2 transition-colors duration-150',
                active ? 'border-ink bg-surface-2' : 'border-line bg-surface hover:border-line-strong hover:bg-surface-2',
              ].join(' ')}
            >
              <svg viewBox={o.viewBox ?? "0 0 7 7"} className={`h-9 w-9 ${active ? 'text-ink' : 'text-ink-2 group-hover:text-ink'}`} fill="currentColor">
                {o.preview}
              </svg>
              <span className={`text-[11px] ${active ? 'text-ink' : 'text-ink-3'}`}>{o.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
