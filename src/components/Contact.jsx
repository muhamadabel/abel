import { motion } from 'framer-motion'
import { contact, profile } from '../data/content'
import { blurUp, rowReveal, stagger, viewportOnce } from '../lib/motion'
import { useFocus } from '../hooks/useFocus'
import SectionHead from './SectionHead'
import Magnetic from './Magnetic'
import Toast, { copyText, useToast } from './Toast'

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

  const copyEmail = async () => {
    showToast((await copyText(contact.email)) ? 'Email disalin' : 'Gagal menyalin email')
  }

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <SectionHead id="contact" meta={`${profile.availableText}, ${contact.location}`} />

        <motion.div className="contact__body" variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={viewportOnce}>
          <motion.a href={`mailto:${contact.email}`} className="contact__email" variants={blurUp}>
            {contact.email}
          </motion.a>

          <motion.div className="contact__actions" variants={blurUp}>
            <Magnetic href={`mailto:${contact.email}`} className="btn btn--primary">
              Kirim email
            </Magnetic>
            <Magnetic as="button" type="button" className="btn btn--ghost" onClick={copyEmail}>
              Salin email
            </Magnetic>
          </motion.div>

          <motion.ul className="socials" variants={stagger(0.06, 0.1)} {...group}>
            {socials.map((s, i) => (
              <motion.li key={s.label} variants={rowReveal}>
                <motion.a {...focus(i)} href={s.url} className="social" {...(s.url.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>
                  <span className="social__label">{s.label}</span>
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
