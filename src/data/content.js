// =============================================================
//  DATA RESMI PORTOFOLIO - MUHAMMAD ABEL ABHINAYA
//  Ringkas, presisi, tanpa teks bertele-tele.
// =============================================================

export const profile = {
  name: 'Muhammad Abel Abhinaya Riananto',
  display: 'Abel Abhinaya',
  nickname: 'Abel',
  role: 'Front End Developer & Software Engineer',
  tagline: 'High-performance web & mobile interfaces.',
  location: 'Yogyakarta, ID',
  institution: 'Universitas Gadjah Mada',
  major: 'TRPL',
  cohort: '2024',
  available: true,
  availableText: 'Available for work',
  photo: '/profile.png',
  initials: 'MA',
  birthDate: '17 Juni 2006',
  phone: '08813798385',
  address: 'Pandes RT02, Panggungharjo, Sewon, Bantul',
}

export const contact = {
  email: 'muhammadabelabhinaya@mail.ugm.ac.id',
  phone: '08813798385',
  github: { label: 'GitHub', handle: 'muhamadabel', url: 'https://github.com/muhamadabel' },
  linkedin: {
    label: 'LinkedIn',
    handle: 'Abel Abhinaya',
    url: 'https://www.linkedin.com/in/muhammad-abel-abhinaya-riananto-944376326/',
  },
  instagram: { label: 'Instagram', handle: '@mhmmdabel._', url: 'https://instagram.com/mhmmdabel._' },
  tiktok: { label: 'TikTok', handle: '@muhablee', url: 'https://www.tiktok.com/@muhablee' },
  location: 'Yogyakarta, ID',
}

export const education = [
  {
    school: 'Universitas Gadjah Mada (UGM)',
    faculty: 'Sekolah Vokasi',
    program: 'Teknologi Rekayasa Perangkat Lunak (TRPL)',
    period: '2024 - Sekarang',
    degree: 'S.Tr.Kom',
  },
  {
    school: 'SMAN 1 Kasihan',
    program: 'SMA',
    period: '2021 - 2024',
    degree: '',
  },
]

export const organizations = [
  {
    role: 'Staff Kastrad',
    org: 'KMTEDI SV UGM',
    period: '2024 - Sekarang (2 Tahun)',
    tag: 'Advokasi & Kebijakan',
    desc: 'Mengawal advokasi akademik dan kajian kebijakan strategis kemahasiswaan Departemen Teknik Elektro dan Informatika SV UGM.',
  },
  {
    role: 'Staff Minat dan Bakat (Mikat)',
    org: 'ASSETS TRPL SV UGM',
    period: '1 Tahun',
    tag: 'Minat & Bakat',
    desc: 'Merancang serta mengeksekusi program kerja pengembangan potensi mahasiswa TRPL di bidang akademik maupun non-akademik, serta mengoordinasikan partisipasi kompetisi.',
  },
  {
    role: 'Staff Divisi Kewirausahaan',
    org: 'Jamaah Vokasi Al-Alim SV UGM',
    period: '1 Tahun',
    tag: 'Kewirausahaan',
    desc: 'Mengelola penggalangan dana mandiri (fundraising) dan merchandise kreatif, strategi pemasaran, arus kas operasional, dan logistik penjualan.',
  },
  {
    role: 'Technical Operations',
    org: 'Hackathon Crew',
    period: 'Event Crew',
    tag: 'Operations',
    desc: 'Mendukung operasional teknis perlombaan, live demo peserta, dan koordinasi infrastruktur komputasi.',
  },
]

export const achievements = [
  {
    title: 'Juara Harapan 2',
    event: 'Olimpiade Olivia - Web Development',
    organizer: 'UNESA',
    year: '2026',
  },
]

export const projects = [
  {
    id: 'hongfilms',
    num: '01',
    title: 'Hongfilms',
    year: '2025',
    category: 'Film Platform',
    role: 'Developer',
    desc: 'Platform ekosistem perfilman independen. Menampilkan katalog karya sinematik, profil produksi, dan integrasi workflow film.',
    stack: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript'],
    live: 'https://hongfilms.com',
    repo: 'https://github.com/HongFilm/honglog',
    isPrivate: false,
  },
  {
    id: 'rongsokin',
    num: '02',
    title: 'Rongsok.in',
    year: '2024',
    category: 'Web Platform',
    role: 'Developer',
    desc: 'Marketplace sampah berbasis geolokasi. Menghubungkan warga dengan pengepul dalam radius terdekat.',
    stack: ['Next.js', 'TypeScript', 'REST API', 'Tailwind'],
    live: 'https://rongsokin.vercel.app/',
    image: '/projects/rongsokin.jpg',
    repo: 'https://github.com/muhamadabel/rongsokin-frontend',
    isPrivate: false,
  },
  {
    id: 'somnia',
    num: '03',
    title: 'Somnia',
    year: '2024',
    category: 'Web Application',
    role: 'Front End Developer',
    desc: 'Arsitektur front end modular dengan komponen type-safe dan zero runtime error.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    live: 'https://www.somnia.page/',
    image: '/projects/somnia.jpg',
    repo: 'https://github.com/muhamadabel/somnia-fe',
    isPrivate: false,
  },
  {
    id: 'simpondok',
    num: '04',
    title: 'Simpondok',
    year: '2024',
    category: 'Management System',
    role: 'Frontend Developer',
    desc: 'Sistem informasi manajemen pondok pesantren digital untuk tata kelola santri, administrasi akademik, dan pelaporan terpadu.',
    stack: ['Next.js', 'React', 'Tailwind CSS', 'REST API'],
    live: 'https://simpondokk.vercel.app',
    image: '/projects/simpondok.jpg',
    repo: 'https://github.com/muhamadabel/Be-SIA-UGN-Kel1',
    isPrivate: false,
  },
]

export const skills = [
  { group: 'Front End', items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML5/CSS3'] },
  { group: 'Mobile & Native', items: ['React Native', 'Expo', 'Offline-First', 'iOS & Android'] },
  { group: 'State & API', items: ['Zustand', 'Context API', 'REST API Integration', 'Node.js', 'Laravel'] },
  { group: 'Tooling & QA', items: ['Git/GitHub', 'Vite', 'Figma', 'Selenium', 'Cucumber'] },
]

export const repos = [
  {
    name: 'honglog',
    desc: 'Film clapper & camera report mobile app.',
    lang: 'TypeScript',
    url: 'https://github.com/HongFilm/honglog',
  },
  {
    name: 'rongsokin-frontend',
    desc: 'Geolocation-based waste recycling marketplace.',
    lang: 'TypeScript',
    url: 'https://github.com/muhamadabel/rongsokin-frontend',
  },
  {
    name: 'somnia-fe',
    desc: 'Modular front end architecture.',
    lang: 'TypeScript',
    url: 'https://github.com/muhamadabel/somnia-fe',
  },
  {
    name: 'Be-SIA-UGN-Kel1',
    desc: 'Backend academic information system.',
    lang: 'PHP',
    url: 'https://github.com/muhamadabel/Be-SIA-UGN-Kel1',
  },
]

export const sections = [
  { id: 'work', label: 'Karya', title: 'Proyek' },
  { id: 'experience', label: 'Pengalaman', title: 'Pengalaman' },
  { id: 'skills', label: 'Keahlian', title: 'Keahlian' },
  { id: 'cv', label: 'CV', title: 'Curriculum Vitae' },
  { id: 'contact', label: 'Hubungi', title: 'Hubungi' },
]
