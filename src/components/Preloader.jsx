import { motion } from 'framer-motion'
import { profile } from '../data/content'

// Layar pembuka singkat. Fade-out 0.4s dikendalikan AnimatePresence di App.
export default function Preloader() {
  return (
    <motion.div
      className="preloader no-print"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      aria-hidden="true"
    >
      <motion.span
        className="preloader__name"
        initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {profile.display}
      </motion.span>
      <span className="preloader__bar">
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.75, ease: [0.65, 0, 0.35, 1] }}
        />
      </span>
    </motion.div>
  )
}
