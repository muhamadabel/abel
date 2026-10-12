# PROMPT: Rombak Total Front End Portfolio Abel Abhinaya

Kamu adalah front end engineer. Tugasmu: rombak total UI/UX dan animasi website portfolio ini supaya level-nya setara atau lebih bagus dari hallojanu.xyz. Referensi visual: https://hallojanu.xyz/ (buka dan pelajari animasinya).

## ATURAN KERAS

1. **JANGAN AI SLOP** - Zero buzzword paragraphs, zero fake testimonials, zero generic motivational copy. Semua teks dari data, bukan karangan.
2. **JANGAN pakai em-dash (—)** di manapun dalam source code. Pakai hyphen (-) atau koma.
3. **JANGAN ubah data di `src/data/content.js`** - Data sudah final. Import dan pakai apa adanya.
4. **JANGAN tambah dependency baru** kecuali GSAP jika perlu. Stack: React 19, Vite 8, Framer Motion 12, Lenis smooth scroll.
5. **HARUS dark/light mode** - Sudah ada di CSS via `[data-theme='dark']`. Pertahankan.
6. **HARUS responsive** - Mobile-first, breakpoint di 768px dan 992px.
7. **HARUS print-friendly CV** - Section CV harus bisa di-print/save PDF bersih via `window.print()`.

## PROJECT LOCATION

```
/Users/user/Documents/abel work/porto/abel-portfolio/
```

## TECH STACK (sudah terinstall, jangan ubah package.json kecuali tambah GSAP)

- React 19.2 + Vite 8.1
- Framer Motion 12.42
- Lenis 1.3 (smooth scroll)
- Vanilla CSS (src/styles/global.css) - bukan Tailwind

## DESIGN SYSTEM (sudah ada di global.css :root)

```css
/* Warna */
--color-gallery-white: #ffffff    /* Canvas utama */
--color-studio-mist: #f5f5f7     /* Band/section alternate */
--color-ink: #1d1d1f              /* Heading */
--color-slate: #707070            /* Body text */
--color-steel: #86868b            /* Meta/subtle */
--color-apple-blue: #0066cc      /* Links */
--color-pricing-blue: #0071e3    /* CTA buttons */
--color-launch-orange: #b64400   /* Kicker labels */

/* Typography */
--font-sf-pro-display: SF Pro Display / Inter fallback
--font-sf-pro-text: SF Pro Text / Inter fallback
--font-mono: JetBrains Mono / Menlo fallback

/* Hero: 80px/600/tracking -1.2px */
/* Feature heading: 40px/600 */
/* Body: 17px/400 */

/* Radius */
--radius-cards: 28px (kartu, shadowless)
--radius-buttons: 9999px (pill buttons)

/* Dark mode: [data-theme='dark'] override semua variabel */
```

## DATA TERSEDIA (import dari src/data/content.js)

```js
export const profile = {
  name: 'Muhammad Abel Abhinaya Riananto',
  display: 'Abel Abhinaya',
  role: 'Front End Developer & Software Engineer',
  location: 'Yogyakarta, ID',
  institution: 'Universitas Gadjah Mada',
  major: 'TRPL', cohort: '2024',
  photo: '/profile.png',
  birthDate: '17 Juni 2006',
  phone: '08813798385',
  address: 'Pandes RT02, Panggungharjo, Sewon, Bantul',
}

export const contact = {
  email: 'muhammadabelabhinaya@mail.ugm.ac.id',
  phone: '08813798385',
  github: { handle: 'muhamadabel', url: 'https://github.com/muhamadabel' },
  linkedin: { url: 'https://www.linkedin.com/in/muhammad-abel-abhinaya-riananto-944376326/' },
  instagram: { handle: '@mhmmdabel._', url: 'https://instagram.com/mhmmdabel._' },
}

export const education = [
  { school: 'Universitas Gadjah Mada (UGM)', program: 'TRPL', period: '2024 - Sekarang', degree: 'S.Tr.Kom' },
  { school: 'SMAN 1 Kasihan', program: 'SMA', period: '2021 - 2024' },
]

export const organizations = [
  { role: 'Staff Kastrad', org: 'KMTEDI SV UGM', period: '2024 - Sekarang (2 Tahun)', tag: 'Advokasi & Kebijakan' },
  { role: 'Staff Minkat', org: 'ASSETS TRPL UGM', period: '1 Tahun', tag: 'Minat & Bakat' },
  { role: 'Staff Media & Lembaga', org: 'Jamaah Vokasi Al-Alim UGM', period: '1 Tahun', tag: 'Kelembagaan' },
  { role: 'Technical Operations', org: 'Hackathon Crew', period: 'Event Crew', tag: 'Operations' },
]

export const achievements = [
  { title: 'Juara Harapan 2', event: 'Olimpiade Olivia - Web Development', organizer: 'UNESA', year: '2026' },
]

export const projects = [
  { id: 'honglog', title: 'Honglog', year: '2025', category: 'Mobile App', role: 'Developer',
    desc: 'Aplikasi clapper dan camera report untuk produksi film. Offline-first, multi-kamera, export PDF/CSV.',
    stack: ['React Native', 'Expo', 'Zustand', 'TypeScript', 'iOS / Android'],
    repo: 'https://github.com/HongFilm/honglog' },
  { id: 'rongsokin', title: 'Rongsok.in', year: '2024', category: 'Web Platform', role: 'Developer',
    desc: 'Marketplace sampah berbasis geolokasi. Menghubungkan warga dengan pengepul dalam radius terdekat.',
    stack: ['Next.js', 'TypeScript', 'REST API', 'Tailwind'],
    live: 'https://rongsokin.vercel.app/', repo: 'https://github.com/muhamadabel/rongsokin-frontend' },
  { id: 'somnia', title: 'Somnia', year: '2024', category: 'Web Application', role: 'Front End Developer',
    desc: 'Arsitektur front end modular dengan komponen type-safe dan zero runtime error.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    repo: 'https://github.com/muhamadabel/somnia-fe' },
  { id: 'sia-ugn', title: 'SIA UGN', year: '2024', category: 'Academic Portal', role: 'Frontend Developer',
    desc: 'Portal modul dosen untuk BKD, PAK, dan validasi formulir akademik. Integrasi REST API dengan autentikasi JWT.',
    stack: ['React', 'Laravel', 'REST API'],
    live: 'https://sia.trisuladana.com/', repo: 'https://github.com/muhamadabel/Be-SIA-UGN-Kel1' },
]

export const skills = [
  { group: 'Front End', items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML5/CSS3'] },
  { group: 'Mobile & Native', items: ['React Native', 'Expo', 'Offline-First', 'iOS & Android'] },
  { group: 'State & API', items: ['Zustand', 'Context API', 'REST API Integration', 'Node.js', 'Laravel'] },
  { group: 'Tooling & QA', items: ['Git/GitHub', 'Vite', 'Figma', 'Selenium', 'Cucumber'] },
]

export const sections = [
  { id: 'work', label: 'Karya' },
  { id: 'experience', label: 'Pengalaman' },
  { id: 'skills', label: 'Keahlian' },
  { id: 'cv', label: 'CV' },
  { id: 'contact', label: 'Hubungi' },
]
```

## STRUKTUR FILE YANG HARUS KAMU TULIS ULANG

```
src/
  App.jsx                  -- Layout utama, import semua component
  components/
    Nav.jsx                -- Sticky nav, blur backdrop, scroll spy active indicator
    Hero.jsx               -- Hero section dengan floating cards
    TechMarquee.jsx        -- Infinite horizontal tech ticker
    Projects.jsx           -- Project cards grid
    Experience.jsx         -- Organization rows
    Skills.jsx             -- Skill cards grid
    CVPreview.jsx          -- Printable CV document
    Contact.jsx            -- Contact section
    Footer.jsx             -- Footer
    ThemeToggle.jsx        -- Dark/light toggle
  lib/
    motion.js              -- Framer Motion presets (spring configs)
    smoothScroll.js         -- Lenis integration (sudah ada, jangan ubah)
  hooks/
    useScrollSpy.js         -- Scroll spy hook (sudah ada, jangan ubah)
  styles/
    global.css             -- Semua CSS (tulis ulang sepenuhnya)
  data/
    content.js             -- JANGAN UBAH
```

## ANIMASI WAJIB (level hallojanu.xyz atau lebih)

### 1. Page Load Sequence
- Preloader fade-out 0.4s
- Hero title: split text per-word, setiap kata slide-up dari bawah dengan clip-path atau overflow:hidden, stagger 70ms, spring(100, 16)
- Hero subtitle & CTA: blur(8px) + y:40 fade-in stagger setelah title
- Floating cards: masuk dari sudut masing-masing, spring(120, 18), delay bertingkat 0.3-0.6s

### 2. Floating Cards (Hero Section)
- 4 kartu melayang di sudut-sudut hero (TL, TR, BL, BR) dengan rotasi halus (-3.5deg, +3.5deg)
- **3D mouse tilt**: useMotionValue + useTransform untuk rotateX/rotateY mengikuti posisi kursor, perspective 600px, spring(200, 20)
- Hover: scale 1.06, zIndex naik, border color berubah
- Isi kartu: stat cards dengan mini bar chart animasi (spring per bar)

### 3. Scroll Reveal
- Setiap section heading: y:30, opacity:0, blur:4px -> animate in dengan ease [0.25, 0.46, 0.45, 0.94] durasi 0.6s
- Project cards: scale(0.92) + blur(6px) -> scale(1) + blur(0) stagger 80ms
- Experience rows: slide-up dengan blur, **sibling dimming** (hover satu, sisanya fade ke opacity 0.3 + blur 1.5px)
- Skill chips: scale(0.8) -> scale(1) stagger 40ms per chip, hover berubah warna ke Pricing Blue

### 4. Magnetic Buttons
- Semua CTA button: useMotionValue x/y, onMouseMove hitung delta dari center * 0.25, useSpring(300, 20) untuk magnetic pull
- whileTap scale 0.96

### 5. Tech Marquee
- Infinite horizontal scroll @keyframes translateX(0) to translateX(-50%), 28s linear
- Hover pause animasi
- Gradient mask kiri-kanan

### 6. Micro-interactions
- Nav link hover: color transition ke Apple Blue
- Card hover: translateY(-6px) + border-color steel
- Social links: y:-2 on hover
- Copy email: floating toast dari bawah dengan spring + AnimatePresence exit

### 7. Smooth Scroll
- Lenis sudah terpasang via `src/lib/smoothScroll.js` dan `useScrollSpy.js`. Jangan ubah file ini.

## CV SECTION (KRITIS - JANGAN AI SLOP)

Section CV harus:
- Tampil sebagai kartu A4 putih dengan border subtle di halaman
- Layout 2 kolom: kiri (Pendidikan, Pengalaman, Pencapaian), kanan (Proyek, Keahlian)
- Header: nama besar (28px semibold), role uppercase, program + universitas, lalu kontak di sisi kanan (email, phone, github, alamat)
- Setiap item: nama bold + tahun di kanan, sub-info di bawah, tags mono kecil
- Proyek harus punya deskripsi singkat (dari data `desc`)
- Tombol "Cetak / Simpan PDF" yang panggil window.print()
- Tombol "Bagikan" yang copy URL #cv ke clipboard

### Print Stylesheet (@media print)
- Sembunyikan semua section kecuali CV
- A4 margin 14mm 16mm
- Font size 9.5pt body, 18pt nama
- Border header 2pt solid
- page-break-inside: avoid per item
- print-color-adjust: exact

## YANG SUDAH ADA DAN JANGAN DIUBAH

- `src/data/content.js` -- data final
- `src/lib/smoothScroll.js` -- Lenis setup
- `src/hooks/useScrollSpy.js` -- scroll spy
- `public/profile.png` -- foto profil
- `vite.config.js`
- `package.json` (boleh tambah GSAP saja kalau perlu)
- `index.html` (meta/OG tags sudah benar)

## URUTAN EKSEKUSI

1. Tulis `src/lib/motion.js` (spring presets)
2. Tulis `src/styles/global.css` (seluruh design system + animasi CSS)
3. Tulis semua komponen JSX satu per satu
4. Tulis `src/App.jsx`
5. `npm run build` -- harus 0 error
6. `npx vite preview --port 4173` -- verifikasi di browser
7. Audit: cari em-dash (—) di seluruh src/, harus 0

## CATATAN PENTING

- Halaman ini portfolio front end developer. UI/UX HARUS mencerminkan kemampuan teknis pemiliknya.
- Jangan pakai placeholder image atau lorem ipsum. Semua data sudah lengkap di content.js.
- Dark mode harus cantik, bukan sekadar invert warna. Gunakan dark token yang sudah ada di CSS.
- Animasi harus terasa buttery smooth, bukan twitchy. Gunakan spring physics, bukan duration-based linear.
- Setiap section harus punya kicker label format `[0X / LABEL]` dengan warna Launch Orange.
- Proyek deskripsi harus tampil (1 kalimat per proyek, sudah ada di data `desc`).
