import { describe, expect, it } from 'vitest';
import { defaultContent } from './content';
import { defaultStyle } from './presets';
import { decodeState, encodeState, MAX_LOGO_CHARS } from './url-state';

describe('url-state', () => {
  it('codifica y decodifica el estado de forma simétrica', () => {
    const state = { content: { ...defaultContent, url: 'https://ejemplo.com/ñ?x=1&y=2' }, style: { ...defaultStyle, radius: 0.12 } };
    const decoded = decodeState(`#c=${encodeState(state)}`);
    expect(decoded).toEqual(state);
  });

  it('descarta los logos demasiado grandes para la URL', () => {
    const src = `data:image/png;base64,${'A'.repeat(MAX_LOGO_CHARS + 1)}`;
    const state = { content: defaultContent, style: { ...defaultStyle, logo: { ...defaultStyle.logo, src } } };
    expect(decodeState(`#c=${encodeState(state)}`)?.style?.logo.src).toBeNull();
  });

  it('devuelve null con un hash inválido', () => {
    expect(decodeState('#c=%%%')).toBeNull();
    expect(decodeState('')).toBeNull();
  });
});
