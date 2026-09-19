export type ContentType = 'url' | 'text' | 'wifi' | 'vcard' | 'email' | 'sms' | 'phone';

export const CONTENT_TYPES: ContentType[] = ['url', 'text', 'wifi', 'vcard', 'email', 'sms', 'phone'];

export interface Content {
  type: ContentType;
  url: string;
  text: string;
  wifi: { ssid: string; password: string; encryption: 'WPA' | 'WEP' | 'nopass'; hidden: boolean };
  vcard: { firstName: string; lastName: string; org: string; title: string; phone: string; email: string; url: string };
  email: { to: string; subject: string; body: string };
  sms: { phone: string; message: string };
  phone: { number: string };
}

export const defaultContent: Content = {
  type: 'url',
  url: 'https://soyjulian.dev',
  text: '',
  wifi: { ssid: '', password: '', encryption: 'WPA', hidden: false },
  vcard: { firstName: '', lastName: '', org: '', title: '', phone: '', email: '', url: '' },
  email: { to: '', subject: '', body: '' },
  sms: { phone: '', message: '' },
  phone: { number: '' },
};

/** Escapa los caracteres reservados del formato WIFI: (`\`, `;`, `,`, `:` y `"`). */
const wifiEscape = (s: string) => s.replace(/([\\;,:"])/g, '\\$1');
/** Escapa los caracteres reservados de vCard 3.0. */
const vcardEscape = (s: string) => s.replace(/([\\;,])/g, '\\$1').replace(/\n/g, '\\n');
const clean = (s: string) => s.trim();

/** Construye el texto que se codifica en el QR a partir del formulario. */
export function buildPayload(c: Content): string {
  switch (c.type) {
    case 'url': {
      const u = clean(c.url);
      if (!u) return '';
      return /^[a-z][a-z0-9+.-]*:/i.test(u) ? u : `https://${u}`;
    }
    case 'text':
      return c.text;
    case 'wifi': {
      const { ssid, password, encryption, hidden } = c.wifi;
      if (!ssid) return '';
      const parts = [`T:${encryption}`, `S:${wifiEscape(ssid)}`];
      if (encryption !== 'nopass' && password) parts.push(`P:${wifiEscape(password)}`);
      if (hidden) parts.push('H:true');
      return `WIFI:${parts.join(';')};;`;
    }
    case 'vcard': {
      const v = c.vcard;
      const fn = [v.firstName, v.lastName].map(clean).filter(Boolean).join(' ');
      if (!fn && !v.org) return '';
      const lines = ['BEGIN:VCARD', 'VERSION:3.0'];
      lines.push(`N:${vcardEscape(clean(v.lastName))};${vcardEscape(clean(v.firstName))};;;`);
      lines.push(`FN:${vcardEscape(fn || clean(v.org))}`);
      if (v.org) lines.push(`ORG:${vcardEscape(clean(v.org))}`);
      if (v.title) lines.push(`TITLE:${vcardEscape(clean(v.title))}`);
      if (v.phone) lines.push(`TEL;TYPE=CELL:${clean(v.phone)}`);
      if (v.email) lines.push(`EMAIL:${clean(v.email)}`);
      if (v.url) lines.push(`URL:${clean(v.url)}`);
      lines.push('END:VCARD');
      return lines.join('\n');
    }
    case 'email': {
      const { to, subject, body } = c.email;
      if (!to) return '';
      const q = new URLSearchParams();
      if (subject) q.set('subject', subject);
      if (body) q.set('body', body);
      const qs = q.toString().replace(/\+/g, '%20');
      return `mailto:${clean(to)}${qs ? `?${qs}` : ''}`;
    }
    case 'sms': {
      const { phone, message } = c.sms;
      if (!phone) return '';
      return `SMSTO:${clean(phone)}:${message}`;
    }
    case 'phone':
      return c.phone.number ? `tel:${clean(c.phone.number).replace(/\s+/g, '')}` : '';
  }
}

/** Texto de ejemplo que se muestra cuando el formulario está vacío. */
export const PLACEHOLDER_PAYLOAD = 'https://qr-generator.soyjulian.dev';
