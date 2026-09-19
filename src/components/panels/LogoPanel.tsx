import { useRef, useState, type DragEvent } from 'react';
import { Section } from '@/components/Section';
import { Slider } from '@/components/controls/Slider';
import { Toggle } from '@/components/controls/Toggle';
import { useI18n } from '@/lib/i18n';
import type { QrStyle } from '@/lib/qr';
import { SAMPLE_LOGOS, type SampleLogo } from '@/lib/sample-logos';
import IconGallery from '~icons/solar/gallery-add-bold';
import IconUpload from '~icons/solar/upload-minimalistic-bold';
import IconTrash from '~icons/solar/trash-bin-minimalistic-bold';
import IconInfo from '~icons/solar/info-circle-bold';

const MAX_BYTES = 2 * 1024 * 1024;
const TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];

interface Props {
  style: QrStyle;
  patch: (p: Partial<QrStyle>) => void;
}

export function LogoPanel({ style, patch }: Readonly<Props>) {
  const { t } = useI18n();
  const { logo } = style;
  const setLogo = (p: Partial<QrStyle['logo']>) => patch({ logo: { ...logo, ...p } });
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sampleId, setSampleId] = useState<string | null>(null);

  const load = (file: File | undefined) => {
    if (!file) return;
    if (!TYPES.includes(file.type)) return setError(t('logo.badType'));
    if (file.size > MAX_BYTES) return setError(t('logo.tooBig'));
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setSampleId(null);
      setLogo({ src: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const pickSample = async (s: SampleLogo) => {
    setError(null);
    setSampleId(s.id);
    setLogo({ src: await s.load() });
  };

  const remove = () => {
    setSampleId(null);
    setLogo({ src: null });
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    load(e.dataTransfer.files[0]);
  };

  return (
    <Section
      index="4"
      title={t('section.logo')}
      icon={<IconGallery />}
      aside={
        logo.src && (
          <button
            type="button"
            onClick={remove}
            className="inline-flex items-center gap-1.5 text-xs text-ink-3 transition-colors hover:text-bad"
          >
            <IconTrash /> {t('logo.remove')}
          </button>
        )
      }
    >
      <div className="grid gap-4 sm:grid-cols-[7rem_1fr]">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={[
            'flex aspect-square w-full flex-col items-center justify-center gap-2 border border-dashed p-3 text-center transition-colors sm:w-28',
            dragging ? 'border-accent bg-accent-soft' : 'border-line-strong hover:border-ink',
            logo.src ? 'bg-white' : 'bg-surface hover:bg-surface-2',
          ].join(' ')}
        >
          {logo.src ? (
            <img src={logo.src} alt="" className="max-h-full max-w-full object-contain" />
          ) : (
            <>
              <IconUpload className="text-2xl text-ink-3" />
              <span className="text-[11px] leading-tight text-ink-3">{t('logo.drop')}</span>
            </>
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={TYPES.join(',')}
          className="hidden"
          onChange={(e) => {
            load(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
        <div className="space-y-3">
          <p className="text-xs text-ink-3">{t('logo.formats')}</p>
          {error && <p className="text-xs text-bad">{error}</p>}
          <div>
            <span className="label-mono mb-1.5 block">{t('logo.presets')}</span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_LOGOS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  title={s.id}
                  onClick={() => pickSample(s)}
                  className={`flex h-11 w-11 items-center justify-center border bg-white p-2 transition-colors hover:border-ink ${
                    sampleId === s.id && logo.src ? 'border-ink' : 'border-line'
                  }`}
                >
                  <img src={s.thumb} alt={s.id} className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {logo.src && (
        <>
          <div className="grid gap-5 sm:grid-cols-3">
            <Slider label={t('logo.size')} value={logo.size} min={0.1} max={0.35} step={0.01} format={(v) => `${Math.round(v * 100)}%`} onChange={(size) => setLogo({ size })} />
            <Slider label={t('logo.padding')} value={logo.padding} min={0} max={3} step={0.25} format={(v) => `${v} ${t('unit.modules')}`} onChange={(padding) => setLogo({ padding })} />
            <Slider label={t('logo.radius')} value={logo.radius} min={0} max={0.5} step={0.05} format={(v) => `${Math.round(v * 200)}%`} onChange={(radius) => setLogo({ radius })} />
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <Toggle label={t('logo.knockout')} checked={logo.knockout} onChange={(knockout) => setLogo({ knockout })} />
            <Toggle label={t('logo.background')} checked={logo.background} onChange={(background) => setLogo({ background })} />
          </div>
          {style.ec !== 'H' && (
            <p className="flex items-center gap-2 text-sm text-ink-2">
              <IconInfo className="text-ink-3" />
              {t('logo.ecHint')}
              <button type="button" onClick={() => patch({ ec: 'H' })} className="ml-1 font-mono text-xs text-accent underline underline-offset-4 hover:text-accent-ink">
                → H
              </button>
            </p>
          )}
        </>
      )}
    </Section>
  );
}
