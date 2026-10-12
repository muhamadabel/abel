import { profile } from '../data/content'
import { scrollTo } from '../lib/smoothScroll'

export default function Footer() {
  return (
    <footer className="footer no-print">
      <div className="container footer__inner">
        <span>
          &copy; {new Date().getFullYear()} {profile.name}
        </span>
        <span className="mono">{profile.location}</span>
        <a
          href="#top"
          className="footer__top"
          onClick={(e) => {
            e.preventDefault()
            scrollTo('#top')
          }}
        >
          Kembali ke atas
        </a>
      </div>
    </footer>
  )
}
