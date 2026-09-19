/** Formas de los módulos de datos. */
export type ModuleShape = 'square' | 'rounded' | 'dots' | 'fluid' | 'classy' | 'diamond';
/** Forma del anillo exterior de los tres patrones de posición (finders). */
export type FinderShape = 'square' | 'rounded' | 'circle' | 'leaf';
/** Forma del punto interior de los finders. */
export type FinderDotShape = 'square' | 'rounded' | 'circle' | 'leaf' | 'diamond';
export type ECLevel = 'L' | 'M' | 'Q' | 'H';
export type FillMode = 'solid' | 'linear' | 'radial';

export interface Fill {
  mode: FillMode;
  color: string;
  color2: string;
  /** Ángulo del degradado lineal en grados. */
  angle: number;
}

export interface LogoOptions {
  /** Data URL de la imagen, o null si no hay logo. */
  src: string | null;
  /** Lado del logo como fracción del área de datos (0.1 – 0.35). */
  size: number;
  /** Margen alrededor del logo en módulos. */
  padding: number;
  /** Radio de las esquinas del logo como fracción de su lado (0 – 0.5). */
  radius: number;
  /** Eliminar los módulos que quedan debajo del logo. */
  knockout: boolean;
  /** Pintar un fondo del color del fondo del QR detrás del logo. */
  background: boolean;
}

export interface QrStyle {
  ec: ECLevel;
  moduleShape: ModuleShape;
  /** Tamaño de cada módulo respecto a su celda (0.5 – 1). Ignorado en «fluid» y «classy». */
  moduleScale: number;
  finderShape: FinderShape;
  finderDotShape: FinderDotShape;
  fill: Fill;
  /** Color de los finders; null = mismo relleno que los módulos. */
  finderColor: string | null;
  finderDotColor: string | null;
  background: { color: string; transparent: boolean };
  /** Zona de silencio en módulos. */
  margin: number;
  /** Radio de las esquinas exteriores como fracción del lado (0 – 0.3). */
  radius: number;
  logo: LogoOptions;
}

export interface QrMatrix {
  size: number;
  /** Fila mayor: `modules[y * size + x]` es 1 si el módulo está oscuro. */
  modules: Uint8Array;
  version: number;
}
