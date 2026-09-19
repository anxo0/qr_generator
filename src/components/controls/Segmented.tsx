import type { ReactNode } from 'react';

export interface SegmentedOption<T extends string> {
  value: T;
  label: ReactNode;
  title?: string;
}

interface Props<T extends string> {
  value: T;
  options: SegmentedOption<T>[];
  onChange: (v: T) => void;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

/** Botonera de opciones excluyentes con borde fino y selección en tinta. */
export function Segmented<T extends string>({ value, options, onChange, label, size = 'md', className = '' }: Props<T>) {
  return (
    <div className={className}>
      {label && <span className="label-mono mb-1.5 block">{label}</span>}
      <div role="radiogroup" aria-label={label} className="inline-flex max-w-full flex-wrap hairline bg-surface">
        {options.map((o, i) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={active}
              title={o.title}
              onClick={() => onChange(o.value)}
              className={[
                'inline-flex items-center gap-1.5 whitespace-nowrap transition-colors duration-150',
                size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2 text-sm',
                i > 0 ? 'border-l border-line' : '',
                active ? 'bg-ink text-paper' : 'text-ink-2 hover:bg-surface-2 hover:text-ink',
              ].join(' ')}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
