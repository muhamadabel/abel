import { motion } from 'framer-motion'
import { headingReveal, stagger, viewportOnce } from '../lib/motion'

// Kicker [0X / LABEL] + judul section, muncul dengan blur-up.
export default function SectionHead({ index, label, title, meta, children }) {
  return (
    <motion.header
      className="section-head"
      variants={stagger(0.08)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      <motion.p className="kicker" variants={headingReveal}>
        [{String(index).padStart(2, '0')} / {label.toUpperCase()}]
      </motion.p>
      <motion.h2 className="section-title" variants={headingReveal}>
        {title}
      </motion.h2>
      {meta && (
        <motion.p className="section-meta" variants={headingReveal}>
          {meta}
        </motion.p>
      )}
      {children}
    </motion.header>
  )
}
