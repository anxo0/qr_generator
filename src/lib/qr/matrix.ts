import QRCode from 'qrcode';
import type { ECLevel, QrMatrix } from './types';

/**
 * Codifica `text` y devuelve la matriz de módulos. Delegamos la codificación
 * (Reed-Solomon, enmascarado, versión) en `qrcode`; el dibujo lo hacemos nosotros.
 */
export function encode(text: string, ec: ECLevel): QrMatrix {
  const qr = QRCode.create(text || ' ', { errorCorrectionLevel: ec });
  const size = qr.modules.size;
  const modules = new Uint8Array(size * size);
  for (let i = 0; i < size * size; i++) modules[i] = qr.modules.data[i] ? 1 : 0;
  return { size, modules, version: qr.version };
}

export function isDark(m: QrMatrix, x: number, y: number): boolean {
  if (x < 0 || y < 0 || x >= m.size || y >= m.size) return false;
  return m.modules[y * m.size + x] === 1;
}

/** ¿Pertenece la celda a uno de los tres patrones de posición (7×7)? */
export function isFinder(size: number, x: number, y: number): boolean {
  return (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7);
}

/** Porcentaje de daño que tolera cada nivel de corrección de errores. */
export const EC_RECOVERY: Record<ECLevel, string> = { L: '7%', M: '15%', Q: '25%', H: '30%' };
