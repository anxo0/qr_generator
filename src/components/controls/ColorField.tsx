import { useEffect, useId, useState } from 'react';
import { swatches } from '@/lib/presets';

interface Props {
  label?: string;
  value: string;
  onChange: (hex: string) => void;
  className?: string;
}

const HEX = /^#?([0-9a-f]{6})$/i;

/** Muestra de color + selector nativo + campo hex + paleta rápida. */
export function ColorField({ label, value, onChange, className = '' }: Props) {
  const id = useId();
  const [text, setText] = useState(value);
  useEffect(() => setText(value), [value]);

  const commit = (raw: string) => {
    const m = HEX.exec(raw.trim());
    if (m) onChange(`#${m[1].toLowerCase()}`);
    else setText(value);
  };

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="label-mono mb-1.5 block">
          {label}
        </label>
      )}
      <div className="flex items-stretch hairline bg-surface">
        <span className="relative block w-11 shrink-0 border-r border-line">
          <span className="absolute inset-1.5" style={{ background: value }} />
          <input
            id={id}
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label={label}
          />
        </span>
        <input
          type="text"
          value={text}
          spellCheck={false}
          onChange={(e) => setText(e.target.value)}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && commit(text)}
          className="w-full min-w-0 bg-transparent px-3 py-2 font-mono text-sm uppercase focus:outline-none"
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {swatches.map((s) => (
          <button
            key={s}
            type="button"
            aria-label={s}
            title={s}
            onClick={() => onChange(s)}
            className={`h-4 w-4 rounded-sm border transition-transform hover:scale-110 ${
              s.toLowerCase() === value.toLowerCase() ? 'border-ink ring-1 ring-ink ring-offset-1 ring-offset-paper' : 'border-line'
            }`}
            style={{ background: s }}
          />
        ))}
      </div>
    </div>
  );
}
