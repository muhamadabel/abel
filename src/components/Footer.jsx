import { profile } from '../data/content'
import { scrollTo } from '../lib/smoothScroll'
import Clock from './Clock'

export default function Footer() {
  return (
    <footer className="footer no-print">
      <div className="container footer__row">
        <span>
          &copy; {new Date().getFullYear()} {profile.name}
        </span>
        <Clock />
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
