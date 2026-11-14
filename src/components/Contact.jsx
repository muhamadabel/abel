import { useState } from 'react'
import { motion } from 'framer-motion'
import { contact } from '../data/content'
import { blurUp, rowReveal, stagger, viewportOnce } from '../lib/motion'
import { useFocus } from '../hooks/useFocus'
import SectionHead from './SectionHead'
import Toast, { copyText, useToast } from './Toast'
import ScrambleText from './fx/ScrambleText'

const socials = [
  contact.github,
  contact.linkedin,
  contact.instagram,
  contact.tiktok,
  { label: 'Telepon', handle: contact.phone, url: `tel:${contact.phone}` },
]

export default function Contact() {
  const [toast, showToast] = useToast()
  const [focus, group] = useFocus()
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [errorMessage, setErrorMessage] = useState('')

  const copyEmail = async () => {
    const success = await copyText(contact.email)
    showToast(success ? 'Email disalin ke clipboard' : 'Gagal menyalin email')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const message = form.elements.message.value.trim()

    if (!message) {
      showToast('Mohon tulis pesan kamu')
      return
    }

    setStatus('sending')
    setErrorMessage('')

    try {
      const endpoint = contact.formEndpoint || 'https://formsubmit.co/ajax/muhamadabelugm@gmail.com'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          message,
          _subject: 'Pesan Baru dari Website Portofolio',
          _template: 'box',
          _captcha: 'false',
        }),
      })

      const data = await response.json().catch(() => ({}))
      const isSuccess = response.ok && (data.success === 'true' || data.success === true)
      const msg = String(data.message || '').toLowerCase()

      if (isSuccess || msg.includes('activ')) {
        setStatus('sent')
        form.reset()
        showToast('Pesan berhasil terkirim ke Abel')
      } else {
        setStatus('error')
        setErrorMessage('Gagal mengirim pesan. Silakan coba lagi atau hubungi via WhatsApp/email.')
      }
    } catch {
      setStatus('error')
      setErrorMessage('Terjadi kendala koneksi. Silakan coba lagi atau hubungi langsung via WhatsApp.')
    }
  }

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <SectionHead id="contact" meta={contact.location} />

        <motion.div
          className="contact__body"
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          {/* Kotak Inbox Langsung */}
          <motion.div className="inbox-card" variants={blurUp}>
            {status === 'sent' ? (
              <div className="inbox-card__success">
                <div className="inbox-card__success-icon" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <h4 className="inbox-card__success-title">Pesan Berhasil Terkirim</h4>
                <p className="inbox-card__success-desc">
                  Terima kasih sudah menghubungi. Pesanmu sudah diteruskan langsung ke Abel dan akan dibalas secepatnya.
                </p>
                <button
                  type="button"
                  className="inbox-btn inbox-btn--primary"
                  onClick={() => setStatus('idle')}
                >
                  Kirim Pesan Lain
                </button>
              </div>
            ) : (
              <form className="inbox-form" onSubmit={handleSubmit}>
                <div className="inbox-form__field">
                  <label htmlFor="inbox-message" className="inbox-form__label">
                    Pesan
                  </label>
                  <textarea
                    id="inbox-message"
                    name="message"
                    rows="4"
                    className="inbox-form__textarea"
                    placeholder="Tulis pesan atau tawaran proyek di sini..."
                    required
                  />
                </div>

                {status === 'error' && errorMessage && (
                  <div className="inbox-form__error" role="alert">
                    {errorMessage}
                  </div>
                )}

                <div className="inbox-form__footer">
                  <div className="inbox-form__meta">
                    <button
                      type="button"
                      className="inbox-copy-inline"
                      onClick={copyEmail}
                      title="Salin email langsung"
                    >
                      <span className="mono">{contact.email}</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                      </svg>
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="inbox-btn inbox-btn--primary"
                    disabled={status === 'sending'}
                  >
                    {status === 'sending' ? (
                      <>
                        <span className="spinner-dot" aria-hidden="true" />
                        <span>Mengirim...</span>
                      </>
                    ) : (
                      <>
                        <span>Kirim Pesan</span>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                          <path d="M7 17 17 7M7 7h10v10" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>

          {/* Socials List */}
          <motion.ul className="socials" variants={stagger(0.05, 0.08)} {...group}>
            {socials.map((s, i) => (
              <motion.li key={s.label} variants={rowReveal}>
                <motion.a
                  {...focus(i)}
                  href={s.url}
                  className="social"
                  {...(s.url.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                >
                  <ScrambleText className="social__label" text={s.label} />
                  <span className="social__handle">{s.handle}</span>
                  <span className="social__arrow" aria-hidden="true">
                    ↗
                  </span>
                </motion.a>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
      <Toast message={toast} />
    </section>
  )
}
