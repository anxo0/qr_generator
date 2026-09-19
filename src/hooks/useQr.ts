import { useEffect, useMemo, useState } from 'react';
import { encode, renderSvg, verifyReadable, type QrMatrix, type QrStyle, type VerifyStatus } from '@/lib/qr';

export interface QrResult {
  matrix: QrMatrix | null;
  svg: string;
  side: number;
  knockedOut: number;
  /** `too-long` si el contenido no cabe ni en la versión 40. */
  error: 'too-long' | null;
}

export function useQr(payload: string, style: QrStyle): QrResult {
  // La codificación solo depende del texto y del nivel de corrección.
  const matrix = useMemo(() => {
    try {
      return encode(payload, style.ec);
    } catch {
      return null;
    }
  }, [payload, style.ec]);

  return useMemo(() => {
    if (!matrix) return { matrix: null, svg: '', side: 0, knockedOut: 0, error: 'too-long' as const };
    const r = renderSvg(matrix, style);
    return { matrix, ...r, error: null };
  }, [matrix, style]);
}

export type LiveStatus = VerifyStatus | 'checking' | 'idle';

/** Comprueba, con un pequeño retardo, que el SVG actual se decodifica al contenido esperado. */
export function useVerify(svg: string, expected: string, enabled: boolean): LiveStatus {
  const [status, setStatus] = useState<LiveStatus>('idle');

  useEffect(() => {
    if (!enabled || !svg) {
      setStatus('idle');
      return;
    }
    let cancelled = false;
    setStatus('checking');
    const timer = setTimeout(async () => {
      try {
        const result = await verifyReadable(svg, expected);
        if (!cancelled) setStatus(result);
      } catch {
        if (!cancelled) setStatus('unreadable');
      }
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [svg, expected, enabled]);

  return status;
}
