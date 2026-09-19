import { describe, expect, it } from 'vitest';
import { encode, isFinder } from './matrix';
import { renderSvg } from './render';
import { defaultStyle } from '../presets';

const matrix = encode('https://soyjulian.dev', 'M');

describe('encode', () => {
  it('devuelve una matriz cuadrada con los tres finders oscuros', () => {
    expect(matrix.modules.length).toBe(matrix.size * matrix.size);
    // Esquina superior izquierda del finder siempre es oscura
    expect(matrix.modules[0]).toBe(1);
    expect(isFinder(matrix.size, 0, 0)).toBe(true);
    expect(isFinder(matrix.size, 8, 8)).toBe(false);
  });
});

describe('renderSvg', () => {
  it('produce un SVG con viewBox = módulos + margen', () => {
    const { svg, side } = renderSvg(matrix, { ...defaultStyle, margin: 3 });
    expect(side).toBe(matrix.size + 6);
    expect(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"')).toBe(true);
    expect(svg).toContain(`viewBox="0 0 ${side} ${side}"`);
  });

  it('omite el fondo cuando es transparente', () => {
    const opaque = renderSvg(matrix, defaultStyle).svg;
    const transparent = renderSvg(matrix, { ...defaultStyle, background: { color: '#fff', transparent: true } }).svg;
    expect(opaque).toContain('<rect width=');
    expect(transparent).not.toContain('<rect width=');
  });

  it('usa un degradado cuando el relleno no es sólido', () => {
    const { svg } = renderSvg(matrix, { ...defaultStyle, fill: { ...defaultStyle.fill, mode: 'linear' } });
    expect(svg).toContain('<linearGradient id="qr-fill"');
    expect(svg).toContain('fill="url(#qr-fill)"');
  });

  it('vacía módulos bajo el logo y los incrusta como data URL', () => {
    const logo = { ...defaultStyle.logo, src: 'data:image/png;base64,AAAA', size: 0.25 };
    const withLogo = renderSvg(matrix, { ...defaultStyle, logo });
    expect(withLogo.knockedOut).toBeGreaterThan(0);
    expect(withLogo.svg).toContain('<image href="data:image/png;base64,AAAA"');
    expect(withLogo.svg).toContain('clip-path="url(#qr-logo-clip)"');

    const noKnockout = renderSvg(matrix, { ...defaultStyle, logo: { ...logo, knockout: false } });
    expect(noKnockout.knockedOut).toBe(0);
  });

  it('añade width/height cuando se pide un tamaño fijo', () => {
    expect(renderSvg(matrix, defaultStyle, { width: 1024 }).svg).toContain('width="1024" height="1024"');
  });

  it('todas las formas de módulo generan un path no vacío', () => {
    for (const moduleShape of ['square', 'rounded', 'dots', 'fluid', 'classy', 'diamond'] as const) {
      const { svg } = renderSvg(matrix, { ...defaultStyle, moduleShape });
      expect(svg).toMatch(/<path d="M[^"]{100,}" fill="#141416"\/>/);
    }
  });
});
