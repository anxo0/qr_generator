import { describe, expect, it } from 'vitest';
import { buildPayload, defaultContent, type Content } from './content';

const c = (p: Partial<Content>): Content => ({ ...defaultContent, ...p });

describe('buildPayload', () => {
  it('añade https:// a las URL sin esquema y respeta las que lo tienen', () => {
    expect(buildPayload(c({ type: 'url', url: 'soyjulian.dev' }))).toBe('https://soyjulian.dev');
    expect(buildPayload(c({ type: 'url', url: 'http://a.b' }))).toBe('http://a.b');
    expect(buildPayload(c({ type: 'url', url: '  ' }))).toBe('');
  });

  it('escapa los caracteres reservados del formato WIFI', () => {
    const wifi = { ssid: 'Casa;2', password: 'a:b,c"d\\e', encryption: 'WPA' as const, hidden: true };
    expect(buildPayload(c({ type: 'wifi', wifi }))).toBe('WIFI:T:WPA;S:Casa\\;2;P:a\\:b\\,c\\"d\\\\e;H:true;;');
  });

  it('omite la contraseña en redes abiertas', () => {
    const wifi = { ssid: 'Bar', password: 'ignorada', encryption: 'nopass' as const, hidden: false };
    expect(buildPayload(c({ type: 'wifi', wifi }))).toBe('WIFI:T:nopass;S:Bar;;');
  });

  it('genera una vCard 3.0 mínima', () => {
    const vcard = { firstName: 'Julián', lastName: 'Montañez', org: '', title: '', phone: '+34 600', email: 'j@x.dev', url: '' };
    const out = buildPayload(c({ type: 'vcard', vcard }));
    expect(out.split('\n')).toEqual([
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:Montañez;Julián;;;',
      'FN:Julián Montañez',
      'TEL;TYPE=CELL:+34 600',
      'EMAIL:j@x.dev',
      'END:VCARD',
    ]);
  });

  it('codifica mailto con asunto y cuerpo', () => {
    const email = { to: 'a@b.c', subject: 'Hola qué tal', body: 'Línea 1' };
    expect(buildPayload(c({ type: 'email', email }))).toBe('mailto:a@b.c?subject=Hola%20qu%C3%A9%20tal&body=L%C3%ADnea%201');
  });

  it('normaliza el teléfono', () => {
    expect(buildPayload(c({ type: 'phone', phone: { number: ' +34 600 11 22 ' } }))).toBe('tel:+346001122');
  });
});
