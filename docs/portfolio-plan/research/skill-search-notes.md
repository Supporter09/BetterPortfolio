# ui-ux-pro-max search results (verified/filtered)

## Accepted
- Pattern: **Scroll-Triggered Storytelling** — chapters (intro hook > chapters > climax CTA), progress indicator, mini-CTA per chapter, DOM reading order complete, under reduced motion render each chapter final readable state; disable parallax/scrub.
- Style blend: **Parallax Storytelling** (cinematic, full-screen chapters, 3-5 layers, skip option, mobile alternative) + **Minimalism & Swiss** (grid, clear hierarchy, single accent) + a *restrained* touch of **Vintage Analog/Film** (film grain overlay ~0.04-0.08 opacity, letterbox, light-leak only in Travel chapter). Dark-first (OLED-ish #0A0A0B-ish, not pure #000 for large surfaces).
- GSAP rules: pin max 1-2 sections per page (scrub 0.5-1.5); subtle reveal y 8-16px 300-400ms power1.out; standard stagger 0.08 ≤8 children power2.out; SplitText chars only for headlines <8 words, revert on unmount; parallax only decorative layers, yPercent 5-15; ScrollTrigger.refresh after fonts/images; useGSAP scope; gsap.matchMedia reduced-motion.
- Page transitions: exit ≤250ms, enter 500-800ms expo.inOut; Flip shared element (one pair per nav) for project card → case study.
- Fonts (Google, Vietnamese subset needed for "Mai Văn Nhật Minh"): Space Grotesk (vi ✓), Familjen Grotesk (vi ✓); mono: JetBrains Mono (code/labels), IBM Plex Sans as body option.
- Next.js: next/image everywhere, reserve aspect ratios (CLS), bundle analyzer.
- UX: prefers-reduced-motion mandatory; smooth anchor scroll; no forced scroll-jacking.

## Rejected (did not fit product)
- Design-system typography "Caveat + Quicksand" (handwritten/casual) — clashes with SRE precision/security tone.
- Design-system style "Brutalism" with "no smooth transitions (instant)" — contradicts goal of smooth motion.
- Default light palette (#FAFAFA + blue #2563EB) — generic; dev-tool green #22C55E "hacker green" — explicitly avoid per brief (no generic hacker imagery/neon).
