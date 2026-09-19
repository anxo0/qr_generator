import { useMemo } from 'react';
import { useI18n, type Key } from '@/lib/i18n';
import { encode, renderSvg, type QrStyle } from '@/lib/qr';
import { defaultStyle, stylePresets } from '@/lib/presets';
import IconMagic from '~icons/solar/stars-minimalistic-bold';

interface Props {
  style: QrStyle;
  patch: (p: Partial<QrStyle>) => void;
}

/** Tira de estilos rápidos; cada chip es un QR real dibujado con ese estilo. */
export function PresetsRow({ style, patch }: Props) {
  const { t } = useI18n();
  const previews = useMemo(() => {
    const matrix = encode('soyjulian.dev', 'L');
    return stylePresets.map((p) => ({
      ...p,
      svg: renderSvg(matrix, { ...defaultStyle, ...p.patch, margin: 1, logo: { ...defaultStyle.logo, src: null } }).svg,
    }));
  }, []);

  return (
    <div className="hairline-b pb-6">
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line-strong text-[11px] font-medium tabular-nums text-ink-2">0</span>
        <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">
          <span className="text-ink-2">
            <IconMagic />
          </span>
          {t('section.presets')}
        </h2>
      </div>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
        {previews.map((p) => {
          const active = isActive(style, p.patch);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => patch(p.patch)}
              className={[
                'flex min-w-0 flex-col items-center gap-1.5 border bg-surface p-1.5 pb-2 transition-[border-color,transform] duration-150 hover:-translate-y-0.5',
                active ? 'border-ink' : 'border-line hover:border-line-strong',
              ].join(' ')}
            >
              <span className="block aspect-square w-full overflow-hidden [&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: p.svg }} />
              <span className={`w-full truncate text-center text-[11px] ${active ? 'text-ink' : 'text-ink-3'}`}>{t(`preset.${p.id}` as Key)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function isActive(style: QrStyle, patch: Partial<QrStyle>): boolean {
  return (Object.keys(patch) as (keyof QrStyle)[]).every((k) => JSON.stringify(style[k]) === JSON.stringify(patch[k]));
}
