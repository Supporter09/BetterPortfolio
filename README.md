# RUNTIME — Personal Portfolio (Mai Van Nhat Minh)

> Cinematic storytelling + Cybersecurity precision + SRE systems resilience.

A production-grade, highly animated portfolio built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **GSAP ScrollTrigger**, and **Lenis smooth scroll**.

---

## 🚀 Quick Start

Ensure you have **Node.js 18+** (recommended: Node 20 or 22) installed.

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open browser
# Navigate to http://localhost:3000 (or http://localhost:3100 if port 3000 is occupied)
```

### Production Build & Typecheck

```bash
# Typecheck
npx tsc --noEmit

# Lint
npm run lint

# Production build
npm run build

# Start production server
npm start
```

---

## 📁 Project Structure

```text
├── app/                      # Next.js 16 App Router
│   ├── layout.tsx            # Root layout, inline boot script (motion tiers), chrome
│   ├── page.tsx              # Main home page composing 10 scenes in narrative sequence
│   ├── fonts.ts              # Geist, Geist Pixel, Geist Mono configuration
│   ├── globals.css           # Tailwind v4 theme, tokens, custom utilities (.hl neon, dither)
│   ├── work/[slug]/          # Dynamic case study pages (/work/pyvulds, /work/sre-release-automation, etc.)
│   ├── archive/              # Retrospective archive of 2020–2022 projects
│   ├── films/                # Travel & event film reels grid
│   └── not-found.tsx         # 404 "Scene not found" page
│
├── content/                  # ALL DATA & COPY LIVES HERE (Edit text without touching UI code)
│   ├── types.ts              # Shared TypeScript interfaces (Experience, ResearchEntry, Metric, Sprite...)
│   ├── site.ts               # Personal info, headline, bio, roles, contact links (LinkedIn, GitHub)
│   ├── scenes.ts             # 10 scene metadata & titles (Boot -> Opening -> Origin -> Timeline -> Research...)
│   ├── experience.ts         # Career timeline rows (HUST, Selfomy, FPT Smart Cloud, KAIST GPW, Hackathons)
│   ├── research.ts           # Research projects (PyVulDS staged pipeline, metrics, case study)
│   ├── work.ts               # Shipped work & hackathons (SRE release automation, Testeria, HSA, AnimalShelter)
│   ├── sprites.ts            # Pixel art bitmap data (Self 6 poses, cat Gạo, MacBook M4, Osmo Pocket 4, stars...)
│   ├── films.ts              # Film frames (selected real KAIST & travel frames)
│   ├── credits.ts            # Academic achievements & scholarships list with hover/focus/tap evidence previews
│   └── media.ts              # Media references (portrait, footage, thumbnails)
│
├── components/
│   ├── chrome/               # Global shell: HUD (ICT clock + avatar), TimecodeHUD, Command Palette (⌘K), Menu, Cursor
│   ├── scenes/               # 10 narrative scenes in order:
│   │   ├── cold-open/        # Scene 00: Diagnostic boot sequence & slate clap
│   │   ├── opening/          # Scene 01: Pixel universe (Minh 6 poses, Gạo, YouTube planet, M4, Osmo)
│   │   ├── origin/           # Scene 02: "A bit about me" & interactive dot-matrix portrait
│   │   ├── log/              # Scene 03: Year ruler timeline & energy cable power-up line
│   │   ├── pyvulds/          # Scene 04: Research showcase, typing beat, rack-focus 38->2 findings
│   │   ├── next-scene/       # Scene 05: "What I'm chasing next" pixel art direction cards
│   │   ├── reel/             # Scene 06: "Things I've shipped" horizontal pinned showcase
│   │   ├── field-notes/      # Scene 07: "When I'm not at a terminal" film strip with mousewheel scroll
│   │   ├── credits/          # Scene 08: "Achievements" awards & scholarships with floating evidence previews
│   │   └── closing/          # Scene 09: "Roll credits? Not yet." LinkedIn CTA & END OF RUNTIME
│   ├── ui/                   # Shared UI primitives:
│   │   ├── pixel-sprite.tsx  # Dynamic SVG pixel-art renderer with frame crossfading
│   │   ├── dither.tsx        # Canvas Bayer 4x4 dot-matrix dither with hover/tap reveal
│   │   ├── pixel-icon.tsx    # Crisp 12x12 bitmap icon system
│   │   ├── rich-text.tsx     # [[keyword]] neon highlighter & formatting
│   │   ├── status-badge.tsx  # Status badges (RELEASED, IN PRODUCTION, PRE-PRODUCTION)
│   │   ├── odometer-metric.tsx # Slot-machine odometer counters
│   │   └── media-frame.tsx   # Graded procedural footage / image frame
│   └── case/                 # 7-step case study chapter layout
│
├── lib/
│   ├── motion/               # Motion architecture: tiers (A/B/C), Lenis instance, useSceneMotion hook
│   └── utils.ts              # Tailwind merge with custom font-size support
│
├── public/
│   └── media/                # Static assets: avatar, portrait, films, work captures, evidence plates
│       ├── films/            # Selected real KAIST & travel frames (Daejeon, HUST return, barbecue, Hoi An)
│       ├── work/             # Shipped project captures (Testeria, HUST Smart Assistant, AnimalShelter)
│       └── evidence/         # Award & hackathon evidence plates (HSA, IAI Hackathon, Future Blue)
├── docs/                     # Full architecture & design system documentation
└── RefSource/                # Original reference images & assets provided by Minh
```

---

## 🛠 Tech Stack Details

- **Framework**: Next.js 16.3.8 (App Router, Turbopack, React Server Components by default)
- **Styling**: Tailwind CSS v4.3.3 (`@import "tailwindcss";` with CSS custom properties)
- **Motion & Smooth Scroll**: GSAP 3.15 + ScrollTrigger + Lenis 1.3 (dynamically loaded only in Tier A/B to protect initial JS payload)
- **Typography**: 
  - Display: **Geist** (500–600 weight, tight tracking)
  - Accent / Numbers: **Geist Pixel**
  - Code / Telemetry: **Geist Mono**
- **Accessibility**: Full keyboard navigation, `prefers-reduced-motion` Tier C support (instant readable states, no scroll-jacking), WCAG AA color contrast verified.
