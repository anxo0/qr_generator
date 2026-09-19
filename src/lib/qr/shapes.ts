import type { FinderDotShape, FinderShape, ModuleShape } from './types';

const f = (n: number) => +n.toFixed(3);

/** Rectángulo con radios independientes por esquina (tl, tr, br, bl). */
export function roundedRectPath(
  x: number,
  y: number,
  w: number,
  h: number,
  radii: [number, number, number, number],
): string {
  const [tl, tr, br, bl] = radii.map((v) => Math.max(0, Math.min(v, w / 2, h / 2)));
  return [
    `M${f(x + tl)} ${f(y)}`,
    `H${f(x + w - tr)}`,
    tr ? `A${f(tr)} ${f(tr)} 0 0 1 ${f(x + w)} ${f(y + tr)}` : '',
    `V${f(y + h - br)}`,
    br ? `A${f(br)} ${f(br)} 0 0 1 ${f(x + w - br)} ${f(y + h)}` : '',
    `H${f(x + bl)}`,
    bl ? `A${f(bl)} ${f(bl)} 0 0 1 ${f(x)} ${f(y + h - bl)}` : '',
    `V${f(y + tl)}`,
    tl ? `A${f(tl)} ${f(tl)} 0 0 1 ${f(x + tl)} ${f(y)}` : '',
    'Z',
  ].join('');
}

export function circlePath(cx: number, cy: number, r: number): string {
  return `M${f(cx - r)} ${f(cy)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`;
}

export function diamondPath(cx: number, cy: number, half: number): string {
  return `M${f(cx)} ${f(cy - half)}L${f(cx + half)} ${f(cy)}L${f(cx)} ${f(cy + half)}L${f(cx - half)} ${f(cy)}Z`;
}

export interface Neighbors {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
}

/**
 * Trazado de un módulo de datos en la celda (x, y) de lado 1.
 * `scale` reduce el módulo dentro de su celda; `n` son los vecinos oscuros
 * (necesarios para las formas conectadas).
 */
export function modulePath(shape: ModuleShape, x: number, y: number, scale: number, n: Neighbors): string {
  const s = Math.max(0.3, Math.min(1, scale));
  const o = (1 - s) / 2;
  switch (shape) {
    case 'square':
      return `M${f(x + o)} ${f(y + o)}h${f(s)}v${f(s)}h${f(-s)}Z`;
    case 'rounded':
      return roundedRectPath(x + o, y + o, s, s, [s * 0.32, s * 0.32, s * 0.32, s * 0.32]);
    case 'dots':
      return circlePath(x + 0.5, y + 0.5, s / 2);
    case 'diamond':
      // Ligeramente mayor que la celda: los rombos vecinos se solapan y los patrones
      // de tiempo/alineación siguen siendo tramos continuos para el lector.
      return diamondPath(x + 0.5, y + 0.5, (s / 2) * 1.3);
    case 'classy':
      return roundedRectPath(x, y, 1, 1, [0.5, 0, 0.5, 0]);
    case 'fluid': {
      // Redondea solo las esquinas cuyos dos vecinos ortogonales están vacíos:
      // el resultado son tramos continuos con extremos en forma de píldora.
      const r = 0.5;
      return roundedRectPath(x, y, 1, 1, [
        !n.top && !n.left ? r : 0,
        !n.top && !n.right ? r : 0,
        !n.bottom && !n.right ? r : 0,
        !n.bottom && !n.left ? r : 0,
      ]);
    }
  }
}

/**
 * Anillo exterior de un finder (7×7 con hueco 5×5) en la esquina (x, y).
 * Se dibuja como un único path con `fill-rule: evenodd`.
 */
export function finderRingPath(shape: FinderShape, x: number, y: number): string {
  return finderOuter(shape, x, y, 7) + finderOuter(shape, x + 1, y + 1, 5);
}

function finderOuter(shape: FinderShape, x: number, y: number, size: number): string {
  switch (shape) {
    case 'square':
      return `M${f(x)} ${f(y)}h${size}v${size}h${-size}Z`;
    case 'rounded': {
      const r = size * 0.3;
      return roundedRectPath(x, y, size, size, [r, r, r, r]);
    }
    case 'circle':
      return circlePath(x + size / 2, y + size / 2, size / 2);
    case 'leaf': {
      const r = size / 2;
      return roundedRectPath(x, y, size, size, [r, 0, r, 0]);
    }
  }
}

/** Punto central del finder (3×3) situado en la esquina (x, y) del finder. */
export function finderDotPath(shape: FinderDotShape, x: number, y: number): string {
  const dx = x + 2;
  const dy = y + 2;
  switch (shape) {
    case 'square':
      return `M${f(dx)} ${f(dy)}h3v3h-3Z`;
    case 'rounded':
      return roundedRectPath(dx, dy, 3, 3, [0.9, 0.9, 0.9, 0.9]);
    case 'circle':
      return circlePath(dx + 1.5, dy + 1.5, 1.5);
    case 'leaf':
      return roundedRectPath(dx, dy, 3, 3, [1.5, 0, 1.5, 0]);
    case 'diamond':
      return diamondPath(dx + 1.5, dy + 1.5, 1.6);
  }
}
