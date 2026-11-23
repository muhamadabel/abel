# AGENT BRIEF: ABEL ABHINAYA PORTFOLIO

Panduan onboard untuk AI coding agent (Claude Code, Antigravity, Cursor, Windsurf, Copilot Workspace) yang mengerjakan portfolio ini.

**Batas tugasmu:** edit dan verifikasi di lokal saja. Push ke GitHub dan deploy production adalah tugas Hermes, bukan tugasmu.

**Konteks penting:** working tree lokal ini adalah salinan persis dari yang sedang live di `https://www.akuabel.my.id` (bundle build lokal dan live identik). Abel akan merombak desain dari sini. Tugasmu menambah atau memperbaiki, **bukan** mengubah data identitas dan tautan yang sudah ada dan sudah dipakai di hosting, kecuali diminta eksplisit.

---

## 0. Data Identitas yang Dikunci

Jangan ubah nilai berikut tanpa instruksi eksplisit dari Abel. Nilainya harus tetap sama dengan yang sedang live:

| Field | Nilai terkunci |
|---|---|
| `profile.name` | Muhammad Abel Abhinaya Riananto |
| `profile.display` | Abel Abhinaya |
| `profile.role` | Software Engineer |
| `profile.institution` / `major` / `cohort` | Universitas Gadjah Mada / TRPL / 2024 |
| `contact.email` | `muhammadabelabhinaya@mail.ugm.ac.id` |
| `contact.phone` | `08813798385` |
| `contact.github.url` | `https://github.com/muhamadabel` |
| `contact.linkedin.url` | `https://www.linkedin.com/in/muhammad-abel-abhinaya-riananto-944376326/` |
| `contact.instagram.url` | `https://instagram.com/mhmmdabel._` |
| `contact.tiktok.url` | `https://www.tiktok.com/@muhablee` |
| `contact.formEndpoint` | endpoint FormSubmit yang sudah aktif |

Kalau kamu menemukan versi lain dari data ini di internet atau di dokumen lain, **jangan ganti sendiri**. Laporkan sebagai catatan di laporan akhir, biar Abel yang memutuskan.

---

## 1. Lingkungan Lokal

| Item | Nilai |
|---|---|
| Direktori proyek | `/Users/user/Documents/abel work/porto/abel-portfolio` |
| Stack | React 19, Vite 8, Framer Motion 12, Lenis |
| Node / npm | v26.7.0 / 11.19.0 |
| Dev server | `npm run dev` lalu buka `http://localhost:5173/` |
| Build check | `npm run build` (wajib 0 error sebelum lapor selesai) |
| Preview build | `npm run preview` lalu buka `http://localhost:4173/` |

Kalau port 5173 sudah dipakai proses lain, jalankan `npm run dev -- --port 5174` dan sebutkan port yang kamu pakai di laporan akhir.

---

## 2. Aturan Git: LOKAL SAJA

Dilarang menjalankan perintah yang mengubah state remote:

* `git push` (semua bentuk: `origin`, `abel`, `portofun`)
* `git commit` ke branch `main`
* `gh pr create`, `gh pr merge`, `gh release create`
* `vercel deploy`, `vercel --prod`, atau `npx vercel` apa pun

Yang **boleh** dan **disarankan**:

* `git status`, `git diff`, `git log` untuk memahami keadaan
* Edit file langsung di working tree
* `git checkout -b <nama-branch>` untuk kerja terisolasi (opsional, jangan commit ke `main`)
* Jalankan dev server dan browser untuk verifikasi visual

**Kalau kamu merasa butuh commit:** jangan. Tinggalkan perubahan di working tree, lalu laporkan daftar file yang berubah. Hermes yang akan review, commit, push ke dua remote (`origin` dan `abel`), dan memicu deploy Vercel ke `https://www.akuabel.my.id`.

**Jangan pernah** menjalankan `git restore .`, `git clean -f`, `git reset --hard`, atau `git stash` tanpa izin. Working tree bisa berisi pekerjaan yang belum di-commit.

---

## 3. Aturan Desain (Wajib)

1. **Tanpa em-dash.** Karakter em-dash (U+2014) dilarang di `.jsx`, `.js`, `.css`, `.html`, `.md`. Pakai `-`, `·`, `:`, atau koma. Audit sebelum lapor:
   ```bash
   python3 -c "from pathlib import Path; print([str(p) for p in Path('src').rglob('*') if p.is_file() and p.suffix in {'.jsx','.js','.css'} and '\u2014' in p.read_text(errors='ignore')])"
   ```
2. **Tanpa AI slop.** Dilarang badge status klise (pill hijau "Available for work", "Terbuka Diskusi"), label kapital dengan ikon ("KOTAK PESAN LANGSUNG"), slogan kosong, statistik karangan, testimoni fiktif, atau paragraf buzzword. Teks pendek, faktual, langsung.
3. **Light mode default.** `<html data-theme="light">` di `index.html` dan fallback `light` di `ThemeToggle.jsx`. Jangan ubah jadi dark default.
4. **Tanpa blur filter.** Jangan pakai `filter: blur(...)` untuk reveal animasi atau dimming elemen saudara. Pakai opacity dan transform.
5. **Data terpusat.** Semua teks profil, proyek, organisasi, edukasi, skill ada di `src/data/content.js`. Komponen hanya membaca data, jangan hardcode string konten.
6. **Hero tetap bersih.** H1 murni "Abel Abhinaya". Tanpa tagline tambahan, tanpa status pill.
7. **Kartu proyek = carousel horizontal.** Track geser kanan-kiri dengan `scroll-snap`, bukan tumpukan vertikal. Seluruh permukaan kartu adalah `<a>` ke URL live.
8. **Kontak = satu textarea.** Form pesan hanya punya kolom Pesan, tombol salin email, dan tombol kirim. Jangan tambah input Nama/Email/WhatsApp.
9. **Mobile tidak boleh overflow.** Verifikasi `document.documentElement.scrollWidth <= window.innerWidth` di lebar 390px.
10. **Hormati `prefers-reduced-motion`** untuk semua efek pointer dan scroll.

---

## 4. Peta File

```
index.html                  Root HTML, font preconnect, meta, data-theme
src/main.jsx                Entry React
src/App.jsx                 Orkestrasi: Preloader, Nav, Hero, TechMarquee,
                            Projects, Experience, Skills, CVPreview, Contact,
                            Footer, Cursor
src/data/content.js         SUMBER DATA TUNGGAL
                            (profile, contact, education, organizations,
                            achievements, projects, skills, repos, sections)
src/styles/global.css       Design token + seluruh styling (satu file)
src/lib/motion.js           Preset Framer Motion (ease, spring*, stagger, reveal)
src/lib/smoothScroll.js     Konfigurasi Lenis + scrollTo()
src/hooks/useFocus.js       Dimming elemen saudara saat hover
src/hooks/useScrollSpy.js   Section aktif untuk nav
src/components/
  Preloader.jsx             Loading karakter bulat, lalu terbang ke avatar nav
  Nav.jsx                   Header sticky, avatar transparan, menu mobile
  Hero.jsx                  Judul raksasa + 4 floating cards + GridField
  TechMarquee.jsx           Ticker skill
  Projects.jsx              Carousel proyek (drag, snap, tombol, dot)
  Experience.jsx            Timeline organisasi + edukasi + award
  Skills.jsx                Chip skill (proximity highlight)
  CVPreview.jsx             Kartu unduh CV
  Contact.jsx               Direct inbox (textarea + FormSubmit AJAX)
  Footer.jsx                Wordmark raksasa + GridField
  Cursor.jsx                Bubble label kursor via data-cursor
  SectionHead.jsx           Header section konsisten
  SplitText.jsx             Reveal per kata/huruf
  Magnetic.jsx              Efek magnet tombol
  Toast.jsx                 Notifikasi salin
  ThemeToggle.jsx           Switch tema
  fx/GridField.jsx          Canvas grid interaktif (lensa + riak klik)
  fx/Spotlight.jsx          Spotlight pointer di thumbnail proyek
  fx/ScrambleText.jsx       Efek scramble saat hover
  fx/useProximity.js        Kalkulasi jarak kursor untuk tipografi
public/
  profile.png               Foto formal
  avatar.png                Karakter transparan (nav + preloader)
  cv-muhammad-abel-abhinaya.pdf   CV ATS 1 halaman untuk diunduh
  projects/*.jpg|png        Screenshot 1440x900 per proyek
```

---

## 5. Menambah atau Mengubah Proyek

1. Ambil screenshot bersih 1440x900 (viewport, `networkidle`) ke `public/projects/<id>.jpg` atau `.png`.
2. Sisipkan objek baru di array `projects` pada `src/data/content.js`:
   ```js
   {
     id: 'nama-slug',
     num: '09',
     title: 'Nama Proyek',
     year: '2026',
     category: 'Web Application',
     role: 'Developer',
     desc: 'Satu sampai dua kalimat faktual.',
     stack: ['Next.js', 'TypeScript'],
     live: 'https://contoh.com',
     image: '/projects/nama-slug.jpg',
     tint: '#0e5e3a',
     repo: 'https://github.com/muhamadabel/repo',
     isPrivate: false,
   }
   ```
3. Renomori `num` semua item agar unik dan berurutan (`01`..`0N`).
4. `tint` = warna aksen dominan dari website aslinya, dipakai sebagai panel lembut kartu.
5. Verifikasi URL live dan repo benar-benar aktif sebelum lapor. Jangan mengarang stack atau deskripsi.
6. Jika jumlah proyek berubah, perbarui juga penyebut di `AGENT_BRIEF.md` dan `CLAUDE.md`. **Jangan** mengedit `CLAUDE.md` tanpa izin eksplisit Abel (file instruksi agent yang dilindungi).

---

## 6. Alur Kerja yang Diharapkan

1. `git status --short` dulu. Kalau ada perubahan yang bukan milikmu, jangan sentuh.
2. Baca file target sebelum mengedit. Untuk styling, hampir semua ada di `src/styles/global.css`; cari selector `.hero`, `.pcard`, `.xp`, `.inbox`, `.section--` dulu.
3. Untuk konten, edit `src/data/content.js`. Untuk perilaku, edit komponennya.
4. Jalankan `npm run dev`, buka `http://localhost:5173/`, cek desktop (1440) dan mobile (390).
5. Jalankan `npm run build`. Wajib 0 error dan 0 warning baru.
6. Audit em-dash (perintah di bagian 3).
7. Lapor tanpa commit dan tanpa push.

---

## 7. Format Laporan Akhir

```
RINGKASAN
- apa yang diubah dan alasannya (1-2 baris per perubahan)

FILE BERUBAH
- path/to/file: alasan

VERIFIKASI
- npm run build: PASS / FAIL (tempel error kalau FAIL)
- em-dash audit: 0 temuan / ada temuan di <file>
- desktop 1440px: OK
- mobile 390px: OK, tanpa horizontal overflow
- interaksi yang dicoba: <daftar: klik, hover, scroll, kirim form, toggle tema>

BELUM DIKERJAKAN / CATATAN
- hal yang butuh keputusan Abel
```

Setelah laporan diterima, Hermes yang menjalankan review, commit, push ke `origin` dan `abel`, lalu memverifikasi deploy di `https://www.akuabel.my.id`.

---

## 8. Larangan Cepat

| Jangan | Kenapa |
|---|---|
| `git push` / `git commit -m` ke `main` | Deploy hanya lewat Hermes |
| `vercel deploy` | Bisa menimpa production |
| `git reset --hard` / `git clean -f` / `git restore .` | Menghapus pekerjaan yang belum di-commit |
| Em-dash (U+2014) | Aturan keras anti-slop |
| Blur filter untuk reveal | Bikin halaman terlihat kabur dan berat |
| Hardcode teks di JSX | Data harus di `content.js` |
| Badge status klise / heading kapital berikon | AI slop |
| Input Nama/Email di form kontak | Form sengaja satu textarea |
| Menambah dependensi baru | Tanyakan dulu ke Abel |
| Mengedit `CLAUDE.md` tanpa izin | File instruksi agent yang dilindungi |
