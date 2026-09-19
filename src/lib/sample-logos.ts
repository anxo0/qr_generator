const svgData = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

export interface SampleLogo {
  id: string;
  /** Miniatura para el botón. */
  thumb: string;
  /** Devuelve la imagen como data URL, para que el SVG exportado sea autocontenido. */
  load: () => Promise<string>;
}

async function fileToDataUrl(url: string): Promise<string> {
  const blob = await fetch(url).then((r) => r.blob());
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error('read-failed'));
    reader.readAsDataURL(blob);
  });
}

const inline = (svg: string): SampleLogo['load'] => {
  const data = svgData(svg);
  return () => Promise.resolve(data);
};

const wifi = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#141416" stroke-width="2.2" stroke-linecap="round"><path d="M2.5 8.5a14 14 0 0 1 19 0"/><path d="M5.5 11.8a9.5 9.5 0 0 1 13 0"/><path d="M8.5 15a5 5 0 0 1 7 0"/><circle cx="12" cy="18.5" r="1.4" fill="#141416" stroke="none"/></svg>`;
const spark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#2f5bea" d="M12 2c.6 5.2 4.8 9.4 10 10-5.2.6-9.4 4.8-10 10-.6-5.2-4.8-9.4-10-10 5.2-.6 9.4-4.8 10-10Z"/></svg>`;
const heart = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#141416" d="M12 21s-7.5-4.6-9.6-9.2C.8 8.2 3.3 4.5 6.9 4.5c2 0 3.6 1.1 5.1 2.9 1.5-1.8 3.1-2.9 5.1-2.9 3.6 0 6.1 3.7 4.5 7.3C19.5 16.4 12 21 12 21Z"/></svg>`;

export const SAMPLE_LOGOS: SampleLogo[] = [
  { id: 'julian', thumb: '/logo-black.png', load: () => fileToDataUrl('/logo-black.png') },
  { id: 'wifi', thumb: svgData(wifi), load: inline(wifi) },
  { id: 'spark', thumb: svgData(spark), load: inline(spark) },
  { id: 'heart', thumb: svgData(heart), load: inline(heart) },
];
