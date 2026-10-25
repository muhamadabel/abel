import { motion } from 'framer-motion'
import { stagger, viewportOnce, wordReveal } from '../lib/motion'

// Teks dipecah per kata, tiap kata naik dari balik mask.
// `animate` diisi state ('hidden'/'show') kalau mau dikendalikan manual,
// kosongkan supaya jalan otomatis saat masuk viewport.
export default function SplitText({ text, as = 'span', className, delay = 0, gap = 0.06, animate }) {
  const Tag = motion[as] ?? motion.span
  const trigger = animate ? { animate } : { whileInView: 'show', viewport: viewportOnce }

  return (
    <Tag className={className} variants={stagger(gap, delay)} initial="hidden" {...trigger}>
      <span className="sr-only">{text}</span>
      {text.split(' ').map((w, i) => (
        <span key={`${w}-${i}`} className="word-mask" aria-hidden="true">
          <motion.span className="word" variants={wordReveal}>
            {w}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
