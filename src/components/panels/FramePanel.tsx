import { Section } from '@/components/Section';
import { Segmented } from '@/components/controls/Segmented';
import { Slider } from '@/components/controls/Slider';
import { useI18n } from '@/lib/i18n';
import { EC_RECOVERY, type ECLevel, type QrStyle } from '@/lib/qr';
import IconFrame from '~icons/solar/crop-minimalistic-bold';

interface Props {
  style: QrStyle;
  patch: (p: Partial<QrStyle>) => void;
}

const LEVELS: ECLevel[] = ['L', 'M', 'Q', 'H'];

export function FramePanel({ style, patch }: Props) {
  const { t } = useI18n();
  return (
    <Section index="5" title={t('section.frame')} icon={<IconFrame />}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Slider
          label={t('frame.margin')}
          value={style.margin}
          min={0}
          max={8}
          format={(v) => `${v} ${t('unit.modules')}`}
          onChange={(margin) => patch({ margin })}
        />
        <Slider
          label={t('frame.radius')}
          value={style.radius}
          min={0}
          max={0.3}
          step={0.01}
          format={(v) => `${Math.round((v / 0.3) * 100)}%`}
          onChange={(radius) => patch({ radius })}
        />
      </div>
      <div>
        <Segmented<ECLevel>
          label={t('frame.ec')}
          value={style.ec}
          onChange={(ec) => patch({ ec })}
          options={LEVELS.map((l) => ({
            value: l,
            label: (
              <>
                <span className="font-mono">{l}</span>
                <span className="text-xs opacity-60">{EC_RECOVERY[l]}</span>
              </>
            ),
          }))}
        />
        <p className="mt-2 text-xs text-ink-3">{t('frame.ec.hint')}</p>
      </div>
    </Section>
  );
}
