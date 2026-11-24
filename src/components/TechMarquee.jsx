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
import { projects } from '../data/content'

const rowOne = [
  { label: 'Front End', project: projects[0] },
  { label: 'Next.js', project: projects[1] },
  { label: 'TypeScript', project: projects[2] },
  { label: 'Full Stack', project: projects[3] },
]

const rowTwo = [
  { label: 'React Native', project: projects[4] },
  { label: 'Tailwind CSS', project: projects[5] },
  { label: 'PostgreSQL', project: projects[6] },
  { label: 'UI Systems', project: projects[7] },
]

const wrap = (min, max, v) => {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

function MarqueeRow({ items, baseDirection = -1 }) {
  const reduce = useReducedMotion()
  const base = useMotionValue(baseDirection > 0 ? -50 : 0)
  const { scrollY } = useScroll()
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const boost = useTransform(velocity, [0, 1200], [0, 2.2], { clamp: false })
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`)
  const slowed = useRef(false)

  useAnimationFrame((_, delta) => {
    if (reduce) return
    const b = Math.abs(boost.get())
    const speedFactor = slowed.current ? 0.35 : 1
    const move = baseDirection * 1.45 * speedFactor * (delta / 1000) * (1 + b)
    base.set(base.get() + move)
  })

  return (
    <motion.div
      className="kmarq__track"
      style={{ x }}
      onPointerEnter={() => (slowed.current = true)}
      onPointerLeave={() => (slowed.current = false)}
    >
      {[0, 1].map((copy) => (
        <ul key={copy} className="kmarq__group" aria-hidden={copy === 1 ? 'true' : undefined}>
          {items.map((entry) => (
            <li key={`${copy}-${entry.label}`} className="kmarq__item">
              <span className="kmarq__word">{entry.label}</span>
              {entry.project && (
                <a
                  href={entry.project.live || entry.project.repo}
                  target="_blank"
                  rel="noreferrer"
                  tabIndex={copy === 1 ? -1 : 0}
                  className="kmarq__pill"
                  data-cursor="Buka"
                  aria-label={`Buka proyek ${entry.project.title}`}
                >
                  <img src={entry.project.image} alt="" loading="lazy" draggable="false" />
                </a>
              )}
            </li>
          ))}
        </ul>
      ))}
    </motion.div>
  )
}

export default function TechMarquee() {
  return (
    <div className="kmarq no-print" aria-label="Sorotan teknologi dan karya">
      <MarqueeRow items={rowOne} baseDirection={-1} />
      <MarqueeRow items={rowTwo} baseDirection={1} />
    </div>
  )
}
