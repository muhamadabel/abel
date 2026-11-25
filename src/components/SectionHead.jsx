import { useRef } from 'react'
import { motion } from 'framer-motion'
import { sections } from '../data/content'
import { blurUp, stagger, viewportOnce } from '../lib/motion'
import SplitText from './SplitText'
import useProximity from './fx/useProximity'

// Judul section bersih dan konsisten tanpa garis pemisah.
export default function SectionHead({ id, meta, children }) {
  const { title } = sections.find((s) => s.id === id)
  const ref = useRef(null)
  useProximity(ref, 180)

  return (
    <motion.header ref={ref} className="section-head" variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={viewportOnce}>
      <SplitText as="h2" text={title} className="section-title" gap={0.05} letters />
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
    </motion.header>
  )
}
