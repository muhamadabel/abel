import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { profile } from '../data/content'

export default function Preloader() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const start = performance.now()
    const timer = setInterval(() => setProgress(Math.min(100, Math.round((performance.now() - start) / 13.5))), 30)
    return () => clearInterval(timer)
  }, [])
  return <motion.div className="preloader preloader--round no-print" initial={{ y: 0, borderBottomLeftRadius: '0%', borderBottomRightRadius: '0%' }} exit={{ y: '-110%', borderBottomLeftRadius: '50% 18%', borderBottomRightRadius: '50% 18%' }} transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }} aria-hidden="true">
    <motion.div className="preloader__orb" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={() => {
      const target = document.querySelector('.nav__mark')?.getBoundingClientRect()
      const x = target ? target.left + target.width / 2 - window.innerWidth / 2 : 0
      const y = target ? target.top + target.height / 2 - window.innerHeight / 2 : -window.innerHeight / 2
      return { x, y, scale: target ? target.width / 128 : 0.27, opacity: 1 }
    }} transition={{ duration: 0.65, ease: [0.65, 0, 0.35, 1] }}>
      <svg viewBox="0 0 120 120" aria-hidden="true"><circle className="preloader__track" cx="60" cy="60" r="57" /><motion.circle className="preloader__ring" cx="60" cy="60" r="57" pathLength="1" initial={{ pathLength: 0 }} animate={{ pathLength: progress / 100 }} transition={{ duration: 0.12, ease: 'easeOut' }} /></svg>
      <motion.div className="preloader__avatar-mask"><motion.img className="preloader__avatar" src={profile.avatar} alt="" animate={{ opacity: [0.8, 1, 0.8], y: [2, -2, 2] }} transition={{ duration: 2, repeat: Infinity }} /></motion.div>
    </motion.div>
    <motion.span className="preloader__simple-count" exit={{ opacity: 0 }}>{String(progress).padStart(3, '0')}</motion.span>
  </motion.div>
}
