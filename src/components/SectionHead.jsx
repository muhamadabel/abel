import { motion } from 'framer-motion'
import { sections } from '../data/content'
import { blurUp, stagger, viewportOnce } from '../lib/motion'
import SplitText from './SplitText'

// Judul section dari data sections, info pendek di sisi kanan, garis tipis di bawah.
export default function SectionHead({ id, meta, children }) {
  const { title } = sections.find((s) => s.id === id)

  return (
    <motion.header className="section-head" variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={viewportOnce}>
      <SplitText as="h2" text={title} className="section-title" gap={0.05} />
      {meta && (
        <motion.p className="section-meta" variants={blurUp}>
          {meta}
        </motion.p>
      )}
      {children && (
        <motion.div className="section-aside" variants={blurUp}>
          {children}
        </motion.div>
      )}
      <motion.span
        className="section-rule"
        aria-hidden="true"
        variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } } }}
      />
    </motion.header>
  )
}
