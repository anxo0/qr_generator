import { finderDotPath, finderRingPath, modulePath } from '@/lib/qr/shapes';
import type { FinderDotShape, FinderShape, ModuleShape } from '@/lib/qr';

// Patrón 5×5 (dentro de un viewBox 7×7) que enseña cómo se conectan los módulos.
const PATTERN = ['XXX.X', 'X...X', 'X.X..', '...XX', 'XX.X.'];

const on = (x: number, y: number) => y >= 0 && y < 5 && x >= 0 && x < 5 && PATTERN[y][x] === 'X';

export function modulePreview(shape: ModuleShape, scale: number): string {
  let d = '';
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      if (!on(x, y)) continue;
      d += modulePath(shape, x + 1, y + 1, scale, {
        top: on(x, y - 1),
        right: on(x + 1, y),
        bottom: on(x, y + 1),
        left: on(x - 1, y),
      });
    }
  }
  return d;
}

export function ModulePreview({ shape, scale }: { shape: ModuleShape; scale: number }) {
  return <path d={modulePreview(shape, scale)} />;
}

export function FinderPreview({ shape, dot = 'square' }: { shape: FinderShape; dot?: FinderDotShape }) {
  return (
    <>
      <path d={finderRingPath(shape, 0, 0)} fillRule="evenodd" />
      <path d={finderDotPath(dot, 0, 0)} />
    </>
  );
}

export function FinderDotPreview({ shape, ring = 'square' }: { shape: FinderDotShape; ring?: FinderShape }) {
  return (
    <>
      <path d={finderRingPath(ring, 0, 0)} fillRule="evenodd" opacity={0.35} />
      <path d={finderDotPath(shape, 0, 0)} />
    </>
  );
}
