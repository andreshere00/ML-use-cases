import { useEffect, useRef } from 'react'
import { LANGUAGES, useI18n } from '../i18n'
import { CheckIcon, CloseIcon } from './Icons'

/** Ventana modal para cambiar entre castellano e inglés. Usa <dialog>: Esc y el foco los gestiona el navegador. */
export function LanguageDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang, setLang, t } = useI18n()
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      className="lang-dialog"
      aria-labelledby="lang-title"
      aria-describedby="lang-desc"
      onClose={onClose}
      // Un clic en el fondo (fuera de la caja) cierra la ventana.
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="lang-box">
        <header className="lang-head">
          <h2 id="lang-title">{t.language.title}</h2>
          <button className="lang-close" onClick={onClose} aria-label={t.language.close} title={t.language.close}>
            <CloseIcon />
          </button>
        </header>
        <p id="lang-desc" className="muted">
          {t.language.description}
        </p>
        <div className="lang-options" role="radiogroup" aria-labelledby="lang-title">
          {LANGUAGES.map((l) => {
            const selected = l.id === lang
            return (
              <button
                key={l.id}
                role="radio"
                aria-checked={selected}
                lang={l.id}
                className={`lang-option ${selected ? 'selected' : ''}`}
                autoFocus={selected}
                onClick={() => {
                  setLang(l.id)
                  onClose()
                }}
              >
                <span className="lang-code" aria-hidden="true">
                  {l.id.toUpperCase()}
                </span>
                <span className="lang-name">
                  <b>{l.name}</b>
                  <span>{l.other}</span>
                </span>
                {selected && <CheckIcon />}
              </button>
            )
          })}
        </div>
      </div>
    </dialog>
  )
}
