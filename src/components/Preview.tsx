import { useState } from 'react';
import { Segmented } from '@/components/controls/Segmented';
import { useFlash } from '@/hooks/useFlash';
import type { LiveStatus, QrResult } from '@/hooks/useQr';
import { useI18n } from '@/lib/i18n';
import {
  copyPngToClipboard,
  copyText,
  downloadBlob,
  downloadSvg,
  renderSvg,
  suggestFilename,
  svgToPngBlob,
  type QrStyle,
} from '@/lib/qr';
import IconCheck from '~icons/solar/check-circle-bold';
import IconCross from '~icons/solar/close-circle-bold';
import IconWarn from '~icons/solar/danger-triangle-bold';
import IconDownload from '~icons/solar/download-minimalistic-bold';
import IconCopy from '~icons/solar/copy-bold';
import IconShare from '~icons/solar/share-bold';
import IconScan from '~icons/solar/scanner-bold';

type Size = '512' | '1024' | '2048' | '4096';

interface Props {
  qr: QrResult;
  status: LiveStatus;
  style: QrStyle;
  payload: string;
  hasContent: boolean;
  onShare: () => Promise<string>;
}

export function Preview({ qr, status, style, payload, hasContent, onShare }: Props) {
  const { t } = useI18n();
  const [size, setSize] = useState<Size>('1024');
  const [msg, flash] = useFlash();
  const [busy, setBusy] = useState(false);

  const run = async (fn: () => Promise<void> | void, okMsg?: string) => {
    setBusy(true);
    try {
      await fn();
      if (okMsg) flash(okMsg);
    } catch {
      flash(t('export.error'));
    } finally {
      setBusy(false);
    }
  };

  const exportSvg = () => (qr.matrix ? renderSvg(qr.matrix, style, { width: Number(size) }).svg : '');

  return (
    <div className="space-y-4">
      <div className="flex min-h-7 items-center justify-between gap-3">
        <StatusBadge status={hasContent ? status : 'idle'} />
        {qr.matrix && <Meta qr={qr} style={style} payload={payload} />}
      </div>

      {/* Tarjeta con el código */}
      <div className="relative mx-auto w-full bg-white p-4 shadow-card sm:p-6 lg:w-[min(100%,calc(100dvh-25rem))]">
        <div className={`relative aspect-square ${style.background.transparent ? 'checker' : ''}`}>
          {qr.svg ? (
            <div
              key={qr.svg.length + qr.side}
              className={`settle h-full w-full ${hasContent ? '' : 'opacity-40'} [&>svg]:h-full [&>svg]:w-full`}
              dangerouslySetInnerHTML={{ __html: qr.svg }}
            />
          ) : (
            <div className="flex h-full items-center justify-center p-8 text-center text-sm text-ink-3">
              {t('preview.empty')}
            </div>
          )}
          {!hasContent && qr.svg && (
            <p className="absolute inset-x-0 bottom-3 text-center font-mono text-[11px] text-ink-3">{t('preview.empty')}</p>
          )}
        </div>
      </div>

      {(status === 'unreadable' || status === 'mismatch') && hasContent && (
        <p className="bg-warn-soft px-3 py-2 text-sm text-warn">
          {t(status === 'unreadable' ? 'preview.hint.unreadable' : 'preview.hint.mismatch')}
        </p>
      )}

      {/* Exportación */}
      <div className="space-y-3 pt-1">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <Segmented<Size>
            label={t('export.size')}
            size="sm"
            value={size}
            onChange={setSize}
            options={(['512', '1024', '2048', '4096'] as Size[]).map((s) => ({ value: s, label: `${s}px` }))}
          />
          <span className="min-h-4 font-mono text-[11px] text-accent-ink" aria-live="polite">
            {msg}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <ActionButton
            primary
            disabled={!qr.svg || busy}
            icon={<IconDownload />}
            label={`${t('export.download')} PNG`}
            onClick={() =>
              run(async () => downloadBlob(await svgToPngBlob(exportSvg(), Number(size)), suggestFilename(payload, 'png')))
            }
          />
          <ActionButton
            primary
            disabled={!qr.svg || busy}
            icon={<IconDownload />}
            label={`${t('export.download')} SVG`}
            onClick={() => run(() => downloadSvg(exportSvg(), suggestFilename(payload, 'svg')))}
          />
          <ActionButton
            disabled={!qr.svg || busy}
            icon={<IconCopy />}
            label={t('export.copyPng')}
            onClick={() => run(() => copyPngToClipboard(exportSvg(), Number(size)), t('export.copied'))}
          />
          <ActionButton
            disabled={!qr.svg || busy}
            icon={<IconCopy />}
            label={t('export.copySvg')}
            onClick={() => run(() => copyText(exportSvg()), t('export.copied'))}
          />
          <ActionButton
            className="col-span-2"
            disabled={busy}
            icon={<IconShare />}
            label={t('export.share')}
            onClick={() =>
              run(async () => {
                const note = await onShare();
                flash(note);
              })
            }
          />
        </div>
      </div>
    </div>
  );
}

/** Datos técnicos del código, cada uno con una explicación al pasar el ratón. */
function Meta({ qr, style, payload }: { qr: QrResult; style: QrStyle; payload: string }) {
  const { t } = useI18n();
  const m = qr.matrix!;
  const items: Array<[string, string]> = [
    [`v${m.version}`, t('meta.version')],
    [`${m.size}×${m.size}`, t('meta.modules')],
    [`${new TextEncoder().encode(payload).length} B`, t('meta.bytes')],
    [`EC ${style.ec}`, t('meta.ec')],
  ];
  if (qr.knockedOut > 0) items.push([`−${qr.knockedOut}`, t('meta.knockedOut')]);
  return (
    <ul className="flex flex-wrap justify-end gap-x-3 gap-y-1 font-mono text-[11px] text-ink-3">
      {items.map(([value, tip]) => (
        <li key={tip} className="group relative cursor-help underline decoration-dotted decoration-line-strong underline-offset-4 hover:text-ink">
          {value}
          <span
            role="tooltip"
            className="pointer-events-none absolute top-full right-0 z-20 mt-2 hidden w-60 border border-line bg-surface-2 p-2.5 font-sans text-xs leading-snug font-normal text-ink shadow-card group-hover:block"
          >
            {tip}
          </span>
        </li>
      ))}
    </ul>
  );
}

function StatusBadge({ status }: { status: LiveStatus }) {
  const { t } = useI18n();
  if (status === 'idle') return <span />;
  const map = {
    checking: { icon: <IconScan className="animate-pulse" />, text: t('preview.checking'), cls: 'bg-paper-2 text-ink-2' },
    ok: { icon: <IconCheck />, text: t('preview.readable'), cls: 'bg-ok-soft text-ok' },
    unreadable: { icon: <IconCross />, text: t('preview.unreadable'), cls: 'bg-bad-soft text-bad' },
    mismatch: { icon: <IconWarn />, text: t('preview.mismatch'), cls: 'bg-warn-soft text-warn' },
  } as const;
  const s = map[status];
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-1 font-mono text-[11px] tracking-wide uppercase ${s.cls}`}
      role="status"
    >
      {s.icon}
      {s.text}
    </div>
  );
}

function ActionButton({
  label,
  icon,
  onClick,
  primary,
  disabled,
  className = '',
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center gap-2 px-3 py-2.5 text-sm transition-[background-color,color,transform] duration-150 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40',
        primary ? 'bg-ink text-paper hover:bg-accent' : 'hairline bg-surface text-ink hover:border-ink hover:bg-surface-2',
        className,
      ].join(' ')}
    >
      {icon}
      {label}
    </button>
  );
}
