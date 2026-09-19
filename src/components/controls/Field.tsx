import { useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';

interface BaseProps {
  label: string;
  hint?: string;
  className?: string;
}

type InputProps = BaseProps & { as?: 'input' } & Omit<InputHTMLAttributes<HTMLInputElement>, 'className'>;
type TextareaProps = BaseProps & { as: 'textarea' } & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'>;

const base =
  'w-full bg-surface px-3 py-2.5 text-[15px] text-ink placeholder:text-ink-3/70 hairline transition-[border-color,background-color] duration-150 hover:bg-surface-2 focus:border-ink focus:bg-surface-2 focus:outline-none disabled:opacity-50';

/** Campo de texto con etiqueta en mono. */
export function Field(props: InputProps | TextareaProps) {
  const id = useId();
  const { label, hint, className = '' } = props;
  return (
    <label htmlFor={id} className={`block ${className}`}>
      <span className="label-mono mb-1.5 block">{label}</span>
      {props.as === 'textarea' ? (
        <textarea id={id} rows={3} {...omit(props)} className={`${base} resize-y`} />
      ) : (
        <input id={id} type="text" {...omit(props)} className={base} />
      )}
      {hint && <span className="mt-1.5 block text-xs text-ink-3">{hint}</span>}
    </label>
  );
}

function omit<T extends BaseProps & { as?: string }>(p: T) {
  const { label: _l, hint: _h, className: _c, as: _a, ...rest } = p;
  return rest;
}
