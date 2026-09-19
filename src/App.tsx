import { useCallback, useMemo, useState } from 'react';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Preview } from '@/components/Preview';
import { ColorPanel } from '@/components/panels/ColorPanel';
import { ContentPanel } from '@/components/panels/ContentPanel';
import { FramePanel } from '@/components/panels/FramePanel';
import { LogoPanel } from '@/components/panels/LogoPanel';
import { PresetsRow } from '@/components/panels/PresetsRow';
import { ShapePanel } from '@/components/panels/ShapePanel';
import { useQr, useVerify } from '@/hooks/useQr';
import { buildPayload, defaultContent, PLACEHOLDER_PAYLOAD, type Content } from '@/lib/content';
import { useI18n } from '@/lib/i18n';
import { copyText, type QrStyle } from '@/lib/qr';
import { defaultStyle } from '@/lib/presets';
import { decodeState, MAX_LOGO_CHARS, shareUrl } from '@/lib/url-state';
import IconReset from '~icons/solar/restart-bold';

/** Estado inicial: lo que venga en la URL (#c=…) sobre los valores por defecto. */
function initialState(): { content: Content; style: QrStyle } {
  const shared = decodeState(window.location.hash);
  return {
    content: { ...defaultContent, ...shared?.content },
    style: {
      ...defaultStyle,
      ...shared?.style,
      fill: { ...defaultStyle.fill, ...shared?.style?.fill },
      background: { ...defaultStyle.background, ...shared?.style?.background },
      logo: { ...defaultStyle.logo, ...shared?.style?.logo },
    },
  };
}

export default function App() {
  const { t } = useI18n();
  const [initial] = useState(initialState);
  const [content, setContent] = useState<Content>(initial.content);
  const [style, setStyle] = useState<QrStyle>(initial.style);

  const patch = useCallback((p: Partial<QrStyle>) => {
    setStyle((s) => {
      const next = { ...s, ...p };
      // Al añadir un logo por primera vez subimos la corrección a H: sin eso casi nunca se lee.
      if (p.logo?.src && !s.logo.src && s.ec !== 'H') next.ec = 'H';
      return next;
    });
  }, []);

  const realPayload = useMemo(() => buildPayload(content), [content]);
  const hasContent = realPayload.length > 0;
  const payload = hasContent ? realPayload : PLACEHOLDER_PAYLOAD;

  const qr = useQr(payload, style);
  const status = useVerify(qr.svg, payload, hasContent && !qr.error);

  const onShare = useCallback(async () => {
    const url = shareUrl({ content, style });
    await copyText(url);
    history.replaceState(null, '', url);
    const logoDropped = !!style.logo.src && style.logo.src.length > MAX_LOGO_CHARS;
    return t(logoDropped ? 'export.shareNoLogo' : 'export.shared');
  }, [content, style, t]);

  const reset = () => {
    setContent(defaultContent);
    setStyle(defaultStyle);
    history.replaceState(null, '', window.location.pathname);
  };

  return (
    <div className="flex min-h-dvh flex-col pb-8">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 sm:px-8">
        <section className="flex flex-col gap-2 py-8 sm:flex-row sm:items-end sm:justify-between sm:py-10">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t('app.tagline')}</h1>
            <p className="mt-1.5 max-w-2xl text-sm text-ink-2 sm:text-[15px]">{t('app.lede')}</p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 self-start font-mono text-xs text-ink-3 transition-colors hover:text-accent sm:self-auto"
          >
            <IconReset />
            {t('action.reset')}
          </button>
        </section>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
          <div className="min-w-0">
            <PresetsRow style={style} patch={patch} />
            <div className="pt-7">
              <ContentPanel content={content} onChange={setContent} />
              <ShapePanel style={style} patch={patch} />
              <ColorPanel style={style} patch={patch} />
              <LogoPanel style={style} patch={patch} />
              <FramePanel style={style} patch={patch} />
            </div>
            <Footer />
          </div>

          {/* overflow-anchor: sin esto Chrome recoloca el scroll cada vez que cambia la altura del panel sticky */}
          <aside className="order-first [overflow-anchor:none] lg:sticky lg:top-6 lg:order-none lg:self-start">
            <Preview qr={qr} status={status} style={style} payload={payload} hasContent={hasContent} onShare={onShare} />
            {qr.error && <p className="mt-3 bg-bad-soft px-3 py-2 text-sm text-bad">{t('preview.tooLong')}</p>}
          </aside>
        </div>
      </main>
    </div>
  );
}
