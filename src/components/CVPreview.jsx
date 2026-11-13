import { motion } from 'framer-motion'
import SectionHead from './SectionHead'
import Magnetic from './Magnetic'
import Toast, { copyText, useToast } from './Toast'
import { blurUp, viewportOnce } from '../lib/motion'

export default function CVPreview() {
  const [toast, showToast] = useToast()

  const share = async () => {
    const url = `${location.origin}${location.pathname}#cv`
    showToast((await copyText(url)) ? 'Tautan CV disalin' : 'Gagal menyalin tautan')
  }

  return (
    <section id="cv" className="section section--band cv-section">
      <div className="container">
        <SectionHead id="cv" meta="Standar ATS · 1 Halaman A4" />

        <motion.div
          className="cv-card"
          variants={blurUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <div className="cv-card__info">
            <span className="cv-card__badge">Berkas Resmi</span>
            <h3 className="cv-card__title">Curriculum Vitae</h3>
            <p className="cv-card__desc">
              Dokumen satu halaman format ATS yang merangkum keahlian teknis, rekam jejak proyek rekayasa perangkat lunak, riwayat pendidikan, dan pengalaman organisasi.
            </p>
            <div className="cv-card__meta">
              <span>Format PDF</span>
              <span className="cv-card__dot">·</span>
              <span>1 Halaman A4</span>
              <span className="cv-card__dot">·</span>
              <span>Standar ATS</span>
            </div>
          </div>

          <div className="cv-card__actions no-print">
            <Magnetic
              as="a"
              href="/cv-muhammad-abel-abhinaya.pdf"
              download="CV - Muhammad Abel Abhinaya.pdf"
              className="btn btn--primary"
            >
              Unduh PDF
            </Magnetic>
            <Magnetic
              as="a"
              href="/cv-muhammad-abel-abhinaya.pdf"
              target="_blank"
              rel="noreferrer"
              className="btn btn--ghost"
            >
              Lihat PDF ↗
            </Magnetic>
            <Magnetic as="button" type="button" className="btn btn--ghost" onClick={share}>
              Bagikan
            </Magnetic>
          </div>
        </motion.div>
      </div>
      <Toast message={toast} />
    </section>
  )
}
