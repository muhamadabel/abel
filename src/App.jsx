import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useSmoothScroll } from './lib/smoothScroll'
import Preloader from './components/Preloader'
import Nav from './components/Nav'
import Hero from './components/Hero'
import TechMarquee from './components/TechMarquee'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Skills from './components/Skills'
import CVPreview from './components/CVPreview'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  useSmoothScroll()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 900)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <AnimatePresence>{!ready && <Preloader key="preloader" />}</AnimatePresence>
      <Nav />
      <main>
        <Hero ready={ready} />
        <TechMarquee />
        <Projects />
        <Experience />
        <Skills />
        <CVPreview />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
