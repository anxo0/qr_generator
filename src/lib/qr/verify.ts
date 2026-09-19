import { svgToCanvas } from './export';

export type VerifyStatus = 'ok' | 'mismatch' | 'unreadable';

/**
 * Rasteriza el SVG y trata de decodificarlo con jsQR, igual que haría la
 * cámara de un móvil. Así detectamos combinaciones de estilo que rompen
 * la lectura (logo demasiado grande, poco contraste, formas agresivas…).
 */
export async function verifyReadable(svg: string, expected: string): Promise<VerifyStatus> {
  const { default: jsQR } = await import('jsqr');
  // Un decodificador es sensible a la escala; probamos dos tamaños como haría una cámara al acercarse.
  let status: VerifyStatus = 'unreadable';
  for (const size of [400, 720]) {
    const canvas = await svgToCanvas(svg, size, '#ffffff');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) continue;
    const { data, width, height } = ctx.getImageData(0, 0, size, size);
    const result = jsQR(data, width, height, { inversionAttempts: 'attemptBoth' });
    if (!result) continue;
    if (result.data === expected) return 'ok';
    status = 'mismatch';
  }
  return status;
}
