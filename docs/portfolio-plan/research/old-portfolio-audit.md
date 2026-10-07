# Research & Audit: Old Portfolio (Mai Van Nhat Minh)

**Audit Date:** 2026-10-05  
**Audited Repository:** `https://github.com/Supporter09/Mai_Minh_Portfolio` (Commit: `e15e950`, Jan 24, 2023)  
**Live Site URL:** `https://nhat-minh-portfolio.vercel.app`  
**Hosting Provider:** Vercel (Edge Network: `hkg1`)  
**Site Title / Meta Name:** `Charlie Portfolio` | `Nhat Minh - Charlie Portfolio`

---

## 1. Stack & Dependencies

### Core Framework & Build Tooling
* **Framework:** React 18.2.0 (`react`: `^18.2.0`, `react-dom`: `^18.2.0`).
* **Tooling / Bundler:** Create React App 5.0.1 (`react-scripts`: `5.0.1`, Webpack 5 based).
* **Package Manager / Scripts:** npm (`package-lock.json` lockfileVersion 2; scripts: `start`, `build`, `test`, `eject`).
* **Deployment Platform:** Vercel Static Hosting (verified via response headers `server: Vercel`, `x-vercel-cache: HIT`, `x-vercel-id: hkg1::...`).

### CMS & Data Layer
* **Headless CMS:** Sanity.io (`@sanity/client`: `^4.0.1`, `@sanity/image-url`: `^1.0.2`).
* **Sanity Configuration (`src/client.js`):**
  * Project ID: `6m187e00`
  * Dataset: `production`
  * API Version: `2022-02-01`
  * CDN mode: `useCdn: true`
* **Critical Security Vulnerability Identified:** The Sanity API write token (`REACT_APP_SANITY_TOKEN = skPvrmuTmHAX...`) is committed directly into `.env` in the repository and exposed to the client bundle. This allows unauthenticated external writes, modifications, and deletions to the production Sanity dataset.

### Animation & Interaction Libraries
* **Animation Engine:** Framer Motion 8.5.0 (`framer-motion`: `^8.5.0`).
* **Tooltip Library:** `react-tooltip` 5.5.2 (`react-tooltip`: `^5.5.2`). Note: Used incorrectly, resulting in visible text leakage in the DOM.
* **Gallery Library:** `react-grid-gallery` 1.0.0 (`react-grid-gallery`: `^1.0.0`) [INFERENCE: Unused legacy dependency, present in `package.json` but never imported in `src/`].
* **Icons:** `react-icons` 4.7.1 (`react-icons/ai`, `react-icons/hi`, `react-icons/bs`, `react-icons/fa`).

### Styling & CSS Architecture
* **Pre-processor:** Dart SASS 1.57.1 (`sass`: `^1.57.1`).
* **Architecture:** Component-scoped SCSS files (`Navbar.scss`, `Header.scss`, `About.scss`, `Work.scss`, `Skills.scss`, `Testimonial.scss`, `Footer.scss`) alongside global CSS custom properties in `src/index.css`.
* **Methodology:** BEM-like class naming conventions (`.app__*`).

### 3D & Creative Computing
* **3D / WebGL / Canvas:** **None**. Zero Three.js, React Three Fiber, Babylon.js, WebGL shaders, or `<canvas>` elements. Entirely built with flat 2D DOM nodes, CSS transforms, and static PNG/SVG assets.

### Telemetry & Analytics
* **Google Analytics:** GA4 tag `G-FWJ3RP8QDS` injected directly via inline `<script>` tags in `public/index.html`.
* **Web Vitals:** `web-vitals` 2.1.4 included in setup.

---

## 2. Section Inventory & Content Audit

### Global Navigation & Shell
* **Header / Navbar (`src/components/Navbar/Navbar.jsx`):**
  * Fixed glassmorphism bar (`backdrop-filter: blur(4px)`, `background: rgba(255, 255, 255, 0.25)`).
  * Brand Logo: `src/assets/logo.png` (renders stylized wordmark `CHARLIE`).
  * Desktop Navigation Links: `HOME`, `ABOUT`, `WORK`, `SKILLS`, `CONTACT`.
  * Mobile Navigation Menu: Hamburger icon (`HiMenuAlt4`) opening a slide-in drawer (`motion.div` sliding from `x: 300` to `0`) with a close icon (`HiX`).
* **Sidebars & HOC Wrapper (`src/wrapper/AppWrap.js`):**
  * Left Fixed Social Bar (`.app__social`): Facebook and Instagram circular icon buttons. (Hidden on mobile $\le 500\text{px}$).
  * Right Fixed Dot Navigation (`.app__navigation`): 6 bullet anchor dots linking to `#home`, `#about`, `#work`, `#skills`, `#testimonial`, `#contact`. (Hidden on mobile $\le 500\text{px}$).
  * Footer Copyright Notice: `@2023 CHARLIE / ALL RIGHTS RESERVED`.

---

### Section 1: Hero Header (`#home`)
* **Heading / Copy:**
  * Greeting Badge: `👋 Hello, I am`
  * Main Name: `Nhat Minh` (`<h1 className="head-text">`)
  * Tag Badges: `WEB DEVELOPER` | `PRODUCT MANAGER`
* **Imagery:**
  * Central portrait photograph (`src/assets/profile.png`).
  * Behind-portrait circular outline graphic (`src/assets/circle.svg`).
  * 3 Floating satellite tech circles containing language badges: Python (`images.python`), React (`images.react`), Node.js (`images.node`).

---

### Section 2: About (`#about`)
* **Section Heading:**
  * Headline: `The Fact That Good Team Means Good Products` (Code markup: `The Fact that <span>Good Team</span> <br />means <span>Good Products</span>`).
* **Content Cards (Fetched from Sanity `*[_type == "abouts"]`):**
  1. **Content Creator**
     * Copy: *"With the goal of creating a good foundation for the next generations about competitive programming and programming, I have created interesting and useful content about programming on Youtube and Facebook."*
  2. **Frontend Developer**
     * Copy: *"I am a person who love building beautiful websites and creating useful products for society."*
  3. **Contest Enthusiast**
     * Copy: *"I have a great passion for great innovation contests where I can show off my amazing products to people."*
  4. **Backend Developer**
     * Copy: *"With experience as a backend for VYA project, I love the feeling of working and handling the data streams coming from users and websites."*

---

### Section 3: Works / Portfolio (`#work`)
* **Section Heading:**
  * Headline: `Product Showcase` (Code markup: `<span>Product</span> Showcase`).
* **Category Filter Tabs:**
  * `UI/UX`, `Web App`, `Mobile App`, `React JS`, `All`.
* **Projects (Fetched from Sanity `*[_type == "works"]`):**
  1. **AnimalShelter**
     * Tags: `React JS`, `Web App`, `UI/UX`
     * Description: *"A project created with the mission to improve the understanding of the Vietnamese people about the importance of protecting endangered animals by providing detailed information about the animals. (Due to Heroku, the library feature is temporarily inaccessible)"*
     * Live Demo Link: `https://www.animalshelter.tech/`
     * Code Link: `https://github.com/Supporter09/AnimalShelter`
  2. **Vietcode - Beta Version**
     * Tags: `React JS`, `Web App`
     * Description: *"This is the beta version of the latest Vietcode Website"*
     * Live Demo Link: `https://vietcode.netlify.app/`
     * Code Link: `https://github.com/Supporter09?tab=repositories`
  3. **Vietcode**
     * Tags: `React JS`, `Web App`, `UI/UX`
     * Description: *"Website created for Vietcode - a non-profit organization for Vietnamese students with a passion for technology"*
     * Live Demo Link: `https://vietcodenew.netlify.app/`
     * Code Link: `https://github.com/Supporter09?tab=repositories`
  4. **HRFO Website**
     * Tags: `React JS`, `Web App`, `UI/UX`
     * Description: *"Website created for HRFO - Human Rights Fighters NPO is a non-profit organization established on June 24, 2020 to jointly share the most multi-dimensional and objective views on all outstanding issues in society. related to human rights (gender equality, freedom, children's rights,...)"*
     * Live Demo Link: `https://hrfowdorg.netlify.app/`
     * Code Link: `https://github.com/Supporter09?tab=repositories`

---

### Section 4: Skills & Experience (`#skills`)
* **Section Heading:**
  * Headline: `Skills & Experiences`
* **Skills List (Fetched from Sanity `*[_type == "skills"]`):**
  * `Figma`, `HTML5`, `NodeJS`, `Git`, `Python`, `ReactJS`, `Javascript`.
* **Experience Timeline (Fetched from Sanity `*[_type == "experiences"]`):**
  * **2021 — Product Manager | Vietcode**
    * Bullet 1: *"Develop the landing page of the organization."*
    * Bullet 2: *"Participate in market research, validation, and whitespace analysis to identify new opportunities for new and existing features and functionalities."*
    * Bullet 3: *"Develop and implement data pipelines that extract, transform, and load data into an information product."*
    * Bullet 4: *"Evaluate, analyze, and understand the voice of the customer through a variety of data sources."*
  * **2020 — Frontend Developer | Vietcode**
    * Bullet 1: *"Write and style the front-end components that meet the requirements of our mocks and fulfill our user stories."*
    * Bullet 2: *"Monitor and process pull requests for production deployments."*
    * Bullet 3: *"Technologies used: ReactJS, MaterialUI, ES6, BS4, Firebase."*
  * **2020 — Backend Developer | Vietnam Youth Alliance**
    * Bullet 1: *"Compile and analyze data, processes, and codes to troubleshoot problems and identify areas for improvement."*
    * Bullet 2: *"Collaborating with the front-end developers and other team members to establish objectives and design more functional, cohesive codes to enhance the user experience."*
    * Bullet 3: *"Developing ideas for new programs, products, or features by monitoring industry developments and trends."*

---

### Section 5: Testimonials & Partner Brands (`#testimonial`)
* **Testimonial Slider (Fetched from Sanity `*[_type == "testimonials"]`):**
  * Testimonial 1 (Draft document `drafts.e53440f1...` loaded via Sanity token):
    * Feedback quote: *"Greate job! Keep Going"* [verbatim spelling typo on "Greate"]
    * Author: `Michale`
    * Company: `Consortium`
    * Image: Sanity asset `image-8ca4162dcb892390586d2828ef56f3423b7f75da-64x64.png`
* **Brand Logos (Fetched from Sanity `*[_type == "brands"]`):**
  * `New Balance`, `Adidas`, `Spotify` (draft document), `Asus`.

---

### Section 6: Contact & Footer (`#contact`)
* **Section Heading:**
  * Headline: `Take A Coffee & Chat With Me` (SCSS `text-transform: capitalize`).
* **Contact Cards:**
  * Email Card: `CatTheDev.business@gmail.com`
  * Phone Card: `+84 86142616`
* **Contact Form:**
  * Fields: `Your Name` (`<input type="text" name="username">`), `Your Email` (`<input type="email" name="email">`), `Your Message` (`<textarea name="message">`).
  * Action: On submission, executes `client.create({ _type: 'contact', name, email, message })` directly against the Sanity API.
  * Success message: `Thank you for getting in touch!`

---

### Verbatim Public Links Inventory (Target for Contact / Social Migration)

| Category / Purpose | Public URL | Location on Site | Element / Trigger |
| :--- | :--- | :--- | :--- |
| **Social: Facebook** | `https://www.facebook.com/minhpmdev/` | Left sidebar (`.app__social`) | Facebook icon (`FaFacebookF`) |
| **Social: Instagram** | `https://www.instagram.com/minhh.dev/` | Left sidebar (`.app__social`) | Instagram icon (`BsInstagram`) |
| **Project 1 Live Demo** | `https://www.animalshelter.tech/` | Work Section card hover | Eye icon (`AiFillEye`) |
| **Project 1 Source Code** | `https://github.com/Supporter09/AnimalShelter` | Work Section card hover | GitHub icon (`AiFillGithub`) |
| **Project 2 Live Demo** | `https://vietcode.netlify.app/` | Work Section card hover | Eye icon (`AiFillEye`) |
| **Project 2 Source Code** | `https://github.com/Supporter09?tab=repositories` | Work Section card hover | GitHub icon (`AiFillGithub`) |
| **Project 3 Live Demo** | `https://vietcodenew.netlify.app/` | Work Section card hover | Eye icon (`AiFillEye`) |
| **Project 3 Source Code** | `https://github.com/Supporter09?tab=repositories` | Work Section card hover | GitHub icon (`AiFillGithub`) |
| **Project 4 Live Demo** | `https://hrfowdorg.netlify.app/` | Work Section card hover | Eye icon (`AiFillEye`) |
| **Project 4 Source Code** | `https://github.com/Supporter09?tab=repositories` | Work Section card hover | GitHub icon (`AiFillGithub`) |
| **Direct Contact: Email** | `mailto:CatTheDev.business@gmail.com` | Footer contact card | Text link + mail icon |
| **Direct Contact: Phone** | `tel:+84 86142616` | Footer contact card | Text link + phone icon |
| **Author Git Email** | `mailto:maivannhatminh2005@gmail.com` | Found in git commit log + Sanity submissions | Not displayed publicly as an anchor |
| **Internal Nav Anchor** | `#home` | Navbar & Navigation dots | Text `HOME` / dot |
| **Internal Nav Anchor** | `#about` | Navbar & Navigation dots | Text `ABOUT` / dot |
| **Internal Nav Anchor** | `#work` | Navbar & Navigation dots | Text `WORK` / dot |
| **Internal Nav Anchor** | `#skills` | Navbar & Navigation dots | Text `SKILLS` / dot |
| **Internal Nav Anchor** | `#testimonial` | Navigation dots only | Dot |
| **Internal Nav Anchor** | `#contact` | Navbar & Navigation dots | Text `CONTACT` / dot |

#### Missing Public Links (Critical Deficits)
1. **GitHub Profile:** There is **NO** direct link to `https://github.com/Supporter09` in the navbar, header, social sidebar, or footer. GitHub is only linked via project cards (three of which lazily link to `?tab=repositories`).
2. **LinkedIn Profile:** **Completely absent** across the entire website and codebase.
3. **Resume / CV:** **Completely absent**. No PDF download, Google Drive link, or view link anywhere on the site.

---

## 3. Visual Identity & Brand System

### Color Palette (Observed Exact Hex Values)
* `--primary-color: #edf2f8` (Very pale grayish ice-blue; used as alternating section background).
* `--secondary-color: #313bac` (Cobalt / royal blue; used for badges, active states, buttons, hamburger icon, accent text).
* `--black-color: #030303` (Near pitch-black; headings and high-emphasis labels).
* `--gray-color: #6b7688` (Muted slate gray; body copy, paragraphs, sub-labels).
* `--lightGray-color: #e4e4e4` (Light border gray; social icon borders and dividers).
* `--white-color: #ffffff` (Pure white; cards, container backgrounds, icon fills).
* `--brown-color: #46364a` (Plum / dark slate [INFERENCE: Defined in `:root` tokens but unused in actual UI styling]).
* **Contact Card Accents:**
  * Email card background: `#fef4f5` (Light pastel blush/pink)
  * Email card hover glow: `box-shadow: 0 0 25px #fef4f5`
  * Phone card background: `#f2f7fb` (Soft powder blue)
  * Phone card hover glow: `box-shadow: 0 0 25px #f2f7fb`
* **Navigation Dot Colors:**
  * Active dot: `#313bac`
  * Inactive dot: `#cbcbcb`

### Typography System
* **Primary Typeface:** `"DM Sans", sans-serif` (Imported via Google Fonts CDN: `https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap`).
* **Scale & Hierarchy:**
  * Hero Heading (`.head-text`): `2.75rem` ($44\text{px}$) desktop, `2rem` ($32\text{px}$) mobile; `font-weight: 800`; `text-transform: capitalize`.
  * Subheadings (`.bold-text`): `1rem` ($16\text{px}$) desktop, `0.9rem` mobile; `font-weight: 800`.
  * Body Text (`.p-text`): `0.8rem` ($12.8\text{px}$) desktop; `font-weight: 400` / `500`; `color: #6b7688`; `line-height: 1.5`.

### Layout Structures
* **Shell:** Split 3-column layout via `AppWrap` HOC:
  * Left column: Fixed vertical social bar (width: $\approx 60\text{px}$).
  * Center column: Flexible main content container (`.app__wrapper`, `width: 100%`, `min-height: 100vh`).
  * Right column: Fixed vertical dot navigation (width: $\approx 40\text{px}$).
* **Z-Pattern Alternation:** Hard section alternation between `#edf2f8` (Hero, Work, Testimonials) and `#ffffff` (About, Skills, Contact).
* **Navigation Bar:** Fixed header (`position: fixed`, `z-index: 2`, `top: 0`, `width: 100%`) with flex layout (`justify-content: space-between`).

### Imagery & Personal Brand Elements
* **Avatar / Portrait:** `src/assets/profile.png` — High-resolution studio photograph ($2561 \times 3840\text{px}$, $1.98\text{MB}$ file size) of Nhat Minh in a dark collared jacket sitting against an indoor backdrop.
* **Background Textures:**
  * Hero background: `src/assets/bgIMG.png` ($398\text{KB}$, repeated vector pattern).
  * Avatar halo: `src/assets/circle.svg` (511px circular vector ring behind avatar).
* **Wordmark / Logo:** `src/assets/logo.png` ($156 \times 32\text{px}$) / `src/assets/logo.svg` showing stylized uppercase typography.
* **Persona & Aliases:**
  * "Charlie": In `<title>Charlie Portfolio</title>`, footer copyright `@2023 CHARLIE`, and meta name `Nhat Minh - Charlie Portfolio`.
  * "CatTheDev": In public email `CatTheDev.business@gmail.com`.
  * "Supporter09": GitHub username (`https://github.com/Supporter09`).
  * "Minh PM": Facebook URL slug `minhpmdev`.

---

## 4. Animations & Interactions Catalog

### Page-Level & Scroll Interactions
* **Section Viewport Entrance (`MotionWrap.js`):**
  * Technique: Framer Motion `whileInView` applied to every wrapped section container.
  * Configuration: `whileInView={{ y: [100, 50, 0], opacity: [0, 0, 1] }}`, `transition={{ duration: 0.5 }}`.
  * Trigger: Fires whenever any section scrolls into view.
* **Smooth Page Scrolling:**
  * CSS native `scroll-behavior: smooth` declared on `*` in `index.css`.
  * No inertial/momentum scroll engine (e.g. Lenis, Locomotive).

### Hero Section Micro-Animations (`Header.jsx`)
* **Badge Slide-in:** `whileInView={{ x: [-100, 0], opacity: [0, 1] }}`, `transition={{ duration: 0.5 }}`.
* **Avatar Image Fade-in:** `whileInView={{ opacity: [0, 1] }}`, `transition={{ duration: 0.5, delayChildren: 0.5 }}`.
* **Avatar Behind-Circle Zoom:** `whileInView={{ scale: [0, 1] }}`, `transition={{ duration: 1, ease: 'easeInOut' }}`.
* **Tech Satellite Bubbles (Python, React, Node):**
  * Staggered scale pop: `whileInView={{ scale: [0, 1], opacity: [0, 1] }}`, `transition={{ duration: 1, ease: 'easeInOut' }}`.

### Card & List Hover Micro-Interactions
* **About Cards:** Hover scale zoom `whileHover={{ scale: 1.1 }}`, `transition={{ duration: 0.5, type: 'tween' }}`.
* **Work Project Cards Filter Transition:**
  * Tab click triggers React state: `setAnimateCard([{ y: 100, opacity: 0 }])`.
  * `setTimeout` callback at $500\text{ms}$ filters array and animates back: `setAnimateCard([{ y: 0, opacity: 1 }])`.
* **Work Card Image Overlay:**
  * On mouse hover: `whileHover={{ opacity: [0, 1] }}`, `transition={{ duration: 0.25, ease: 'easeInOut', staggerChildren: 0.5 }}`.
  * Preview & GitHub Icon Buttons: `whileHover={{ scale: [1, 0.90] }}`, `transition={{ duration: 0.25 }}`.
* **Social Buttons & Nav Dots:**
  * Pure CSS transitions: `transition: all 0.3s ease-in-out` on background and SVG color fills.

### Navigation & Drawers
* **Mobile Menu Drawer:**
  * Framer Motion slide from right: `whileInView={{ x: [300, 0] }}`, `transition={{ duration: 0.85, ease: 'easeOut' }}`.
* **Testimonial Carousel Transition:**
  * Non-animated state switch (`currentIndex = index`), clicking chevron arrows triggers instant image/text swap without slide or crossfade transitions.

---

## 5. Critical Evaluation vs. 2026 Standards & Modernization Blueprint

### Weaknesses & Architectural Flaws

#### 1. Architecture & Performance
* **Outdated CRA/Webpack Baseline:** Uses Create React App (deprecated since early 2023). High JS bundle size ($453\text{KB}$ uncompressed `main.js`), zero server-side rendering (SSR), and zero static site generation (SSG).
* **Massive Image Payloads:**
  * Hero avatar `profile.png` is an unoptimized **$1.98\text{MB}$** asset ($2561 \times 3840\text{px}$) loaded directly as an `<img>` tag without `srcset`, modern formats (`webp`/`avif`), or responsive sizing.
  * Total page transfer on initial load exceeds **$5.2\text{MB}$**.
* **Client-Side Waterfall & Layout Shifts (CLS):**
  * 5 separate asynchronous Sanity client queries (`abouts`, `works`, `skills`, `experiences`, `testimonials`, `brands`) execute on client mount inside individual `useEffect` hooks.
  * Results in severe layout shifts as cards and lists pop in dynamically after initial DOM paint.
* **Security & Secret Leakage:**
  * Sanity API write token (`REACT_APP_SANITY_TOKEN`) is committed to git in `.env` and compiled into the client bundle.

#### 2. Accessibility (A11y) Violations (Verified via `axe-core 4.13.0`)
* **62 Violations Detected:**
  * **56 Empty / Inaccessible Links:** Social media icon links (`FaFacebookF`, `BsInstagram`), project hover links (`AiFillEye`, `AiFillGithub`), and all navigation dots have no inner text, `aria-label`, or accessible names.
  * **Color Contrast Failures:** Gray text (`#6b7688`) on light card tints (`#fef4f5`, `#f2f7fb`) yields a contrast ratio of $4.25:1$, violating the WCAG AA minimum threshold of $4.5:1$.
  * **Missing Image Alt Text:** Work card images render with `alt={work.name}` which evaluates to `undefined` or empty because Sanity schema stores `title` rather than `name`.
  * **Broken Semantic Landmarks:** Entire site lacks `<main>`, `<header>`, and `<footer>` HTML landmarks. Sections are arbitrary `div` containers.
  * **Improper Heading Order:** Skips directly from `h2` section titles down to `h4` card titles.

#### 3. Broken UI Implementations & Rendering Bugs
* **Leaking `react-tooltip` in Experience Section:**
  * In `Skills.jsx`, tooltip trigger has `data-for={work.name}`, but `SkillDescTooltip` assigns `id={work.work}` (the full text string).
  * Because `react-tooltip` v5 changed its API (`data-tooltip-id`), the tooltips fail to bind and are rendered directly into the DOM flow as visible, unstyled dark blocks with `display: block` and `opacity: 1`.
* **Mobile Hover Failure:** Work card links (GitHub and Demo) rely strictly on CSS `:hover` / Framer Motion `whileHover`. On touchscreen mobile devices, users cannot tap these links cleanly without fighting hover state emulation.
* **Placeholder Testimonial:** Displays a single hardcoded draft testimonial from "Michale" at "Consortium" with a spelling mistake (*"Greate job! Keep Going"*).
* **Uncontextualized Partner Brands:** Displays logos of New Balance, Adidas, Asus, and Spotify without explanation (giving the impression of random tutorial placeholders).

#### 4. Responsiveness Failures
* **Mobile Link Obliteration:** At screen widths $\le 500\text{px}$, CSS sets `.app__social { display: none }` and `.app__navigation { display: none }`. Because social links are not included in the navbar drawer or footer, mobile visitors have **zero access** to any social media profiles.

#### 5. Aesthetics & Identity Misalignment
* **Tutorial Template Feel:** The site is an unmodified build of the widely replicated JavaScript Mastery 2022 Sanity portfolio tutorial.
* **Aesthetic Vibe Gap:** The pastel blue/white color scheme, generic drop shadows, cartoonish emojis (`👋`), and floating tech spheres contrast sharply with the desired 2026 vibe: **cinematic storytelling, cybersecurity research, and SRE systems precision**.
* **Outdated Professional Positioning:** Mentions early 2020-2021 roles ("Web Developer", "Product Manager") under the alias "Charlie". Completely omits:
  * Cyber Security undergraduate studies at HUST (Hanoi University of Science and Technology).
  * Software Engineer at Selfomy.
  * DevOps / SRE Intern at FPT Smart Cloud.
  * Security Research (PyVulDS vulnerability dataset).
  * Attending KAIST Global Preview Week 2026.
  * Cinematic travel filmmaking and video production.

---

### What to Carry Forward (Assets, Data & Retrospective Value)

1. **Verified Historic Experience & Project Milestones:**
   * **Vietcode (2020–2021):** Frontend Developer & Product Manager roles, React/Firebase architecture, community platform for Vietnamese tech students.
   * **Vietnam Youth Alliance (2020):** Backend Developer handling user data pipelines.
   * **Early Projects:** *AnimalShelter* (endangered animal awareness), *HRFO* (Human Rights Fighters NPO).
   * *Recommendation:* Consolidate into an expandable "Early Engineering & Open Source Retrospective (2020–2022)" archive rather than main hero highlights.
2. **Contact & Social Coordinates:**
   * Facebook: `https://www.facebook.com/minhpmdev/`
   * Instagram: `https://www.instagram.com/minhh.dev/`
   * GitHub: `https://github.com/Supporter09`
   * Personal Email: `maivannhatminh2005@gmail.com`
   * Business / Alternate Email: `CatTheDev.business@gmail.com`
   * Phone: `+84 86142616`
3. **High-Resolution Portrait Asset:**
   * `profile.png` ($2561 \times 3840\text{px}$) is high-quality raw photography that can be processed (duotone, cinematic grain, dark background cut, AVIF compression) if new photography is unavailable.

---

## 6. Modern 2026 Portfolio Architectural Recommendations

* **Framework:** Next.js 15 (App Router, React Server Components) or Astro 5 for static generation with zero client JS overhead by default.
* **Smooth Scrolling:** Lenis (`@studio-freight/lenis` / `lenis`) smooth inertial scrolling synchronized with GSAP ScrollTrigger.
* **Animation Engine:** GSAP (ScrollTrigger, Flip, SplitText) + Framer Motion / Motion for UI component state transitions.
* **Cinematic & Creative Tech:**
  * Full-bleed WebGL / Three.js backdrop or GLSL shader effect with subtle interactive noise/distortion simulating film grain and security telemetry.
  * Embedded cinematic video reels (custom HTML5 video player with ambient glowing backdrops).
* **Typography:** Premium dual-system pairing:
  * Editorial / Title: Space Grotesk, Syne, or Geist Sans.
  * Data / SRE / Security Monospace: JetBrains Mono or IBM Plex Mono for timestamps, system status metrics, Git commit tags, and incident logs.
* **Visual Theme:** Deep Obsidian / Cinema Dark (`#0a0b0e`, `#12141a`) accented with Cyber Teal / SRE Emerald (`#00f5a0`, `#00d2ff`) and Amber telemetry highlights (`#ffb703`).
* **Essential Missing Additions:**
  * Direct LinkedIn profile badge.
  * Downloadable / interactive CV modal (`Resume 2026`).
  * Live GitHub activity & SRE status widget (e.g., uptime indicator `99.99% Systems Operational`).
  * Security Research showcase dedicated to PyVulDS.
