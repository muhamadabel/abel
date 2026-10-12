import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { springMagnet, springSnappy } from '../lib/motion'

// Tombol/tautan yang tertarik ke arah kursor. Delta dari tengah * strength,
// dihaluskan spring. Di layar sentuh tidak ada mousemove, jadi diam saja.
export default function Magnetic({ as = 'a', strength = 0.25, className = '', children, ...rest }) {
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, springMagnet)
  const y = useSpring(my, springMagnet)
  const Comp = as === 'button' ? motion.button : motion.a

  const onMouseMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - (r.left + r.width / 2)) * strength)
    my.set((e.clientY - (r.top + r.height / 2)) * strength)
  }

  const onMouseLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <Comp
      ref={ref}
      className={className}
      style={{ x, y }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileTap={{ scale: 0.96 }}
      transition={springSnappy}
      {...rest}
    >
      {children}
    </Comp>
  )
}
