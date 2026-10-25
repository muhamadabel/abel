# PROJECT HANDOVER & AGENT CONTEXT: ABEL ABHINAYA PORTFOLIO

Dokumen ini adalah instruksi handover lengkap untuk agen AI / developer selanjutnya. Baca seluruh dokumen ini sebelum menjalankan perubahan apa pun.

---

## 1. IKHTISAR PROYEK & IDENTITAS

* **Nama Lengkap:** Muhammad Abel Abhinaya Riananto (Abel Abhinaya)
* **Peran:** Front End Developer & Software Engineer
* **Institusi:** Universitas Gadjah Mada (UGM) - Sekolah Vokasi
* **Program Studi:** Teknologi Rekayasa Perangkat Lunak (TRPL), Angkatan 2024 (S.Tr.Kom)
* **Domisili:** Pandes RT02, Panggungharjo, Sewon, Bantul, D.I. Yogyakarta
* **Kontak Resmi:**
  * Email: `muhammadabelabhinaya@mail.ugm.ac.id`
  * Telepon / WhatsApp: `08813798385`
  * GitHub: `https://github.com/muhamadabel` (handle: `muhamadabel`)
  * LinkedIn: `https://www.linkedin.com/in/muhammad-abel-abhinaya-riananto-944376326/`
  * Instagram: `https://instagram.com/mhmmdabel._` (`@mhmmdabel._`)
  * TikTok: `https://www.tiktok.com/@muhablee` (`@muhablee`)

---

## 2. LOKASI PROYEK & LINGKUNGAN PENGEMBANGAN

* **Direktori Lokal:** `/Users/user/Documents/abel work/porto/abel-portfolio`
* **Node.js:** v26.7.0 | **npm:** 11.19.0 | **Vite:** 8.1.0 | **React:** 19.2.7
* **Git Repository & Remote:**
  * Branch aktif: `main`
  * Remote `origin`: `https://github.com/muhamadabel/abel-portfolio.git`
  * Remote `abel`: `https://github.com/muhamadabel/abel.git`
  * Akun GitHub aktif CLI: `muhamadabel` (dapat dicek via `gh auth status`)
* **Perintah Operasional:**
  * Install dependensi: `npm install`
  * Jalankan dev server: `npm run dev`
  * Build produksi: `npm run build` (wajib 0 error sebelum push)
  * Jalankan preview build: `npx vite preview --port 4173`

---

## 3. ARSITEKTUR & STRUKTUR FILE

```
abel-portfolio/
├── index.html                   <- Root HTML, data-theme="light", meta tags
├── package.json                 <- Dependencies (React 19, Framer Motion 12, Lenis)
├── public/
│   ├── profile.png              <- Foto profil formal jas hitam + dasi
│   ├── cv-muhammad-abel-abhinaya.pdf <- Berkas CV asli 1 halaman A4 untuk download
│   └── favicon.svg
├── src/
│   ├── App.jsx                  <- Root orchestrator: Nav, Hero, Marquee, Projects, Experience, Skills, CV, Contact, Footer
│   ├── main.jsx                 <- React entry
│   ├── data/
│   │   └── content.js           <- SATU-SATUNYA SUMBER DATA (profil, kontak, edukasi, organisasi, proyek, skills)
│   ├── lib/
│   │   ├── motion.js            <- Preset animasi Framer Motion (springCard, springTilt, stagger, wordReveal)
│   │   └── smoothScroll.js      <- Konfigurasi Lenis Smooth Scroll
│   ├── hooks/
│   │   └── useScrollSpy.js      <- Active section spy & scroll listener
│   ├── styles/
│   │   └── global.css           <- Design system monolitik (Apple token palette + Hallojanu spring motion)
│   └── components/
│       ├── Nav.jsx              <- Header sticky, glassmorphism blur, layoutId indicator
│       ├── Hero.jsx             <- 4 Floating Cards dengan 3D mouse tilt, split text entrance, live pill
│       ├── TechMarquee.jsx      <- Infinite running text banner (skills ticker)
│       ├── Projects.jsx         <- 4 Kartu proyek (klik kartu langsung buka web proyek)
│       ├── Experience.jsx       <- Timeline organisasi, mikat, kewirausahaan, kastrad dengan sibling dimming
│       ├── Skills.jsx           <- Grid 4 kategori skill chips
│       ├── CVPreview.jsx        <- Preview lembar CV + tombol Unduh PDF / Cetak / Share
│       ├── Contact.jsx          <- Email link, tombol kirim/salin, grid 5 medsos (GitHub, LinkedIn, IG, TikTok, Phone)
│       ├── Footer.jsx           <- Minimalist footer
│       ├── ThemeToggle.jsx      <- Dark/Light switch (default light mode)
│       ├── SectionHead.jsx      <- Format kicker [0X / LABEL] seragam
│       ├── Magnetic.jsx         <- Magnetic button physics wrapper
│       ├── Toast.jsx            <- Floating notification saat salin email/link
│       └── Preloader.jsx        <- Counter entrance preloader
```

---

## 4. ATURAN KERAS (NON-NEGOTIABLE RULES)

1. **JANGAN AI SLOP:**
   * Dilarang menambahkan paragraf motivasi klise, statistik buatan, testimoni palsu, atau kata-kata berbunga-bunga.
   * Semua teks harus berbasis data teknis nyata, ringkas, berbobot, dan to-the-point.
2. **LARANGAN EM-DASH:**
   * DILARANG menggunakan karakter em-dash Unicode `\u2014` di seluruh file kode (`.jsx`, `.js`, `.css`, `.html`).
   * Gunakan tanda minus/hyphen biasa (`-`), titik tengah (`·`), atau koma. Selalu audit via python/grep sebelum commit.
3. **DEFAULT TEMA: LIGHT MODE:**
   * Pengunjung baru wajib disajikan tampilan **Light Mode** secara default (`data-theme="light"` di HTML dan fallback `light` di `ThemeToggle.jsx`).
4. **INTEGRITAS DATA:**
   * Seluruh teks komponen wajib mengambil dari `src/data/content.js`. Jangan hardcode data profil di dalam komponen JSX.
5. **KARTU PROYEK WAJIB KLIK LANGSUNG:**
   * Seluruh permukaan kartu proyek di `Projects.jsx` adalah link langsung (`<a>`) menuju URL live masing-masing proyek. Pengunjung tidak perlu mencari tombol kecil untuk membuka web.

---

## 5. DATA PROYEK AKTIF & TAUTAN LIVE

| No | Nama Proyek | Kategori | Tech Stack | URL Live |
|---|---|---|---|---|
| 01 | **Hongfilms** | Film Platform | React, Next.js, Tailwind CSS, TypeScript | `https://hongfilms.com` |
| 02 | **Rongsok.in** | Web Platform | Next.js, TypeScript, REST API, Tailwind | `https://rongsokin.vercel.app/` |
| 03 | **Somnia** | Web Application | Next.js, TypeScript, Tailwind CSS | `https://www.somnia.page/` |
| 04 | **Simpondok** | Management System | Next.js, React, Tailwind CSS, REST API | `https://simpondokk.vercel.app` |

---

## 6. DATA ORGANISASI & PENCAPAIAN DI CV

* **ASSETS TRPL SV UGM:**
  * Posisi: Staff Minat dan Bakat (Mikat) (1 Tahun)
  * Deskripsi: Merancang serta mengeksekusi program kerja pengembangan potensi, minat, dan bakat mahasiswa TRPL di bidang akademik maupun non-akademik. Mengoordinasikan partisipasi mahasiswa dalam berbagai kompetisi, delegasi, dan kegiatan internal program studi.
* **Jamaah Vokasi Al-Alim SV UGM:**
  * Posisi: Staff Divisi Kewirausahaan (1 Tahun)
  * Deskripsi: Mengelola penggalangan dana mandiri (fundraising) dan penjualan merchandise/produk kreatif guna menunjang operasional organisasi. Menyusun strategi pemasaran berkala, pencatatan arus kas operasional, dan pengelolaan inventaris logistik penjualan.
* **KMTEDI SV UGM:**
  * Posisi: Staff Kajian & Aksi Strategis (Kastrad) (2 Tahun, 2024 - Sekarang)
  * Deskripsi: Mengawal advokasi akademik dan kajian kebijakan strategis kemahasiswaan Departemen Teknik Elektro dan Informatika SV UGM serta memfasilitasi aspirasi mahasiswa.
* **Pencapaian:**
  * Juara Harapan 2 - Web Development, Olimpiade Vokasi Nasional (OLIVIA 2026), Universitas Negeri Surabaya (UNESA).

---

## 7. BERKAS DAN GENERATOR CV PDF (STANDAR JANUARSYAH AKBAR)

CV dibuat 1 halaman A4 presisi bergaya Januarsyah Akbar (asymmetric navy corner polygons, serif display name, sans-serif body, timeline nodes, 10-dot skill rating).
* **Lokasi file PDF siap unduh:**
  * `/Users/user/Documents/abel work/porto/abel-portfolio/public/cv-muhammad-abel-abhinaya.pdf`
  * `/Users/user/Downloads/CV - Muhammad Abel Abhinaya.pdf`
  * `/Users/user/Documents/CV - Muhammad Abel Abhinaya.pdf`
* **Cara generate ulang PDF:**
  Gunakan Puppeteer via Node.js dengan environment `NODE_PATH=/tmp/node_modules node <script.js>` untuk mengonversi template HTML ke PDF A4 `printBackground: true`, margin `0`.

---

## 8. STATUS DEPLOYMENT & SETUP DOMAIN VERCEL

* Proyek terhubung dengan Vercel melalui integrasi GitHub.
* Setiap kali melakukan `git push origin main` dan `git push abel main`, Vercel otomatis melakukan deployment ulang.
* **Konfigurasi DNS Domain Baru di Registrar/DNS Manager:**
  * **A Record (Root / `@`):**
    * Name: `@`
    * Type: `A`
    * Value/Address: `76.76.21.21` (IP resmi Vercel Anycast)
    * *(PENTING: Jangan gunakan IP default/parking registrar seperti 216.198.79.1)*
  * **CNAME Record (Subdomain `www`):**
    * Name: `www`
    * Type: `CNAME`
    * Value/Target: CNAME yang diberikan dashboard Vercel (misal: `fef7c5e7356cdf8d.vercel-dns-017.com` atau `cname.vercel-dns.com`)

---

## 9. CONTOH PROMPT UNTUK MEMULAI DI SESI AGENT BARU

Salin teks di bawah ini ke agent baru untuk langsung melanjutkan pekerjaan tanpa pengulangan:

```text
Halo, aku sedang melanjutkan proyek portofolio Muhammad Abel Abhinaya di direktori:
/Users/user/Documents/abel work/porto/abel-portfolio

Silakan baca file HANDOVER.md yang ada di root direktori proyek tersebut sebagai sumber kebenaran utama (single source of truth).
Di sana sudah lengkap data profil, proyek (Hongfilms, Rongsok.in, Somnia, Simpondok), konfigurasi tema Light Mode default, aturan anti-slop, larangan karakter em-dash, serta konfigurasi DNS Vercel.

Tolong periksa status git (git status), jalankan build check (npm run build), dan bantu aku melanjutkan task berikutnya.
```
