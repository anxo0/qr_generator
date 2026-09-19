import type { QrStyle } from './qr';

export const INK = '#141416';
export const PAPER = '#ffffff';

export const defaultStyle: QrStyle = {
  ec: 'M',
  moduleShape: 'square',
  moduleScale: 1,
  finderShape: 'square',
  finderDotShape: 'square',
  fill: { mode: 'solid', color: INK, color2: '#e8471c', angle: 45 },
  finderColor: null,
  finderDotColor: null,
  background: { color: PAPER, transparent: false },
  margin: 2,
  radius: 0,
  logo: { src: null, size: 0.22, padding: 1, radius: 0.2, knockout: true, background: true },
};

export interface StylePreset {
  id: string;
  /** Sobrescribe solo lo que cambia respecto al estilo actual. */
  patch: Partial<QrStyle>;
}

/** Presets rápidos. Nombres en i18n bajo `preset.<id>`. */
export const stylePresets: StylePreset[] = [
  {
    id: 'ink',
    patch: {
      moduleShape: 'square',
      moduleScale: 1,
      finderShape: 'square',
      finderDotShape: 'square',
      fill: { mode: 'solid', color: INK, color2: INK, angle: 45 },
      finderColor: null,
      finderDotColor: null,
      background: { color: PAPER, transparent: false },
      radius: 0,
    },
  },
  {
    id: 'riso',
    patch: {
      moduleShape: 'fluid',
      finderShape: 'circle',
      finderDotShape: 'circle',
      fill: { mode: 'solid', color: '#e8471c', color2: '#e8471c', angle: 45 },
      finderColor: INK,
      finderDotColor: '#e8471c',
      background: { color: '#f4efe4', transparent: false },
      radius: 0.06,
    },
  },
  {
    id: 'soft',
    patch: {
      moduleShape: 'rounded',
      moduleScale: 0.85,
      finderShape: 'rounded',
      finderDotShape: 'rounded',
      fill: { mode: 'solid', color: '#2b2f3a', color2: '#2b2f3a', angle: 45 },
      finderColor: null,
      finderDotColor: null,
      background: { color: '#f1f3f7', transparent: false },
      radius: 0.08,
    },
  },
  {
    id: 'dots',
    patch: {
      moduleShape: 'dots',
      moduleScale: 0.8,
      finderShape: 'circle',
      finderDotShape: 'circle',
      fill: { mode: 'solid', color: INK, color2: INK, angle: 45 },
      finderColor: null,
      finderDotColor: null,
      background: { color: PAPER, transparent: false },
      radius: 0,
    },
  },
  {
    id: 'ocean',
    patch: {
      moduleShape: 'fluid',
      finderShape: 'rounded',
      finderDotShape: 'rounded',
      fill: { mode: 'linear', color: '#0b3d91', color2: '#00a6a6', angle: 135 },
      finderColor: null,
      finderDotColor: null,
      background: { color: PAPER, transparent: false },
      radius: 0.06,
    },
  },
  {
    id: 'sunset',
    patch: {
      moduleShape: 'classy',
      finderShape: 'leaf',
      finderDotShape: 'leaf',
      fill: { mode: 'radial', color: '#ff8a00', color2: '#c2185b', angle: 45 },
      finderColor: null,
      finderDotColor: null,
      background: { color: '#fff7ed', transparent: false },
      radius: 0.1,
    },
  },
  {
    id: 'forest',
    patch: {
      moduleShape: 'rounded',
      moduleScale: 0.9,
      finderShape: 'leaf',
      finderDotShape: 'circle',
      fill: { mode: 'solid', color: '#1d4d34', color2: '#1d4d34', angle: 45 },
      finderColor: '#1d4d34',
      finderDotColor: '#7cb342',
      background: { color: '#f3f6ee', transparent: false },
      radius: 0.06,
    },
  },
  {
    id: 'inverted',
    patch: {
      moduleShape: 'fluid',
      finderShape: 'rounded',
      finderDotShape: 'rounded',
      fill: { mode: 'solid', color: '#f5f1e8', color2: '#f5f1e8', angle: 45 },
      finderColor: null,
      finderDotColor: '#e8471c',
      background: { color: INK, transparent: false },
      radius: 0.08,
    },
  },
];

/** Paleta rápida de colores para los selectores. */
export const swatches = [
  INK,
  '#2b2f3a',
  '#e8471c',
  '#c2185b',
  '#0b3d91',
  '#00a6a6',
  '#1d4d34',
  '#7cb342',
  '#ff8a00',
  '#6a4c93',
  '#8d6e63',
  '#ffffff',
];
