import { useI18n, type Lang } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';
import IconGithub from '~icons/simple-icons/github';
import IconArrow from '~icons/solar/arrow-right-up-linear';
import IconSun from '~icons/solar/sun-2-bold';
import IconMoon from '~icons/solar/moon-bold';

export const REPO_URL = 'https://github.com/anxo0/qr_generator';

/** Logo de soyjulian.dev: versión blanca en oscuro, negra en claro. Gira una vuelta al pasar
 *  el ratón por él o por su enlace (`group`), como en soyjulian.dev. */
export function Logo({ size = 28, className = '' }: Readonly<{ size?: number; className?: string }>) {
  return (
    <span
      className={`inline-block shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:rotate-[360deg] group-hover:rotate-[360deg] motion-reduce:transition-none motion-reduce:hover:rotate-0 motion-reduce:group-hover:rotate-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <img src="/logo-white.png" alt="" width={size} height={size} className="logo-dark size-full" draggable={false} />
      <img src="/logo-black.png" alt="" width={size} height={size} className="logo-light size-full" draggable={false} />
    </span>
  );
}

export function Header() {
  const { t, lang, setLang } = useI18n();
  const [theme, toggleTheme] = useTheme();
  return (
    <header className="hairline-b">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <a href="/" className="group flex items-center gap-2.5 text-ink">
          <Logo />
          <span className="text-[15px] font-semibold tracking-tight">{t('app.title')}</span>
          <span className="hidden font-mono text-[11px] tracking-wider text-ink-3 uppercase sm:inline">{t('nav.author')}</span>
        </a>
        <nav className="flex items-center gap-1 sm:gap-2">
          <LangSwitch lang={lang} onChange={setLang} />
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t('nav.light') : t('nav.dark')}
            title={theme === 'dark' ? t('nav.light') : t('nav.dark')}
            className="inline-flex h-8 w-8 items-center justify-center text-ink-2 transition-colors hover:text-ink"
          >
            {theme === 'dark' ? <IconSun /> : <IconMoon />}
          </button>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-ink-2 transition-colors hover:text-ink"
          >
            <IconGithub className="text-base" />
            <span className="hidden sm:inline">{t('nav.github')}</span>
          </a>
          <a
            href="https://soyjulian.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 font-mono text-xs text-ink-2 transition-colors hover:text-accent"
          >
            soyjulian.dev
            <IconArrow className="text-sm" />
          </a>
        </nav>
      </div>
    </header>
  );
}

function LangSwitch({ lang, onChange }: Readonly<{ lang: Lang; onChange: (l: Lang) => void }>) {
  return (
    <div className="inline-flex font-mono text-[11px] uppercase" role="radiogroup" aria-label="Idioma / Language">
      {(['es', 'en'] as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          role="radio"
          aria-checked={lang === l}
          onClick={() => onChange(l)}
          className={`px-2 py-1 transition-colors ${lang === l ? 'text-ink underline decoration-accent decoration-2 underline-offset-4' : 'text-ink-3 hover:text-ink'}`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
