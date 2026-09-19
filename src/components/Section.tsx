import type { ReactNode } from 'react';

interface Props {
  index: string;
  title: string;
  icon?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
}

/** Bloque numerado del panel de controles. */
export function Section({ index, title, icon, aside, children }: Props) {
  return (
    <section className="hairline-b py-7 first:pt-0 last:border-b-0">
      <header className="mb-5 flex items-center gap-3">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line-strong text-[11px] font-medium tabular-nums text-ink-2">{index}</span>
        <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">
          {icon && <span className="text-ink-2">{icon}</span>}
          {title}
        </h2>
        {aside && <div className="ml-auto">{aside}</div>}
      </header>
      <div className="space-y-5">{children}</div>
    </section>
  );
}
