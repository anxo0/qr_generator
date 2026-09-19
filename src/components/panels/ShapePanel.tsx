import { Section } from '@/components/Section';
import { ShapePicker } from '@/components/controls/ShapePicker';
import { Slider } from '@/components/controls/Slider';
import { FinderDotPreview, FinderPreview, ModulePreview } from '@/components/shape-previews';
import { useI18n } from '@/lib/i18n';
import type { FinderDotShape, FinderShape, ModuleShape, QrStyle } from '@/lib/qr';
import IconShapes from '~icons/solar/widget-4-bold';

const MODULES: ModuleShape[] = ['square', 'rounded', 'dots', 'fluid', 'classy', 'diamond'];
const FINDERS: FinderShape[] = ['square', 'rounded', 'circle', 'leaf'];
const DOTS: FinderDotShape[] = ['square', 'rounded', 'circle', 'leaf', 'diamond'];

interface Props {
  style: QrStyle;
  patch: (p: Partial<QrStyle>) => void;
}

export function ShapePanel({ style, patch }: Props) {
  const { t } = useI18n();
  const scalable = style.moduleShape !== 'fluid' && style.moduleShape !== 'classy';
  return (
    <Section index="2" title={t('section.shape')} icon={<IconShapes />}>
      <ShapePicker
        label={t('shape.modules')}
        value={style.moduleShape}
        onChange={(moduleShape) => patch({ moduleShape })}
        options={MODULES.map((s) => ({
          value: s,
          label: t(`shape.${s}`),
          viewBox: '0.5 0.5 6 6',
          preview: <ModulePreview shape={s} scale={scalable ? style.moduleScale : 0.85} />,
        }))}
      />
      {scalable && (
        <Slider
          label={t('shape.scale')}
          value={style.moduleScale}
          min={0.5}
          max={1}
          step={0.05}
          format={(v) => `${Math.round(v * 100)}%`}
          onChange={(moduleScale) => patch({ moduleScale })}
        />
      )}
      <ShapePicker
        label={t('shape.finder')}
        value={style.finderShape}
        onChange={(finderShape) => patch({ finderShape })}
        options={FINDERS.map((s) => ({
          value: s,
          label: t(`shape.${s}`),
          preview: <FinderPreview shape={s} dot={style.finderDotShape} />,
        }))}
      />
      <ShapePicker
        label={t('shape.finderDot')}
        value={style.finderDotShape}
        onChange={(finderDotShape) => patch({ finderDotShape })}
        options={DOTS.map((s) => ({
          value: s,
          label: t(`shape.${s}`),
          preview: <FinderDotPreview shape={s} ring={style.finderShape} />,
        }))}
      />
    </Section>
  );
}
