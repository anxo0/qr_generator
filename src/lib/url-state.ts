import type { Content } from './content';
import type { QrStyle } from './qr';

export interface SharedState {
  content: Content;
  style: QrStyle;
}

/** Los logos grandes no caben en una URL; por encima de este tamaño no se comparten. */
export const MAX_LOGO_CHARS = 6000;

function toBase64Url(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(s: string): string {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeState(state: SharedState): string {
  const logo = state.style.logo;
  const shareable: SharedState = {
    ...state,
    style: {
      ...state.style,
      logo: { ...logo, src: logo.src && logo.src.length <= MAX_LOGO_CHARS ? logo.src : null },
    },
  };
  return toBase64Url(JSON.stringify(shareable));
}

export function decodeState(hash: string): Partial<SharedState> | null {
  const match = /(?:^|[#&])c=([^&]+)/.exec(hash);
  if (!match) return null;
  try {
    const parsed = JSON.parse(fromBase64Url(match[1]));
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed as Partial<SharedState>;
  } catch {
    return null;
  }
}

export function shareUrl(state: SharedState): string {
  const url = new URL(window.location.href);
  url.hash = `c=${encodeState(state)}`;
  return url.toString();
}
