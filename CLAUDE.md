# CLAUDE.md - Context & Guide for Claude Code

This file is automatically loaded by Claude Code when working in this repository. Read this completely before making any changes.

---

## 1. Project Overview & Identity

* **Project:** Muhammad Abel Abhinaya Riananto (Abel Abhinaya) Personal Portfolio & Interactive CV
* **Owner:** Abel (GitHub: `muhamadabel`)
* **Role:** Front End Developer & Software Engineer
* **Campus:** SV UGM, TRPL (Teknologi Rekayasa Perangkat Lunak) Class of 2024
* **Location:** Pandes RT02, Panggungharjo, Sewon, Bantul, D.I. Yogyakarta
* **Official Email:** `muhammadabelabhinaya@mail.ugm.ac.id` (Official UGM email, do NOT change to personal Gmail)
* **Phone / WA:** `08813798385`
* **Production URL:** `https://www.akuabel.my.id` (Vercel deployment)
* **Socials:**
  * GitHub: `https://github.com/muhamadabel`
  * LinkedIn: `https://www.linkedin.com/in/muhammad-abel-abhinaya-riananto-944376326/`
  * Instagram: `https://instagram.com/mhmmdabel._`
  * TikTok: `https://www.tiktok.com/@muhablee`

---

## 2. Dev Environment & Port Setup

* **Directory:** `/Users/user/Documents/abel work/porto/abel-portfolio`
* **Tech Stack:** React 19, Vite 8, Framer Motion 12, Lenis (smooth scroll)
* **Package Manager:** npm

### Essential Commands
* **Start Dev Server:** `npm run dev`
  * Runs Vite on **http://localhost:5173/** by default (or next available port e.g. 5174).
* **Build Check:** `npm run build`
  * Always run this after edits. Must build with 0 errors.
* **Preview Production Build:** `npm run preview`
  * Runs preview on **http://localhost:4173/**.

### Git & Deployment Remotes
There are **two active Git remotes** on branch `main`:
1. `origin`: `https://github.com/muhamadabel/abel-portfolio.git` (backup/portfolio repo)
2. `abel`: `https://github.com/muhamadabel/abel.git` (**PRODUCTION VERCEL REMOTE** for `akuabel.my.id`)

**Rule for Deployment:**
When the user asks to push / deploy, changes MUST be pushed to BOTH remotes:
```bash
git push origin main && git push abel main
```
Never push without verifying `npm run build` first.

---

## 3. Architecture & File Structure

```
abel-portfolio/
├── index.html                   # HTML root with data-theme="light"
├── package.json                 # Scripts & dependencies
├── CLAUDE.md                    # This instruction file for Claude Code
├── HANDOVER.md                  # Comprehensive handover & technical reference
├── public/
│   ├── avatar.png               # Transparent cartoon avatar for nav and preloader
│   ├── profile.png              # Formal photo with suit and tie
│   ├── cv-muhammad-abel-abhinaya.pdf # 1-page A4 ATS resume, printed from the #cv section (regenerate after editing content.js)
│   └── projects/
│       ├── simonev.png          # Screenshot Simonev Renaksi
│       ├── pemilwa.png          # Screenshot Pemilwa KMTEDI
│       ├── hongfilms.png        # Screenshot Hongfilms
│       ├── rongsokin.jpg        # Screenshot Rongsok.in
│       ├── somnia.jpg           # Screenshot Somnia
│       └── simpondok.jpg        # Screenshot Simpondok
└── src/
    ├── App.jsx                  # Main view orchestrating components
    ├── main.jsx                 # React DOM mount
    ├── data/
    │   └── content.js           # SINGLE SOURCE OF TRUTH (profile, projects, experience, skills, sections, UI copy)
    ├── lib/
    │   ├── motion.js            # Framer Motion transitions (springCard, stagger, ease)
    │   └── smoothScroll.js      # Lenis configuration
    ├── hooks/
    │   ├── useFocus.js          # Sibling hover/focus dimming logic
    │   └── useScrollSpy.js      # Active section observer
    ├── styles/
    │   └── global.css           # Monolithic CSS design tokens, typography, grid, responsive
    └── components/
        ├── Nav.jsx              # Top bar (transparent avatar, theme, Hubungi) + floating bottom dock pill
        ├── Preloader.jsx        # Circular progress preloader with avatar transition to nav
        ├── Hero.jsx             # Two-line condensed headline (Archivo) with four draggable floating stickers
        ├── TechMarquee.jsx      # Scroll-velocity skills ticker
        ├── Projects.jsx         # Dark project cards, 2-column grid on desktop (blurred backdrop, hover description, cursor chip)
        ├── Highlight.jsx        # Large achievement statement with project count on the side
        ├── DarkBlock.jsx        # Dark wrapper with curved top for About/Skills/Experience
        ├── About.jsx            # Photo on the left, scroll-lit word reveal paragraph + facts
        ├── Experience.jsx       # Three pricing-style cards: Organisasi, Pencapaian, Pendidikan
        ├── Skills.jsx           # Colored tilted draggable skill cards in one row, joined by a scroll-drawn line
        ├── CVPreview.jsx        # One-column ATS CV built from content.js (cv, projects, ...), download and print actions
        ├── Contact.jsx          # 'Say hello' giant text, email actions, link grid, local clock
        ├── Footer.jsx           # Wordmark, copyright, back to top
        ├── ThemeToggle.jsx      # Light/Dark mode toggle (default: Light)
        └── Magnetic.jsx         # Magnetic physics wrapper for buttons
```

---

## 4. Strict Non-Negotiable Rules (Anti-Slop)

1. **NO EM-DASH (`\u2014`):**
   * Never use the em-dash character anywhere in `.jsx`, `.js`, `.css`, or `.html`.
   * Use regular hyphen (`-`), middle dot (`·`), or comma.
   * Abel dislikes em-dashes as they look AI-generated.
2. **NO AI SLOP / CORPORATE BUZZWORDS:**
   * No generic AI fluff, no fabricated testimonials, no fake statistics ("10x developer", "99% satisfaction").
   * Keep copy punchy, technical, and direct ("jangan banyak omong").
3. **DEFAULT THEME IS LIGHT MODE:**
   * The website MUST open in pure Light Mode by default (`data-theme="light"` on `<html>`, fallback `light` in `ThemeToggle.jsx`). No dark flash on initial load.
4. **INTEGRITY OF `content.js`:**
   * Do not hardcode profile data or project lists inside components. Update `src/data/content.js`.
5. **CLICKABLE PROJECT CARDS:**
   * The entire card surface in `Projects.jsx` is wrapped in an `<a>` tag linking directly to the live URL. Users must not have to hunt for small "live" buttons.
6. **TRANSPARENT AVATAR:**
   * The avatar in the navbar and preloader uses `/avatar.png` with a completely transparent background (`background: transparent`). Never force a dark box behind it.
7. **MOBILE RESPONSIVENESS (390px):**
   * Always verify that `document.documentElement.scrollWidth <= innerWidth`. No horizontal overflow on mobile viewports.

---

## 5. Active Projects List (All 7 Verified Live)

1. **Desiltrace (2026)**
   * Category: Civic Platform | Role: Developer
   * Stack: Next.js, TypeScript, Tailwind CSS, PostgreSQL
   * Live: `https://desiltrace.web.id/`
   * Repo: `https://github.com/muhamadabel/desiltrace`
2. **Simonev Renaksi (2026)**
   * Category: Monitoring System | Role: Developer
   * Stack: Next.js, TypeScript, Prisma, NextAuth
   * Live: `https://simonev.site` (backup: `https://simonev-renaksi.vercel.app`)
   * Repo: `https://github.com/muhamadabel/simonev-renaksi`
3. **Pemilwa KMTEDI (2026)**
   * Category: Voting Platform | Role: Developer
   * Stack: JavaScript, Supabase, PostgreSQL, Nodemailer
   * Live: `https://kmtedi-pemilwa.vercel.app`
   * Repo: `https://github.com/muhamadabel/KMTEDI-Pemilwa`
4. **Hongfilms (2026)**
   * Category: Film Platform | Role: Developer
   * Stack: React, Next.js, Tailwind CSS, TypeScript
   * Live: `https://hongfilms.com`
5. **Rongsok.in (2026)**
   * Category: Web Platform | Role: Developer
   * Stack: Next.js, TypeScript, REST API, Tailwind
   * Live: `https://rongsokin.vercel.app/`
   * Repo: `https://github.com/muhamadabel/rongsokin-frontend`
6. **Somnia (2026)**
   * Category: Web Application | Role: Developer
   * Stack: Next.js, TypeScript, Tailwind CSS
   * Live: `https://www.somnia.page/`
7. **Simpondok (2025)**
   * Category: Management System | Role: Developer
   * Stack: Next.js, React, Tailwind CSS, REST API
   * Live: `https://simpondokk.vercel.app`

---

## 6. How Claude Should Approach Tasks

* **Step 1:** Run `git status` to check working tree.
* **Step 2:** Start or verify local dev server on port `5173` via `npm run dev`.
* **Step 3:** Make targeted edits. Focus on:
  * Elevating typography and layout hierarchy without adding text clutter.
  * Enhancing micro-interactions (magnetic feel, subtle parallax, smooth spring physics).
  * Ensuring zero mobile horizontal scroll.
* **Step 4:** Always run `npm run build` before reporting completion.
* **Step 5:** Keep local changes unpushed until Abel reviews and approves them.
