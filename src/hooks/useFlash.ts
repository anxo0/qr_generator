import { useCallback, useEffect, useRef, useState } from 'react';

/** Mensaje efímero (p. ej. «Copiado») que desaparece solo. */
export function useFlash(ms = 2200): [string | null, (msg: string) => void] {
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const flash = useCallback(
    (m: string) => {
      setMsg(m);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setMsg(null), ms);
    },
    [ms],
  );
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return [msg, flash];
}
