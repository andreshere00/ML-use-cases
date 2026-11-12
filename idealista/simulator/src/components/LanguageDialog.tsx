import { useEffect, useRef } from 'react'
import { LANGS, useLang, useT } from '../i18n'
import { CheckIcon, CloseIcon } from './Icons'

/** Ventana modal para cambiar de idioma. Usa <dialog>: foco atrapado, Escape y fondo nativos. */
export function LanguageDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT()
  const { lang, setLang } = useLang()
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      className="lang-dialog"
      aria-labelledby="lang-title"
      aria-describedby="lang-hint"
      onClose={onClose}
      // Un clic en el fondo (fuera de la caja) cierra la ventana.
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="lang-box">
        <header className="lang-head">
          <h2 id="lang-title">{t.language}</h2>
          <button className="lang-close" onClick={onClose} aria-label={t.close} title={t.close}>
            <CloseIcon size={18} />
          </button>
        </header>
        <p id="lang-hint" className="muted">
          {t.languageHint}
        </p>
        <ul className="lang-options">
          {LANGS.map((l) => (
            <li key={l.id}>
              <button
                className={`lang-option ${l.id === lang ? 'on' : ''}`}
                lang={l.id}
                aria-pressed={l.id === lang}
                autoFocus={l.id === lang}
                onClick={() => {
                  setLang(l.id)
                  onClose()
                }}
              >
                <span className="lang-code" aria-hidden="true">
                  {l.id.toUpperCase()}
                </span>
                <b>{l.name}</b>
                {l.id === lang && <CheckIcon size={18} />}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </dialog>
  )
}
