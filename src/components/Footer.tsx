import { Logo, REPO_URL } from '@/components/Header';
import { useI18n } from '@/lib/i18n';

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-12 border-t border-line">
      <div className="flex flex-col gap-3 py-6">
        <p className="flex items-center gap-2 text-sm text-ink-2">
          <a href="https://soyjulian.dev" target="_blank" rel="noopener noreferrer" aria-label="soyjulian.dev" className="group inline-flex">
            <Logo size={20} />
          </a>
          {t('footer.made')}{' '}
          <a href="https://soyjulian.dev" target="_blank" rel="noopener noreferrer" className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-accent">
            Julián
          </a>
          <span className="text-ink-3">·</span>
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-accent">
            {t('footer.source')}
          </a>
          <span className="text-ink-3">·</span>
          <span className="font-mono text-xs text-ink-3">MIT</span>
        </p>
        <p className="font-mono text-[11px] text-ink-3">{t('footer.note')}</p>
      </div>
    </footer>
  );
}
