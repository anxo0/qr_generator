interface Props {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  className?: string;
}

/** Interruptor cuadrado, a juego con el resto de controles. */
export function Toggle({ label, checked, onChange, className = '' }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`group inline-flex items-center gap-2.5 text-left text-sm text-ink-2 transition-colors hover:text-ink ${className}`}
    >
      <span
        className={`relative inline-block h-5 w-9 shrink-0 border transition-colors duration-200 ${
          checked ? 'border-ink bg-ink' : 'border-line-strong bg-surface'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-3.5 w-3.5 transition-transform duration-200 ease-out-quart ${
            checked ? 'translate-x-4 bg-paper' : 'bg-ink-3 group-hover:bg-ink-2'
          }`}
        />
      </span>
      {label}
    </button>
  );
}
