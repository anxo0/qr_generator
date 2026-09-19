import { isDark, isFinder } from './matrix';
import { finderDotPath, finderRingPath, modulePath, roundedRectPath } from './shapes';
import type { QrMatrix, QrStyle } from './types';

export interface RenderOptions {
  /** Ancho/alto en píxeles del atributo `width`/`height`. Sin él, el SVG es fluido. */
  width?: number;
  /** Fuerza un fondo opaco (lo usa la verificación de lectura). */
  forceBackground?: string;
}

export interface RenderResult {
  svg: string;
  /** Módulos totales por lado, incluida la zona de silencio. */
  side: number;
  /** Módulos eliminados por el logo. */
  knockedOut: number;
}

const fmt = (n: number) => +n.toFixed(3);

/**
 * Convierte una matriz de módulos en un SVG con el estilo indicado.
 * El sistema de coordenadas es 1 unidad = 1 módulo; el viewBox mide `side × side`.
 */
export function renderSvg(matrix: QrMatrix, style: QrStyle, opts: RenderOptions = {}): RenderResult {
  const count = matrix.size;
  const m = style.margin;
  const side = count + 2 * m;

  // Área que ocupa el logo (con su margen) en coordenadas de módulo.
  const logo = style.logo.src ? logoBox(count, side, style) : null;
  const knocked = new Uint8Array(count * count);
  let knockedOut = 0;
  if (logo && style.logo.knockout) {
    for (let y = 0; y < count; y++) {
      for (let x = 0; x < count; x++) {
        const cx = x + m;
        const cy = y + m;
        // Se elimina cualquier celda que toque la zona reservada.
        if (cx < logo.hi && cx + 1 > logo.lo && cy < logo.hi && cy + 1 > logo.lo) {
          knocked[y * count + x] = 1;
          if (isDark(matrix, x, y) && !isFinder(count, x, y)) knockedOut++;
        }
      }
    }
  }

  const dark = (x: number, y: number) =>
    isDark(matrix, x, y) && !isFinder(count, x, y) && knocked[y * count + x] !== 1;

  // Módulos de datos: un único path para que el SVG sea ligero.
  const parts: string[] = [];
  for (let y = 0; y < count; y++) {
    for (let x = 0; x < count; x++) {
      if (!dark(x, y)) continue;
      parts.push(
        modulePath(style.moduleShape, x + m, y + m, style.moduleScale, {
          top: dark(x, y - 1),
          right: dark(x + 1, y),
          bottom: dark(x, y + 1),
          left: dark(x - 1, y),
        }),
      );
    }
  }

  const finders: Array<[number, number]> = [
    [m, m],
    [m + count - 7, m],
    [m, m + count - 7],
  ];
  const rings = finders.map(([x, y]) => finderRingPath(style.finderShape, x, y)).join('');
  const dots = finders.map(([x, y]) => finderDotPath(style.finderDotShape, x, y)).join('');

  const useGradient = style.fill.mode !== 'solid';
  const moduleFill = useGradient ? 'url(#qr-fill)' : style.fill.color;
  const finderFill = style.finderColor ?? moduleFill;
  const finderDotFill = style.finderDotColor ?? finderFill;

  const defs: string[] = [];
  if (useGradient) defs.push(gradientDef(style, side));
  if (logo) {
    const r = logo.imgSide * style.logo.radius;
    defs.push(
      `<clipPath id="qr-logo-clip">${rectEl(logo.imgLo, logo.imgLo, logo.imgSide, logo.imgSide, r)}</clipPath>`,
    );
  }

  const bgColor = opts.forceBackground ?? (style.background.transparent ? null : style.background.color);
  const outerRadius = side * style.radius;

  const body: string[] = [];
  if (bgColor) body.push(`<rect width="${side}" height="${side}" rx="${fmt(outerRadius)}" fill="${bgColor}"/>`);
  body.push(`<path d="${parts.join('')}" fill="${moduleFill}"/>`);
  body.push(`<path d="${rings}" fill="${finderFill}" fill-rule="evenodd"/>`);
  body.push(`<path d="${dots}" fill="${finderDotFill}"/>`);
  if (logo) {
    if (style.logo.background) {
      const bg = style.background.transparent ? '#ffffff' : style.background.color;
      const pad = style.logo.padding;
      const r = (logo.imgSide + 2 * pad) * style.logo.radius;
      body.push(
        `<path d="${roundedRectPath(logo.lo, logo.lo, logo.hi - logo.lo, logo.hi - logo.lo, [r, r, r, r])}" fill="${bg}"/>`,
      );
    }
    body.push(
      `<image href="${style.logo.src}" x="${fmt(logo.imgLo)}" y="${fmt(logo.imgLo)}" width="${fmt(logo.imgSide)}" height="${fmt(logo.imgSide)}" preserveAspectRatio="xMidYMid meet" clip-path="url(#qr-logo-clip)"/>`,
    );
  }

  const sizeAttrs = opts.width ? ` width="${opts.width}" height="${opts.width}"` : '';
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${side} ${side}"${sizeAttrs} shape-rendering="geometricPrecision">` +
    (defs.length ? `<defs>${defs.join('')}</defs>` : '') +
    body.join('') +
    '</svg>';

  return { svg, side, knockedOut };
}

interface LogoBox {
  /** Límites de la zona reservada (logo + padding). */
  lo: number;
  hi: number;
  /** Posición y lado de la imagen. */
  imgLo: number;
  imgSide: number;
}

function logoBox(count: number, side: number, style: QrStyle): LogoBox {
  const imgSide = count * style.logo.size;
  const center = side / 2;
  const half = imgSide / 2 + style.logo.padding;
  return {
    lo: center - half,
    hi: center + half,
    imgLo: center - imgSide / 2,
    imgSide,
  };
}

function gradientDef(style: QrStyle, side: number): string {
  const { mode, color, color2, angle } = style.fill;
  const stops = `<stop offset="0" stop-color="${color}"/><stop offset="1" stop-color="${color2}"/>`;
  if (mode === 'radial') {
    return `<radialGradient id="qr-fill" gradientUnits="userSpaceOnUse" cx="${side / 2}" cy="${side / 2}" r="${fmt(side * 0.7)}">${stops}</radialGradient>`;
  }
  const rad = (angle * Math.PI) / 180;
  const c = side / 2;
  const dx = (Math.cos(rad) * side) / 2;
  const dy = (Math.sin(rad) * side) / 2;
  return `<linearGradient id="qr-fill" gradientUnits="userSpaceOnUse" x1="${fmt(c - dx)}" y1="${fmt(c - dy)}" x2="${fmt(c + dx)}" y2="${fmt(c + dy)}">${stops}</linearGradient>`;
}

function rectEl(x: number, y: number, w: number, h: number, r: number): string {
  return `<rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}" rx="${fmt(r)}"/>`;
}
