/** Rasteriza un SVG (string) a un canvas cuadrado de `size` px. */
export async function svgToCanvas(svg: string, size: number, background?: string | null): Promise<HTMLCanvasElement> {
  const img = await loadSvg(svg);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas-unsupported');
  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, size, size);
  }
  ctx.drawImage(img, 0, 0, size, size);
  return canvas;
}

export async function svgToPngBlob(svg: string, size: number): Promise<Blob> {
  const canvas = await svgToCanvas(svg, size);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('png-failed'))), 'image/png');
  });
}

function loadSvg(svg: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('svg-load-failed'));
    };
    img.src = url;
  });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Damos tiempo al navegador a iniciar la descarga antes de liberar la URL.
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function downloadSvg(svg: string, filename: string): void {
  downloadBlob(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }), filename);
}

export async function copyPngToClipboard(svg: string, size: number): Promise<void> {
  if (!('ClipboardItem' in window)) throw new Error('clipboard-unsupported');
  // Safari exige que la promesa se pase directamente al ClipboardItem.
  const item = new ClipboardItem({ 'image/png': svgToPngBlob(svg, size) });
  await navigator.clipboard.write([item]);
}

export async function copyText(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}

/** Nombre de archivo seguro a partir del contenido del QR. */
export function suggestFilename(payload: string, ext: string): string {
  const base = payload
    .replace(/^[a-z]+:\/\//i, '')
    .replace(/^(WIFI|MAILTO|SMSTO|TEL|BEGIN):?/i, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 40);
  return `qr-${base || 'code'}.${ext}`;
}
