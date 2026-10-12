import { skills } from '../data/content'

const allSkills = [...new Set(skills.flatMap((s) => s.items))]

export default function TechMarquee() {
  return (
    <div className="marquee no-print" aria-label="Teknologi yang dipakai">
      <div className="marquee__track">
        {[0, 1].map((copy) => (
          <ul key={copy} className="marquee__group" aria-hidden={copy === 1 ? 'true' : undefined}>
            {allSkills.map((tech) => (
              <li key={tech} className="marquee__item">
                <span className="marquee__dot" />
                {tech}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
