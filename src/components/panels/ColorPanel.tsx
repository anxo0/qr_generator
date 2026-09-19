import { Section } from '@/components/Section';
import { ColorField } from '@/components/controls/ColorField';
import { Segmented } from '@/components/controls/Segmented';
import { Slider } from '@/components/controls/Slider';
import { Toggle } from '@/components/controls/Toggle';
import { useI18n } from '@/lib/i18n';
import type { FillMode, QrStyle } from '@/lib/qr';
import { contrastRatio } from '@/lib/color';
import IconPalette from '~icons/solar/palette-bold';
import IconWarn from '~icons/solar/danger-triangle-bold';

interface Props {
  style: QrStyle;
  patch: (p: Partial<QrStyle>) => void;
}

export function ColorPanel({ style, patch }: Props) {
  const { t } = useI18n();
  const { fill, background } = style;
  const setFill = (p: Partial<QrStyle['fill']>) => patch({ fill: { ...fill, ...p } });

  const lowContrast = !background.transparent && contrastRatio(fill.color, background.color) < 3;

  return (
    <Section index="3" title={t('section.color')} icon={<IconPalette />}>
      <Segmented<FillMode>
        label={t('color.fill')}
        value={fill.mode}
        onChange={(mode) => setFill({ mode })}
        options={[
          { value: 'solid', label: t('color.solid') },
          { value: 'linear', label: t('color.linear') },
          { value: 'radial', label: t('color.radial') },
        ]}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <ColorField label={t('color.primary')} value={fill.color} onChange={(color) => setFill({ color })} />
        {fill.mode !== 'solid' && (
          <ColorField label={t('color.secondary')} value={fill.color2} onChange={(color2) => setFill({ color2 })} />
        )}
      </div>
      {fill.mode === 'linear' && (
        <Slider
          label={t('color.angle')}
          value={fill.angle}
          min={0}
          max={360}
          step={5}
          format={(v) => `${v}°`}
          onChange={(angle) => setFill({ angle })}
        />
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <OverrideColor
          label={t('color.finder')}
          value={style.finderColor}
          fallback={fill.color}
          onChange={(finderColor) => patch({ finderColor })}
        />
        <OverrideColor
          label={t('color.finderDot')}
          value={style.finderDotColor}
          fallback={style.finderColor ?? fill.color}
          onChange={(finderDotColor) => patch({ finderDotColor })}
        />
      </div>

      <div className="grid items-start gap-5 sm:grid-cols-2">
        <div className={background.transparent ? 'opacity-40 pointer-events-none' : ''}>
          <ColorField
            label={t('color.background')}
            value={background.color}
            onChange={(color) => patch({ background: { ...background, color } })}
          />
        </div>
        <Toggle
          className="sm:mt-6"
          label={t('color.transparent')}
          checked={background.transparent}
          onChange={(transparent) => patch({ background: { ...background, transparent } })}
        />
      </div>

      {lowContrast && (
        <p className="flex items-center gap-2 bg-warn-soft px-3 py-2 text-sm text-warn">
          <IconWarn />
          {t('color.contrast')}
        </p>
      )}
    </Section>
  );
}

function OverrideColor({
  label,
  value,
  fallback,
  onChange,
}: {
  label: string;
  value: string | null;
  fallback: string;
  onChange: (v: string | null) => void;
}) {
  const { t } = useI18n();
  return (
    <div className="space-y-2.5">
      <Segmented<'same' | 'custom'>
        label={label}
        size="sm"
        value={value === null ? 'same' : 'custom'}
        onChange={(v) => onChange(v === 'same' ? null : fallback)}
        options={[
          { value: 'same', label: t('color.same') },
          { value: 'custom', label: t('color.custom') },
        ]}
      />
      {value !== null && <ColorField value={value} onChange={onChange} />}
    </div>
  );
}
