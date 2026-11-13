# AGENT BRIEF: ABEL ABHINAYA PORTFOLIO

Panduan onboard instan untuk AI coding agent (Claude, Antigravity, Cursor, Windsurf, dll.) yang melakukan perbaikan frontend secara lokal.

---

## 1. Lingkungan & Port Lokal

* **Direktori Proyek:** `/Users/user/Documents/abel work/porto/abel-portfolio`
* **Dev Server:** `http://localhost:5173/` (jalankan via `npm run dev`)
* **Build Check:** `npm run build` (wajib 0 error setiap selesai mengubah kode)
* **Stack:** React 19, Vite 8, Framer Motion 12, Lenis smooth scroll
* **PENTING TENTANG GIT PUSH:**
  * **JANGAN LAKUKAN GIT PUSH KE REMOTE APAPUN.**
  * Kerjakan semua modifikasi styling/FE secara lokal saja.
  * Hermes yang akan melakukan final review, audit em-dash, dan deploy ke production (`https://www.akuabel.my.id`).

---

## 2. Karakter Desain & Aturan Anti-Slop (Wajib Dipatuhi)

1. **MINIMALIS & JANGAN BANYAK OMONG:**
   * Abel menyukai landing page yang sangat bersih: sedikit section, teks pendek, whitespace luas.
   * Dilarang menambah kata-kata berbunga, badge status klise (misal badge titik hijau "Terbuka Diskusi", "Available for work", atau copywriting generic AI lainnya).
2. **LARANGAN KERAS EM-DASH (`\u2014`):**
   * DILARANG memakai karakter em-dash di file `.jsx`, `.js`, `.css`, atau `.html`.
   * Gunakan tanda minus biasa (`-`), titik tengah (`·`), atau koma.
3. **DEFAULT TEMA: LIGHT MODE:**
   * Default tampilan awal wajib Light Mode (`data-theme="light"` di HTML).
4. **INTEGRITAS DATA:**
   * Seluruh teks profil, proyek, dan pengalaman tersimpan di `src/data/content.js`. Jangan hardcode data di komponen JSX.

---

## 3. Struktur Section Saat Ini

1. **Hero (`src/components/Hero.jsx`):**
   * Judul utama H1 murni: **Abel Abhinaya** (tanpa tagline tambahan).
   * Subjudul: `Software Engineer. TRPL Universitas Gadjah Mada, angkatan 2024.`
   * Tidak ada badge status pill di atas nama.
   * Dikelilingi 4 floating cards (Proyek, Keahlian, Organisasi, Pencapaian) dengan mouse tilt.
2. **Projects (`src/components/Projects.jsx`):**
   * Format **Horizontal Carousel Slider** (geser kanan-kiri), bukan kartu bertumpuk ke bawah.
   * Kartu clean tanpa frame/border: thumbnail di panel warna lembut (field `tint` per proyek di `content.js`), screenshot terpotong di bawah, lalu kategori · tahun, judul, deskripsi 2 baris, stack teks biasa (tanpa chip), link GitHub kecil.
   * Seluruh kartu adalah link ke live URL.
   * 7 Proyek aktif: Desiltrace, Simonev Renaksi, Pemilwa KMTEDI, Hongfilms, Rongsok.in, Somnia, Simpondok.
3. **Experience & Skills (`Experience.jsx`, `Skills.jsx`):**
   * Organisasi TRPL UGM, Al-Alim, KMTEDI, dan OLIVIA award.
   * Chip skill terbagi dalam 4 kategori.
4. **Contact (`src/components/Contact.jsx`):**
   * Kotak pesan langsung simpel: hanya kolom **Pesan** (textarea) + tombol salin email dan tombol **Kirim Pesan ↗**.
   * Tidak menggunakan input Nama atau Email/WhatsApp.

---

## 4. Alur Kerja Agent

1. Buka file target (misal `src/styles/global.css` atau komponen terkait di `src/components/`).
2. Periksa tampilan di browser lokal: `http://localhost:5173/`.
3. Jalankan `npm run build` untuk memverifikasi tidak ada error sintaks/bundle.
4. Sampaikan hasil perubahan lokal kepada Abel tanpa melakukan git commit/push.
