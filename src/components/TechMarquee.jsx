import { useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'
import { skills } from '../data/content'

const allSkills = [...new Set(skills.flatMap((s) => s.items))]

const wrap = (min, max, v) => {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

// Pita teknologi yang berjalan terus, makin cepat dan berbalik arah mengikuti scroll.
export default function TechMarquee() {
  const reduce = useReducedMotion()
  const base = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const boost = useTransform(velocity, [0, 1000], [0, 4], { clamp: false })
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`)
  const direction = useRef(-1)

  useAnimationFrame((_, delta) => {
    if (reduce) return
    const b = boost.get()
    if (b < 0) direction.current = 1
    else if (b > 0) direction.current = -1
    const move = direction.current * 1.6 * (delta / 1000) * (1 + Math.abs(b))
    base.set(base.get() + move)
  })

  return (
    <div className="marquee no-print" aria-label="Teknologi yang dipakai">
      <motion.div className="marquee__track" style={{ x }}>
        {[0, 1].map((copy) => (
          <ul key={copy} className="marquee__group" aria-hidden={copy === 1 ? 'true' : undefined}>
            {allSkills.map((tech) => (
              <li key={tech} className="marquee__item">
                {tech}
                <span className="marquee__sep" aria-hidden="true" />
              </li>
            ))}
          </ul>
        ))}
      </motion.div>
    </div>
  )
}
