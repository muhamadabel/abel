import { motion } from 'framer-motion'
import { contact, profile } from '../data/content'
import { headingReveal, springSnappy, stagger, viewportOnce } from '../lib/motion'
import SectionHead from './SectionHead'
import Magnetic from './Magnetic'
import Toast, { copyText, useToast } from './Toast'

const socials = [contact.github, contact.linkedin, contact.instagram, contact.tiktok]

export default function Contact() {
  const [toast, showToast] = useToast()

  const copyEmail = async () => {
    showToast((await copyText(contact.email)) ? 'Email disalin' : 'Gagal menyalin email')
  }

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <SectionHead index={5} label="Hubungi" title={profile.availableText} meta={contact.location} />

        <motion.div
          className="contact__body"
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <motion.a href={`mailto:${contact.email}`} className="contact__email" variants={headingReveal}>
            {contact.email}
          </motion.a>

          <motion.div className="contact__actions" variants={headingReveal}>
            <Magnetic href={`mailto:${contact.email}`} className="btn btn--primary">
              Kirim email
            </Magnetic>
            <Magnetic as="button" type="button" className="btn btn--ghost" onClick={copyEmail}>
              Salin email
            </Magnetic>
          </motion.div>

          <motion.ul className="socials" variants={headingReveal}>
            {socials.map((s) => (
              <li key={s.label}>
                <motion.a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="social"
                  whileHover={{ y: -2 }}
                  transition={springSnappy}
                >
                  <span className="social__label mono">{s.label}</span>
                  <span className="social__handle">{s.handle}</span>
                </motion.a>
              </li>
            ))}
            <li>
              <motion.a href={`tel:${contact.phone}`} className="social" whileHover={{ y: -2 }} transition={springSnappy}>
                <span className="social__label mono">Telepon</span>
                <span className="social__handle">{contact.phone}</span>
              </motion.a>
            </li>
          </motion.ul>
        </motion.div>
      </div>
      <Toast message={toast} />
    </section>
  )
}
