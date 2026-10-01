// =============================================================
//  KONTEN PORTFOLIO ABEL
//  Semua teks dipusatkan di sini biar gampang diubah.
//  Bagian bertanda TODO masih perlu kamu konfirmasi.
// =============================================================

export const profile = {
  name: 'Muhammad Abel Abhinaya',
  display: 'Abel',
  role: 'Frontend Developer',
  tagline: 'Everyone love clean things',
  location: 'Yogyakarta, Indonesia', // TODO: konfirmasi lokasi
  available: true,
  availableText: 'Terbuka untuk kerja sama',
  bio: [
    'Frontend developer yang suka memperhatikan detail sampai rapi. Sehari-hari memakai React, Next.js, dan Laravel untuk membangun sistem yang nyaman dipakai dan mudah dirawat.',
    'Buat aku, hasil yang baik itu bukan cuma jalan, tapi juga enak dilihat dan gampang dirawat. Aku senang mengurus hal-hal kecil yang sering kelewat, dari rapinya struktur kode sampai detail kecil di tampilan.',
  ],
  // Cutout transparan di public/profile.png (background sudah dihapus).
  photo: '/profile.png',
  initials: 'MA',
}

export const contact = {
  email: 'muhamadabelugm@gmail.com',
  github: { label: 'GitHub', handle: 'muhamadabel', url: 'https://github.com/muhamadabel' },
  linkedin: {
    label: 'LinkedIn',
    handle: 'Muhammad Abel Abhinaya',
    url: 'https://www.linkedin.com/in/muhammad-abel-abhinaya-riananto-944376326/',
  },
  instagram: { label: 'Instagram', handle: '@mhmmdabel._', url: 'https://instagram.com/mhmmdabel._' },
  cv: '/cv-muhammad-abel-abhinaya.pdf',
}

export const skills = [
  { group: 'Bahasa', items: ['JavaScript', 'TypeScript', 'PHP', 'Java'] },
  { group: 'Frontend', items: ['React', 'Next.js', 'Tailwind CSS'] },
  { group: 'Backend', items: ['Laravel', 'Node.js'] },
  { group: 'Tools & Testing', items: ['Git', 'Figma', 'Selenium', 'Cucumber'] },
]

export const projects = [
  {
    id: 'sia-ugn',
    title: 'SIA UGN',
    year: '2025',
    role: 'Frontend Developer',
    summary:
      'Sistem Informasi Akademik universitas, fokus di modul dosen seperti BKD, PAK, dan pengabdian.',
    description:
      'Membangun antarmuka modul dosen dengan React dan menyambungkannya ke backend Laravel lewat REST API. Fokusnya bikin alur isian yang panjang tetap terasa rapi dan nyaman diisi.',
    highlights: [
      'Modul dosen: BKD, PAK, dan pengabdian',
      'Integrasi REST API ke backend Laravel',
      'Form panjang dengan validasi dan alur yang jelas',
    ],
    tags: ['React', 'Laravel', 'REST API'],
    preview: ['#c2693f', '#7a2f1a'],
    live: 'https://sia.trisuladana.com/',
    repo: '',
  },
  {
    id: 'rongsokin',
    title: 'Rongsokin',
    year: '2025',
    role: 'Fullstack Developer',
    summary: 'Marketplace daur ulang sampah berbasis geolokasi, mempertemukan penjual sampah dengan pengepul.',
    description:
      'Membangun web marketplace dengan Next.js dan TypeScript: pencarian pengepul terdekat berbasis geolokasi, alur order, sampai console admin. Backend REST API dengan Prisma yang di-deploy di CapRover.',
    highlights: [
      'Pencarian pengepul berbasis geolokasi',
      'Next.js + TypeScript + Tailwind CSS',
      'Backend REST API dengan Prisma',
    ],
    tags: ['Next.js', 'TypeScript', 'Geolokasi'],
    preview: ['#4f9d6a', '#24503a'],
    live: 'https://rongsokin.vercel.app/',
    repo: 'https://github.com/muhamadabel/rongsokin-frontend',
  },
  {
    id: 'broilink',
    title: 'Broilink',
    year: '2025',
    role: 'Mobile Developer',
    summary: 'Aplikasi mobile Android native untuk manajemen peternakan ayam broiler.',
    description:
      'Aplikasi Android native dengan Kotlin untuk membantu peternak memantau dan mengelola kandang ayam broiler, dari pencatatan harian sampai ringkasan performa.',
    highlights: ['Android native dengan Kotlin', 'Pencatatan harian kandang', 'Ringkasan performa ternak'],
    tags: ['Kotlin', 'Android', 'Mobile'],
    preview: ['#c8a13a', '#6b4f16'],
    live: '',
    repo: 'https://github.com/muhamadabel/Broilinkmobile',
  },
  {
    id: 'e2e-testing',
    title: 'E2E Testing Suite',
    year: '2025',
    role: 'QA / Automation',
    summary: 'Automation testing untuk modul dosen pakai Java, Selenium, dan Cucumber.',
    description:
      'Menyusun pengujian end-to-end dengan pola Page Object Model supaya skenario tetap rapi dan gampang dirawat. Semua skenario berhasil lewat.',
    highlights: ['21 dari 21 skenario PASS', 'Pola Page Object Model', 'BDD dengan Cucumber'],
    tags: ['Java', 'Selenium', 'Cucumber'],
    preview: ['#3a3f4a', '#16181d'],
    live: '',
    repo: '',
  },
]

// Arsip repo open-source di GitHub (di luar karya pilihan di atas)
export const repos = [
  {
    name: 'rongsokin-frontend',
    desc: 'Marketplace daur ulang sampah berbasis geolokasi (penjual sampah ↔ pengepul).',
    lang: 'TypeScript',
    url: 'https://github.com/muhamadabel/rongsokin-frontend',
  },
  {
    name: 'be-rongsok.in',
    desc: 'Backend REST API Rongsokin: order, discovery pengepul, pencarian publik, admin console.',
    lang: 'JavaScript',
    url: 'https://github.com/muhamadabel/be-rongsok.in',
  },
  {
    name: 'somnia-fe',
    desc: 'Frontend project Somnia dengan TypeScript.',
    lang: 'TypeScript',
    url: 'https://github.com/muhamadabel/somnia-fe',
  },
  {
    name: 'desawatch',
    desc: 'Project monitoring desa dengan TypeScript.',
    lang: 'TypeScript',
    url: 'https://github.com/muhamadabel/desawatch',
  },
  {
    name: 'Broilinkmobile',
    desc: 'Aplikasi Android native untuk manajemen peternakan ayam broiler.',
    lang: 'Kotlin',
    url: 'https://github.com/muhamadabel/Broilinkmobile',
  },
  {
    name: 'Be-SIA-UGN-Kel1',
    desc: 'Backend SIA UGN: BKD/Angka Kredit, kegiatan mengajar, penelitian, presensi GPS, gaji.',
    lang: 'PHP',
    url: 'https://github.com/muhamadabel/Be-SIA-UGN-Kel1',
  },
  {
    name: 'Infraktrukstour-fe',
    desc: 'Frontend project infrastruktur tour.',
    lang: 'JavaScript',
    url: 'https://github.com/muhamadabel/Infraktrukstour-fe',
  },
  {
    name: 'PPPL-UAS',
    desc: 'Project UAS mata kuliah PPPL dengan Java.',
    lang: 'Java',
    url: 'https://github.com/muhamadabel/PPPL-UAS',
  },
]

export const education = {
  school: 'Universitas Gadjah Mada',
  program: 'Teknologi Rekayasa Perangkat Lunak',
  period: '2022 sampai sekarang', // TODO: konfirmasi tahun masuk
}

export const stats = [
  { value: '3+', label: 'Tahun ngoding' },
  { value: '40+', label: 'Repo di GitHub' },
  { value: '21', label: 'Skenario test PASS' },
]

// Penanda di navigasi dan urutan section
export const sections = [
  { id: 'home', label: 'Beranda' },
  { id: 'about', label: 'Tentang' },
  { id: 'skills', label: 'Keahlian' },
  { id: 'work', label: 'Karya' },
  { id: 'archive', label: 'Arsip' },
  { id: 'contact', label: 'Kontak' },
]
