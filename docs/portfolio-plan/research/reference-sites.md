# Reference Sites Architecture & Interaction Study

**Subject:** Comprehensive Technical & Interaction Analysis of Bryan Garage, Curtis Designr, and Eddy Naboulet OS  
**Target Portfolio Profile:** Mai Van Nhat Minh (Cyber Security undergrad at HUST, Software Engineer at Selfomy, ex DevOps/SRE intern at FPT Smart Cloud, PyVulDS security researcher, KAIST Global Preview Week 2026, hobbyist travel filmmaker)  
**Design Objective:** Cinematic storytelling + Cybersecurity precision + SRE smoothness/efficiency  

---

## 1. Bryan Garage (`https://bryangarage.dev/`)
*Bryan Oh · Senior Product Designer · AI Garage*

### 1. Stack Signals
- **Core Framework:** Next.js (App Router, Turbopack build artifact `turbopack-0qc8ixp04xyn_.js`).
- **Animation & Motion Engines:**
  - `GSAP` & `ScrollTrigger`: Bundled in chunk `0phwm66~htpf5.js` (573 KB). Used for timeline scrubbing and section reveals.
  - `Framer Motion`: Bundled in chunks `17rw0~s67klyo.js` (71 KB) and `02.8ib6v25ajo.js` (67 KB). Used for UI springs and layout transitions.
- **3D & Canvas Rendering:**
  - `Three.js` (WebGL2): Bundled across chunks `04~1cmezp9-57.js` (716 KB) and `0x-7qd5qe584d.js` (235 KB).
  - Canvas Elements: 10 WebGL2 context canvases for interactive product shaders and 2 Canvas 2D contexts (`gt-boothint-px`, `gsb-pixels`).
  - Native Video Stream: `/ascii-canyon.mp4` with poster `/ascii-canyon-poster.jpg` rendered in `.garage-ascii-video`.
- **Keyboard / Utility Libraries:**
  - `cmdk` (Command Palette): Bundled in chunk `0ydj-vb_wt3e7.js` (67 KB) powering the `⌘K` modal.
- **Analytics & Settings:** Google Analytics (`gtag/js?id=G-LQJ0VW673X`), inline pre-render script for `localStorage.getItem('theme')`.

### 2. Section Order & Information Architecture; Nav Pattern; Intro/Loader
- **Intro / Loader:**
  - Instant paint with dark background (`#141414`), no blocking splash loader screen.
  - Root class applies `gt-crt-warp` for simulated CRT monitor barrel distortion.
- **Navigation Pattern:**
  - Minimal sticky top header (`header.hdr`): Left trigger: "Jump to ⌘K" (`.hdr-cmd` opening `cmdk`). Right trigger: "> _" terminal toggle button (`.hdr-terminal`) controlling a floating draggable/dockable retro CLI window.
  - Live local/visitor time ticker: `11:32:05 PM · ASIA/SAIGON`.
- **Section Order:**
  1. **Sticky Header (`header.hdr`):** `⌘K` Command launcher + CLI terminal toggle.
  2. **Intro Hero (`section.garage-intro`):** Identity, biography, philosophy (*"software is the most malleable medium we have..."*), live timezone clock, quick CTAs.
  3. **ASCII Ambient Media Band (`section.garage-ascii`):** Full-bleed looping ASCII canyon video (`/ascii-canyon.mp4`).
  4. **Work Timeline (`section.tl`, `aria-label="Work timeline"`):** Horizontal year ruler (2016 to 2028) mapping career tenure (Google, BMW, Volkswagen, Apple via EPAM).
  5. **Experiment Grid (`main.garage-grid`):** Modular card grid of numbered projects:
     - `03 TOOL · NPM PACKAGE PixelAgent` (live DOM layer)
     - `02 PROTOTYPE · IOS Aura` (MeshGradient voice UI)
     - `01 PROTOTYPE · IOS Core Motion` (gyroscope compass dial)
     - Placeholder upcoming slots (`? ? ? ?`, `.garage-cell--soon`, `.garage-cell--void`).
  6. **Personal Film Strip Band (`section.personal-band`):** Photographic film roll negative frames (`00A`, `01A`, `02A Morro Bay`, GPS coordinates `37°17'N 121°57'W · 10:30`, `37°15'N 121°57'W · 16:45`), *"swipe · tap to develop"*.
  7. **Floating Terminal CLI Window (`div.gt-window`):** Draggable/dockable retro terminal (*"Garage CLI v1.8 [play] click to play, press any key or click to boot"*), featuring CRT phosphor tube color knob switcher.

### 3. Typography, Color Palette, Grid/Layout, Whitespace
- **Typography:**
  - Body / UI: `GeistSans` (`--sans: "GeistSans", sans-serif`, 15px - 16px, line-height 1.5).
  - Code / Terminal: `GeistMono` & `Nanum Gothic Coding` (`--font-sticky-type`, 12px - 14px).
  - Editorial Accent: `Instrument Serif` (`--serif: "Instrument Serif", serif`, 40px - 50px headings).
  - Handwritten / Annotation: `Nanum Pen Script`, `Nanum Brush Script`, `Gaegu` (for sticky notes and quick margin annotations).
- **Color Palette (Hex):**
  - Backgrounds: `#141414` (root background), `#191919` (`--bg2`), `#0A0A0A` (`--btn-p-fg`).
  - Text: `#FFFFFF` (primary), `#DADBDF` (body secondary), `#858990` (`--tt-aa` muted text).
  - Accents: `#FFC285` (`--st`, `--ac-soft` warm peach/amber), `#B8540F` (`--sel` burnt orange selection).
  - VS Code Syntax Highlighting Tokens:
    - `--syn-kw: #569CD6` (keyword blue)
    - `--syn-cm: #6A9955` (comment green)
    - `--syn-op: #D4D4D4` (operator light gray)
    - `--syn-flag: #4EC9B0` (type/class cyan)
    - `--syn-comp: #4FC1FF` (component cyan-blue)
  - Architectural Borders: `#212327` (`--border`).
  - Warm Hardware Surfaces: `#ECE8E0` (`--gt-wall-lit`), `#E2DDD3` (`--gt-wall`).
- **Grid, Layout & Whitespace:**
  - CSS Clamp structural gutters: `--garage-content-x: calc(2 * clamp(28px, 5vw, 56px) + 1px)`.
  - Crisp hair-line cell borders (`#212327`) defining card compartments.

### 4. Signature Interactions & Motion
- **CRT Tube Shader & Distortion:** Global `gt-crt-warp` root class coupled with canvas screen filters.
- **Draggable Interactive Terminal:** Floating window that boots on interaction, renders simulated command responses, and features physical hardware knobs for switching CRT phosphor tones.
- **ASCII Video Pipeline:** Video-to-ASCII shader/playback giving high-aesthetic cyber texture with minimal GPU draw call overhead.
- **Film Roll Strip:** Tactile negative film roll cards showing frame counters (`00A`, `01A`), GPS coordinates, and timestamps.
- **Global Command Palette:** Native `⌘K` listener providing keyboard navigation.
- **Reduced Motion:** Verified to suppress heavy canvas loops and transform triggers when `prefers-reduced-motion` is active.

### 5. Mobile & Responsive Behavior (Evaluated at 390px)
- **Grid Restructuring:** `.garage-grid` collapses from multi-column to single-column (`grid-template-columns: 390px`), completely eliminating horizontal overflow (`bodyWidth: 390px`).
- **Terminal Handling:** Floating terminal window (`.gt-window`) sets `display: none` on mobile viewports to prevent screen obstruction.
- **Timeline Adaptation:** Year ruler timeline `.tl` scrolls smoothly horizontally without breaking page bounds.
- **Header Compression:** Header buttons condense into compact icon/key badges.

### 6. What Makes It Stunning & Transferability
- **Why It Works:** Seamlessly merges high-tech developer tooling (VS Code syntax tokens, Geist Mono, CLI, `⌘K`) with warm artistic humanity (Instrument Serif, film negative numbers, GPS coordinates, ambient ASCII video).
- **Transferable Ideas:**
  1. *Film Negative Roll Band (`00A`, `01A`, coordinates, timestamps, "tap to develop"):* [INFERENCE] Directly showcases Mai Van Nhat Minh’s cinematic travel filmmaking alongside engineering.
  2. *Command Palette (`⌘K`) + Collapsible Terminal:* Fast, authentic developer tool UX.
  3. *ASCII Video Filter:* Provides a hacker/security monitor aesthetic with low resource consumption.
- **What to Avoid:** Unpinned floating windows on mobile (Bryan correctly hides it, which is essential).

---

## 2. Curtis Designr (`https://curtisdesignr.me/`)
*Curtis Nguyen · CURTIS.DESIGNR*

### 1. Stack Signals
- **Core Framework:** Next.js (App Router, Turbopack `turbopack-0xjqz1e8vkr9f.js`), Tailwind CSS v4, Lightning CSS.
- **Animation & Motion Engines:**
  - `GSAP`: Detected across 7 bundle chunks (`12twnydkjfu3f.js`, `0vlzpzolhlub2.js`, `0n.lcv87pg7e~.js`, `1415q5hvc6mfx.js`, `0xn5yk79yysjm.js`, `10q6p3rayb3r7.js`, `0~vkdd-perhi3.js`).
  - `ScrollTrigger`: Detected across 6 chunks. Drives pinning and horizontal translation scrub.
  - `Lenis`: Packaged in `12twnydkjfu3f.js` and `0xn5yk79yysjm.js`. Manages containerized smooth scrolling (`window.lenis` global active).
  - `SplitText`: Integrated in chunk `10q6p3rayb3r7.js` for character-by-character headline reveals.
- **3D & Canvas Rendering:**
  - `Three.js` (WebGL): Bundled in chunk `0~vkdd-perhi3.js` (1.03 MB) for WebGL particle and hero visual effects.
- **Preloading & Assets:** Preloaded inline SVG assets for tool icons (`figma`, `claude`, `photoshop`, `illustrator`).

### 2. Section Order & Information Architecture; Nav Pattern; Intro/Loader
- **Intro / Loader:**
  - Full-screen `.boot-cover` overlay.
  - Session-cached preloader: Inline script checks `sessionStorage.getItem('curtis:preloaded') !== '1'` and `!matchMedia('(prefers-reduced-motion: reduce)').matches`. If fresh, sets `data-preload` on root and triggers a 4000ms animation sequence; otherwise bypasses immediately.
  - Device orientation warning: `.landscape-block` modal (*"This website doesn’t support mobile landscape view. Please rotate your device"*).
- **Navigation Pattern:**
  - Sticky top header (`nav.sticky.top-0`):
    - Left: Sound toggle button (`SOUND - ON` / `SOUND - OFF`).
    - Center: Location & Time ticker (`HO CHI MINH, VN 11:35 PM`) + GPS Coordinates (`10°48'32.0"N 106°46'55.2"E`) rendered in neon green.
    - Right: Fullscreen menu launcher (`/ MENU`).
- **Section Order:**
  1. **Sticky Telemetry Header:** Audio toggle, City/Clock, Geocoordinates, Menu trigger.
  2. **Home Hero (`section.home-hero`):** Bold typography headline (*"FROM [city] I'm a regular guy passionate about Art and <technology/>"*).
  3. **Kinetic Metric Stage (`section.stat-stage`):** Mechanical odometer rolling slot counters (`0 1 2 3 4... +`) scrubbed against scroll progress.
  4. **Pinned Selected Work (`section.selected-work-outer`):** GSAP ScrollTrigger pinned horizontal scroll track showing large-format case studies (Sky Mavis, OPSWAT, Firekamp) with thumbnail links and magnetic "V I S I T" hover buttons.
  5. **Experience History (`section.worked-at`):** Industrial numbered career timeline (`01 OPSWAT SR. PRODUCT DESIGNER`, Sky Mavis, etc.) with detailed impact breakdowns.
  6. **Site Footer (`footer.site-footer`):** "SHOOT A MESSAGE", "DOWNLOAD CV", external links categorized by discipline (Portfolio: Dribbble, GitHub; Photography: Unsplash, Pexels; Socials: LinkedIn, Instagram).

### 3. Typography, Color Palette, Grid/Layout, Whitespace
- **Typography:**
  - Display / Tactical Headings: `Rajdhani` (`--font-heading: "Rajdhani"`, weights 500, 600, 700 - sharp, aerospace/cyberpunk geometry).
  - Monospace / Telemetry: `DM Mono` (`--font-mono: "DM Mono"`, weights 400, 500 - for GPS coordinates, timestamps, metrics).
  - Body / Reading: `DM Sans` (`--font-sans: "DM Sans"`, weights 400, 500).
- **Color Palette (Hex):**
  - Backgrounds: `#0A0A0A` (`--background`), `#000000` (`--background-bg-0`), `#070707` (`--background-bg-1`), `#0C0C0D` (`--background-bg-2`).
  - Text: `#F5F0EB` (`--foreground` warm off-white), `#FFFFFF` (`--color-white`), `#B0B4C0` (`--text-white-grey`), `#747785` (`--text-grey-1`).
  - Primary Brand Accent: `#FF3B00` (`--accent` high-visibility safety orange / cybersecurity alert crimson), `#F75049` (`--accent-notch`).
  - Cyberpunk Secondary Accents:
    - Neon Green: `#9DF133` (`--primary-green-neon`), `#8FD92F` (`--primary-green-divider`), `#84C72F` (`--primary-green-box`), `#1C2D06` (`--background-bg-hover-green`).
    - Neon Cyan: `#64E8FF` (`--primary-cyan-neon`).
    - Vivid Purple: `#54339D` (`--tertiary-purple`), `#905CFF` (`--tertiary-purple-vivid`).
  - Structural Borders & Grids: `#25272F` (`--background-stroke-1`), `#131418` (`--background-stroke-2`), `#131215` (`--divider-line`).
- **Grid, Layout & Whitespace:**
  - Outer containerized virtual scrolling: `#scroll-container` (`height: 768px`, `overflow: hidden auto`) enclosing `#scroll-content` (`height: 10,302px`), managed directly by Lenis.
  - Generous horizontal layout boundaries: `--grid-edge-inset: 2rem`, `--scroller-width: 1365px`.

### 4. Signature Interactions & Motion
- **Containerized Lenis Smooth Scroll:** Viewport locked inside `#scroll-container`, completely removing native momentum jitter.
- **ScrollTrigger Horizontal Scrub:** Pinned horizontal translation of case studies synchronized to vertical scroll distance.
- **Mechanical Odometer Digit Reels:** Slot-machine style rolling numbers in `.stat-stage` animating to numeric targets upon entry.
- **Character Splitting (SplitText):** Title words and characters reveal along cubic-bezier easing curves (`--ease-out: cubic-bezier(0, 0, .2, 1)`).
- **Audio Feedback Loop:** Interactive sound button enabling synthesized/recorded UI click events.
- **Reduced Motion Support:** Explicitly checked in preloader bootstrap script (`matchMedia('(prefers-reduced-motion: reduce)')`) and media queries in CSS chunks (`0rdzaqp1.uzsg.css`, `0pc.m14gu8571.css`).

### 5. Mobile & Responsive Behavior (Evaluated at 390px)
- **Header Collapsing:** Telemetry info (coordinates, city, clock, sound toggle) hides cleanly; header reduces to a single right-aligned `MENU` button.
- **Horizontal Reflow:** Case study cards reflow from horizontal translation into a responsive vertical card stack (`workWidth: 390px`, `contentScrollHeight: 9137px`).
- **Landscape Detection:** Dedicated `.landscape-block` modal instructs phone users to rotate upright if turned sideways.

### 6. What Makes It Stunning & Transferability
- **Why It Works:** High-voltage tactical cybersecurity/defense contractor vibe (OPSWAT heritage visible in high-vis orange `#FF3B00`, neon green `#9DF133`, and Rajdhani typography) coupled with ultra-smooth Lenis + ScrollTrigger motion.
- **Transferable Ideas:**
  1. *Tactical Telemetry Header (Coordinates + Lat/Long + Time + SRE status):* [INFERENCE] Perfect for SRE / DevOps / Security engineer persona.
  2. *Rajdhani + DM Mono + DM Sans Type Scale:* High technical authority, crisp, balanced between sci-fi and enterprise SRE.
  3. *Odometer / Slot Machine Stat Counters:* Outstanding for SRE metrics (e.g., 99.99% uptime, CVEs triaged, SLO compliance).
  4. *Dual Photography / GitHub Footer Architecture:* Clean separation of engineering work vs creative travel/photography links.
- **What to Avoid:** Viewport locking (`#scroll-container` hijacking native window scroll) can cause accessibility issues, browser address bar jumping on iOS Safari, or breaking native pinch-to-zoom if not carefully configured.

---

## 3. Eddy Naboulet OS (`https://eddy-naboulet.dev/cv` & `https://eddy-naboulet.dev/`)
*Eddy Naboulet · Senior Front-end Developer · React, TypeScript, WebGL*

### 1. Stack Signals
- **Core Framework:** Astro (SSG Island Architecture: `_astro/Desktop.CJivPPsu.css`, `themeBoot.Tct-Ry5K.js`). Minimal client-side JavaScript.
- **Animation & Motion Engines:**
  - `GSAP` core: Detected in `Desktop.astro_...CpCv9Pfz.js` (115 KB) and `ProjectDetail.astro_...D-EuLwzN.js` (53 KB).
  - `GSAP Observer`: Bundled in dynamic chunk `_astro/Observer.CLekBAKv.js`. Used to capture mouse wheel and touch gestures on the interactive career rail.
  - `ScrollTrigger`: Used for section reveals and case study parallax.
- **Synthesized Web Audio Engine:**
  - Zero-download audio architecture: Custom Web Audio API synthesizer (`new AudioContext()`) creating square-wave oscillators (`type = 'square'`), gain nodes, and exponential frequency ramps to produce vintage CRT power sounds, mechanical terminal clicks, and boot chirps without fetching any external MP3/WAV files.
- **3D & Canvas Rendering:**
  - Custom WebGL/Canvas CRT Shader: Dynamic chunk `_astro/crt.CDvFkb3O.js` (26 KB) rendering scanlines, barrel distortion curvature, raster lines, and phosphor bloom.
  - 3D Project Sphere: Dynamic chunk `_astro/sphere.CFUZQnDH.js` (58 KB) using pure CSS 3D matrix math (`matrix3d`, `transform: rotateX/rotateY/translateZ`) on 17 DOM elements without the overhead of Three.js.

### 2. Section Order & Information Architecture; Nav Pattern; Intro/Loader
- **Intro / Loader:**
  - Vintage OS Boot Sequence (`.os-boot`): Displays "EDDY-OS version 2.6 — bordeaux, fr" and an authentic simulated diagnostic log:
    ```text
    [ OK ] mémoire design ..................... 15 ans
    [ OK ] mémoire ingénierie ................. 10 ans
    [ OK ] react.sys, typescript.sys .......... prêt
    [ OK ] webgl.drv (three.js) ............... prêt
    [ OK ] crt.drv ............................ prêt
    [ !! ] café.sys ........................... niveau bas
    [ .. ] montage des volumes ................ 17 / 17
    ```
  - Interactive boot bar (`data-boot-bar`), click-to-dismiss button (`data-boot-press`), and audio activation toggle (`[S] son : activé`).
- **Navigation Pattern (Vintage Desktop OS Menu Bar):**
  - Classic Macintosh / NeXTSTEP / UNIX style top bar (`header.os-header`):
    - System Logo: `EN` (Home button).
    - Dropdown Menus:
      - `Fichier`: `01 projets.vol [1]`, `02 parcours.log [2]` (CV), `03 profil.sys [3]`, `04 contact.app [4]`, `Imprimer le CV [⌘P]`.
      - `Extras`: `Doom (1993)`, `Surprends-moi` (Random project).
      - `Système`: `Plein écran`, `Éteindre le tube cathodique` (Toggle CRT shader), `Couper le son`, `Changer de thème` (6 themes), `Palette de commandes [⌘K]`.
      - Language: `FR` / `EN` toggle.
    - Status Area: Availability indicator LED `● disponible` + live clock.
  - Sub-navigation breadcrumb bar (`nav.sub`): Path breadcrumbs (`~/bureau / parcours.log`), view toggles (`sphere`, `index`, `gallery`).
- **Section Order on CV Page (`/cv`):**
  1. **Terminal Command Header (`header.pq-head`):** Interactive bash prompt `eddy@bordeaux:~$ git log --graph --all parcours/` + Print PDF action.
  2. **Interactive Git Branch Rail (`div.pq-rail`):** Interactive SVG diagram rendering 4 distinct git branches (`main`, `freelance`, `feat/ios`, `design`) with clickable commit nodes.
  3. **Horizontal Git Commit Panel Track (`div.pq-track`):** Chronological horizontal log of commit cards:
     - Commits include `1e4000`, `b0b511`, `042c42` (is-merge: design merged into 42 Paris), `c0b020` (is-fork: freelance branch), `fab202` (feat/ios), through `a11b26` (is-head: current mission).
     - Commit messages adhere strictly to Conventional Commits format (`feat(lims): ...`, `release(ios): ...`, `merge: ...`).
     - Includes tech tags, duration chips, case study links, and blinking terminal prompt cursor `eddy@bordeaux:~$ █`.
- **Section Order on Homepage (`/`):**
  1. Desktop OS Menu Bar + Sub-navigation bar.
  2. The Volume Room (`.os-sphere`): Interactive 3D spherical carousel of 17 project cards.
  3. Masthead: "développeur front-end senior Eddy Naboulet".
  4. Bureau Navigation: `01 projets.vol`, `02 parcours.log`, `03 profil.sys`, `04 contact.app`.

### 3. Typography, Color Palette, Grid/Layout, Whitespace
- **Typography:**
  - UI / Terminal / Monospace: `DotGothic16` (`--font-ui: "DotGothic16", monospace` - 16x16 Japanese pixel dot-matrix font, 12px - 13px).
  - Display / Title Headings: `Jacquard 12` (`--font-display: "Jacquard 12", serif` - pixelated gothic serif display face, 46px - 180px).
- **Color Palette (Hex) - 6 Multi-Theme Architecture:**
  - **Theme 1: Phosphore (Default Amber CRT):**
    - Background: `#14100A` (`--papier` deep amber-black charcoal).
    - Scanline Grid: `#3A2A14` (`--grid`).
    - Structural Borders: `#8C2A18` (`--rouille` rust red, `--trait: 3px`, `--filet: 1px`).
    - Primary Accent: `#E0501E` (`--braise` bright ember orange).
    - Text: `#FFA02E` (`--encre` warm amber orange text).
    - Headings: `#FFE2B0` (`--creme` glowing amber cream text).
    - Brutalist Hard Offset Shadow: `--ombre: 6px 6px 0 #E0501E`.
  - **Theme 2: Acidulé (Teal/Mint Cyberpunk):** Papier `#01141D`, Grid `#0F323F`, Rouille `#0B5A66`, Braise `#82BA88`, Encre `#FAA4B5`, Creme `#FFF183`.
  - **Theme 3: Sorbet (Berry Neon):** Papier `#22070E`, Grid `#442229`, Rouille `#832758`, Braise `#70C1E1`, Encre `#F8B77C`, Creme `#FAF4C1`.
  - **Theme 4: Lagon (Matrix Terminal Green):** Papier `#041606`, Grid `#1D3420`, Rouille `#0B5A66`, Braise `#398847`, Encre `#70C1E1`, Creme `#FFF183`.
  - **Theme 5: Guimauve:** Papier `#22070E`, Grid `#442229`, Rouille `#2B5E10`, Braise `#C85C88`, Encre `#FFF183`, Creme `#FDF9D0`.
  - **Theme 6: Néon (Phosphor Bronze & Cyan):** Papier `#1E0D00`, Grid `#41270E`, Rouille `#803705`, Braise `#0B96AF`, Encre `#82BA88`, Creme `#FAA4B5`.
- **Grid, Layout & Whitespace:**
  - Window frame boundaries with crisp pixel borders and brutalist solid offset drop-shadows.

### 4. Signature Interactions & Motion
- **Interactive Git Log Career Timeline:** Git history rendered as an SVG branch graph and synchronized commit cards. Scrubbed via GSAP Observer on mouse wheel, keyboard arrows, or rail node clicks.
- **Synthesized Audio Engine:** Pure zero-latency Web Audio API synthesis creating authentic retro sounds without audio network requests.
- **Interactive CRT Tube Shader:** Toggleable WebGL/canvas shader delivering barrel distortion curvature and raster scanlines.
- **Dynamic Multi-Theme System:** Instant theme swapping using CSS custom properties on `:root[data-theme]`.
- **Operating System Desktop Metaphor:** Dropdown menus, keyboard shortcuts (1-4, `⌘K`, `⌘P`), and CRT power-off animations.

### 5. Mobile & Responsive Behavior (Evaluated at 390px)
- **Menu Bar Refactoring:** Dropdown menus collapse into minimal icons; desktop clock and cart items remain aligned without overflow (`scrollWidth: 390px`).
- **Touch Gesture Git Rail:** Timeline track switches to native horizontal touch-drag scrolling while preserving branch node synchronization.
- **Scaling:** Global scale parameter `--ui-zoom` reduces proportions for compact screens.

### 6. What Makes It Stunning & Transferability
- **Why It Works:** Absolute thematic consistency. It functions as an authentic retro operating system with native Git semantics rather than superficial retro styling.
- **Transferable Ideas:**
  1. *`git log --graph --all` Career Timeline:* [INFERENCE] The single most compelling format for an SRE / Cybersecurity engineer. Career milestones represented as git branches (`main`, `sre-intern`, `security-research`, `kaist`, `travel-films`), commit hashes, merges, and tags.
  2. *Web Audio API Synthesizer:* Zero-latency auditory feedback without downloading audio files.
  3. *OS Diagnostic Boot Sequence:* Displays system health diagnostics (`[ OK ] memory`, `[ OK ] security modules`) as an initial loader.
  4. *Multi-Theme Switcher (Phosphor Amber / Matrix Green):* Appeals directly to security and terminal enthusiasts.
- **What to Avoid:** Pure pixel fonts (`DotGothic16`, `Jacquard 12`) for long-form case studies or research write-ups (can impair legibility). Maintain crisp geometric sans/mono for core text and reserve pixel fonts for badges and accents.

---

## 4. Cross-Site Synthesis Table

| Pattern / Technique | Reference Site | Transfer Value | Concrete Adaptation Idea for Mai Van Nhat Minh Portfolio |
|---|---|---|---|
| **Git Log Branch Graph Timeline (`git log --graph --all`)** | Eddy Naboulet | **High** | Map career milestones as Git branches (`main`, `fpt-sre`, `selfomy-swe`, `pyvulds-sec`, `kaist-2026`). Merges and commit hashes represent major career evolutions. |
| **Tactical Telemetry Header (GPS + Time + Status LED)** | Curtis Designr | **High** | Sticky header displaying `HANOI, VN 21:00`, coordinates `21°00'N 105°50'E`, and an SRE cluster status pill (`● ALL SYSTEMS NOMINAL · 99.99%`). |
| **Cinematic Film Negative Strip (`00A`, `01A`, Coordinates, Timestamps)** | Bryan Garage | **High** | Showcase travel video hobby via a darkroom contact sheet component with frame counters, camera metadata, GPS tags, and a "develop" hover reveal. |
| **Synthesized Web Audio Engine (`AudioContext` Oscillators)** | Eddy Naboulet | **High** | Zero-asset Web Audio API clicks, subtle hums, and terminal chirps without loading external MP3 files. Includes an explicit mute toggle. |
| **SRE Diagnostic Boot Sequence / Health Check Loader** | Eddy Naboulet | **High** | Initial loader styled as an infrastructure boot checklist: `[ OK ] kernel`, `[ OK ] vulndb-synced`, `[ OK ] sre-slo-engine`, `[ OK ] webgl-pipeline`. |
| **Mechanical Odometer Counter (`stat-stage`)** | Curtis Designr | **High** | ScrollTrigger-driven rolling slot digits displaying SRE/security stats: `99.99%` SLA uptime, `42+` CVEs analyzed, `1,200+` commits. |
| **Command Palette (`⌘K`) Global Modal** | Bryan Garage & Eddy Naboulet | **High** | Keyboard-accessible `cmdk` launcher enabling instant navigation between sections, case studies, CV download, and theme toggling. |
| **VS Code Syntax & Phosphor CRT Color Tokens** | Bryan Garage & Eddy Naboulet | **High** | Palette combining VS Code Dark+ tokens (`#569CD6`, `#6A9955`, `#4EC9B0`) with phosphor amber (`#FFE2B0`, `#E0501E`) and high-vis safety orange (`#FF3B00`). |
| **Lenis Containerized Smooth Scrolling** | Curtis Designr | **Med** | Smooth scroll container with normalized inertia and friction, preventing scroll hitching during heavy WebGL or pinned animations. |
| **Horizontal Pinned Case Study Scrub (ScrollTrigger)** | Curtis Designr | **Med** | Pinned horizontal gallery for major projects (PyVulDS, Selfomy architecture, FPT Cloud SRE automation) transitioning back to vertical scroll on mobile. |
| **Dual Technical & Creative Media Footer IA** | Curtis Designr | **High** | Footer cleanly segregating professional code/security links (GitHub, PyPI, CVE IDs) from creative photography/video platforms (YouTube, Unsplash). |
| **Multi-Palette Switcher (Amber CRT / Matrix / High-Vis)** | Eddy Naboulet | **High** | Root theme engine with options like "Phosphor 1984" (amber), "Defcon Terminal" (matrix green), and "Tactical Orange" (defense tech). |
| **ASCII Ambient Visual Streamer** | Bryan Garage | **Med** | Low-overhead ASCII shader streaming loop for security architecture topology or world travel video preview. |
| **Conventional Commits Milestone Classification** | Eddy Naboulet | **High** | Work experiences badged as git commit types (`feat(sre):`, `sec(pyvulds):`, `release(kaist):`) emphasizing engineering rigor. |
