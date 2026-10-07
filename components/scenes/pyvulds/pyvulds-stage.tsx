'use client';

import { useRef, type ReactNode } from 'react';
import { useSceneMotion } from '@/lib/motion/use-scene-motion';

// GSAP equivalents of the CSS tokens: --ease-out (expo-out) and --ease-in-out (cubic in-out).
const EASE_OUT = 'expo.out';
const EASE_IN_OUT = 'power2.inOut';

/** Pin-progress label where every beat has finished (B4.12 end); focus inside the pin seeks here. */
const CTA_PROGRESS = 0.94;

const CLIP_FULL = 'inset(0% 0% 0% 0%)';
const CLIP_FROM_LEFT = 'inset(0% 100% 0% 0%)';
const CLIP_FROM_TOP = 'inset(0% 0% 100% 0%)';

/** Seconds per typed character in the one-shot title beat. */
const TYPE_STEP = 0.08;

/**
 * Motion island for Scene 04 (02b Scene 04 §5–§8, round 2 §4). Server-rendered children are the final state;
 * this only adds initial states inside `useSceneMotion` (Tier A/B, after the runtime loads).
 * - Typing beat (no pin): "Research" types in with a pixel caret on enter; a scrubbed timeline over the
 *   next ~55vh deletes it right-to-left, types the quote in its place, then the smaller tail line.
 * - Pin #1 (`conditions.pinPyvulds`): scrubbed timeline over `+=250%`, letterbox bars, focus seek.
 *   If the panel would be clipped by more than 40% of the viewport even with the tilt, it does not pin.
 * - Otherwise: one-shot block reveals + one-shot visual beats (Tier B layout).
 */
export function PyvuldsStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useSceneMotion(ref, ({ gsap, SplitText, mm, conditions, lenis }) => {
    const root = ref.current;
    if (!root) return;

    const $ = <T extends HTMLElement = HTMLElement>(selector: string, scope: ParentNode = root) =>
      scope.querySelector<T>(selector);
    const $$ = <T extends HTMLElement = HTMLElement>(selector: string, scope: ParentNode = root) =>
      Array.from(scope.querySelectorAll<T>(selector));
    // 02b rule 3: only elements still fully below the viewport get an initial state (no flash-back).
    const below = (el: Element) => el.getBoundingClientRect().top > window.innerHeight;

    const section = root.closest('section');
    const frame = $('[data-pin-frame]');
    const inner = $('[data-pin-inner]');

    /* ---- B4.1 intro: slate wipe (section top 80%) ---- */
    const slate = section?.querySelector<HTMLElement>('.slate');
    if (section && slate && below(slate)) {
      gsap.fromTo(
        slate,
        { clipPath: CLIP_FROM_LEFT },
        { clipPath: CLIP_FULL, duration: 0.6, ease: EASE_OUT, scrollTrigger: { trigger: section, start: 'top 80%', once: true } },
      );
    }

    /* ---- Typing beat: title types in, then scroll deletes it and types the quote + tail ---- */
    const beat = $('[data-beat]');
    const caret = $('[data-caret]');
    const titleEl = $('[data-type="title"]');
    const quoteEl = $('[data-type="quote"]');
    const tailEl = $('[data-type="tail"]');
    const typed: { revert: () => void }[] = [];
    if (beat && caret && titleEl && quoteEl && tailEl && document.fonts.status === 'loaded') {
      beat.dataset.typing = 'on';
      // The visible layers are aria-hidden (sr-only copies carry the text), so no SplitText aria handling.
      // Words are wrapped too so the quote breaks between words (not mid-word) when it wraps on narrow viewports.
      const splitChars = (el: HTMLElement) => {
        const parts = SplitText.create(el, { type: 'words,chars', aria: 'none' });
        typed.push(parts);
        return parts.chars as HTMLElement[];
      };
      const title = splitChars(titleEl);
      const quote = splitChars(quoteEl);
      const tail = splitChars(tailEl);

      // Caret rests after char `i` of `chars` (i = -1 → before the first). Transform-only and scaled from the
      // char box so it follows each line's font size; measured live so wrapped lines and resizes are handled.
      const placeCaret = (chars: HTMLElement[], i: number) => {
        const char = chars[Math.max(0, i)];
        if (!char) return;
        const box = beat.getBoundingClientRect();
        const r = char.getBoundingClientRect();
        const base = caret.offsetHeight || 1;
        const scale = (r.height * 0.78) / base;
        gsap.set(caret, {
          x: (i < 0 ? r.left : r.right) - box.left + 2,
          y: r.top - box.top + (r.height - base * scale) / 2,
          scale,
        });
      };
      // Shows the first `n` chars; stepwise (no fades) so it reads as typing. Reversible under scrub.
      const show = (chars: HTMLElement[], n: number) => {
        chars.forEach((c, i) => {
          c.style.opacity = i < n ? '1' : '0';
        });
      };
      // One authoritative state (typed char counts) that both timelines tween; every playhead move re-renders
      // all three lines from it, so a jump/refresh can never leave a stale layer behind. The caret follows the
      // line currently being typed.
      const enter = below(beat);
      const state = { title: enter ? 0 : title.length, quote: 0, tail: 0 };
      let last = '';
      const render = () => {
        const t = Math.round(state.title);
        const q = Math.round(state.quote);
        const l = Math.round(state.tail);
        const key = `${t}/${q}/${l}`;
        if (key === last) return;
        last = key;
        show(title, t);
        show(quote, q);
        show(tail, l);
        if (l > 0) placeCaret(tail, l - 1);
        else if (q > 0) placeCaret(quote, q - 1);
        else placeCaret(title, t - 1);
      };
      const type = (tl: gsap.core.Timeline, key: keyof typeof state, from: number, to: number, duration: number, at: number) =>
        tl.fromTo(state, { [key]: from }, { [key]: to, duration, ease: 'none', immediateRender: false }, at);
      render();

      let intro: gsap.core.Timeline | null = null;
      if (enter) {
        intro = gsap.timeline({ onUpdate: render, scrollTrigger: { trigger: beat, start: 'top 88%', once: true } });
        type(intro, 'title', 0, title.length, title.length * TYPE_STEP, 0.25);
      }

      const scrub = gsap.timeline({
        defaults: { ease: 'none' },
        onUpdate: render,
        scrollTrigger: {
          trigger: beat,
          start: 'top 72%',
          end: 'top 18%',
          scrub: 0.4,
          invalidateOnRefresh: true,
          // Line boxes move on resize/refresh: re-measure the caret even when the counts did not change.
          onRefresh: () => {
            last = '';
            render();
          },
          // Scroll outran the intro: land the title, then drop the intro so a later refresh cannot replay it.
          onEnter: () => {
            intro?.progress(1).kill();
            intro = null;
          },
        },
      });
      scrub.to({}, { duration: 1 }, 0);
      type(scrub, 'title', title.length, 0, 0.16, 0.06);
      type(scrub, 'quote', 0, quote.length, 0.34, 0.26);
      type(scrub, 'tail', 0, tail.length, 0.32, 0.64);
    } else if (beat && below(beat)) {
      gsap.from(beat, { opacity: 0, y: 16, duration: 0.6, ease: EASE_OUT, scrollTrigger: { trigger: beat, start: 'top 85%', once: true } });
    }

    let split: { revert: () => void } | null = null;
    const title = $('[data-split]');
    if (title && below(title)) {
      const tl = gsap.timeline({ defaults: { ease: EASE_OUT }, scrollTrigger: { trigger: title, start: 'top 88%', once: true } });
      if (document.fonts.status === 'loaded') {
        // aria: 'auto' (default) keeps the full title as aria-label and hides the char spans.
        const chars = SplitText.create(title, { type: 'chars', mask: 'chars' });
        split = chars;
        // Revert once played so the masks never clip descenders afterwards.
        tl.from(chars.chars, { yPercent: 100, opacity: 0, duration: 0.6, stagger: 0.03, onComplete: () => chars.revert() }, 0);
      } else {
        tl.from(title, { opacity: 0, y: 24, duration: 0.6 }, 0);
      }
      tl.from($$('[data-intro]'), { opacity: 0, y: 16, duration: 0.6, stagger: 0.08 }, 0.12);
    }

    /* ---- Pin #1 ---- */
    const pinned = (): (() => void) | undefined => {
      if (!frame || !inner) return undefined;
      frame.dataset.pin = 'on';
      const overflow = () => {
        const style = getComputedStyle(frame);
        const room = frame.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
        return Math.max(0, inner.offsetHeight - room);
      };
      if (overflow() > window.innerHeight * 0.4) {
        delete frame.dataset.pin;
        return undefined;
      }

      const bars = $$('[data-lb]', frame);
      gsap.set(bars, { scaleY: 0 });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: frame,
          start: 'top top',
          end: '+=250%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onToggle: (self) => {
            // B4.2 / B4.14: letterbox closes on pin, opens on release (exit ≈ 65% of enter).
            gsap.to(bars, {
              scaleY: self.isActive ? 1 : 0,
              duration: self.isActive ? 0.32 : 0.21,
              ease: self.isActive ? EASE_OUT : EASE_IN_OUT,
              overwrite: true,
            });
            frame.style.willChange = self.isActive ? 'transform' : '';
          },
        },
      });
      tl.to({}, { duration: 1 }, 0); // timeline time === pin progress (0 → 1)

      // B4.3 / B4.4: connectors draw in sequence over 0.02–0.34, each node lights as the line reaches it.
      const stages = $$('[data-stage]', frame);
      const seg = 0.32 / Math.max(1, stages.length - 1);
      stages.forEach((stage, i) => {
        const at = 0.02 + i * seg;
        const lit = $('[data-node-lit]', stage);
        if (lit) tl.fromTo(lit, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: Math.min(0.04, seg) }, Math.max(0, at - 0.01));
        const conns = $$('[data-conn]', stage);
        if (conns.length) {
          tl.fromTo(
            conns,
            { clipPath: (_: number, el: HTMLElement) => (el.dataset.conn === 'y' ? CLIP_FROM_TOP : CLIP_FROM_LEFT) },
            { clipPath: CLIP_FULL, duration: seg },
            at,
          );
        }
        // B4.5: optional branch (dashed tag) fades in as its node lights; the branch note under the diagram is static text.
        const optional = $('[data-branch="optional"]', stage);
        if (optional) tl.fromTo(optional, { opacity: 0 }, { opacity: 1, duration: 0.03 }, at - 0.01);
      });

      // Tilt (camera pans down) only when the panel is taller than the frame; 0 px otherwise.
      tl.to(inner, { y: () => -overflow(), duration: 0.5 }, 0.36);

      // B4.6: evidence tiles are visible from the start (no empty box); rack focus triggers on scrub.
      // B4.7: rack focus — opacity only (blur is baked on the soft layer).
      $$('[data-visual="rack"]', frame).forEach((tile) => {
        const sharp = $('[data-rack-sharp]', tile);
        const soft = $('[data-rack-soft]', tile);
        const focus = $$('[data-rack-focus]', tile);
        if (sharp) tl.from(sharp, { opacity: 1, duration: 0.1 }, 0.42);
        if (soft) tl.from(soft, { opacity: 0, duration: 0.1 }, 0.42);
        if (focus.length) tl.from(focus, { opacity: 0, scale: 0.85, duration: 0.08 }, 0.44);
      });

      // B4.8: precision fill scaleX(from → to). Labels are static text.
      $$('[data-bar-fill]', frame).forEach((fill) => {
        tl.fromTo(fill, { scaleX: Number(fill.dataset.from) }, { scaleX: Number(fill.dataset.to), duration: 0.12 }, 0.54);
      });

      // B4.9: recovered-path cells pop in.
      const cells = $$('[data-cell]', frame);
      if (cells.length) tl.from(cells, { opacity: 0, scale: 0.8, duration: 0.03, stagger: 0.01 }, 0.66);

      // B4.10: F1 band wipes across its axis.
      const bands = $$('[data-band]', frame);
      if (bands.length) tl.fromTo(bands, { clipPath: CLIP_FROM_LEFT }, { clipPath: CLIP_FULL, duration: 0.08 }, 0.78);

      // B4.11: Limitations & CTA stay visible from the start; amber accent & border strengthen on scrub.
      const accent = $('[data-limits-accent]', frame);
      const cta = $('[data-cta]', frame);
      if (accent) tl.fromTo(accent, { opacity: 0.4 }, { opacity: 1, duration: 0.08 }, 0.86);
      if (cta) tl.fromTo(cta, { borderColor: 'var(--line)' }, { borderColor: 'var(--grade-amber)', duration: 0.08 }, 0.88);
      // §8: focusing something inside the pin before its beat → seek the scrub to the end of the beats.
      const st = tl.scrollTrigger;
      const onFocus = (event: FocusEvent) => {
        if (!st || !(event.target instanceof Node) || !frame.contains(event.target)) return;
        if (st.progress >= CTA_PROGRESS) return;
        const y = st.start + CTA_PROGRESS * (st.end - st.start);
        if (lenis) lenis.scrollTo(y, { duration: 0.32 });
        else window.scrollTo({ top: y });
      };
      frame.addEventListener('focusin', onFocus);

      return () => {
        frame.removeEventListener('focusin', onFocus);
        frame.style.willChange = '';
        delete frame.dataset.pin;
      };
    };

    /* ---- Tier B / no-pin: simple one-shot reveals (02b Scene 04 §6) ---- */
    const reveals = () => {
      $$('[data-reveal]').forEach((el) => {
        if (!below(el)) return;
        gsap.from(el, {
          opacity: 0,
          y: 16,
          duration: 0.32,
          ease: EASE_OUT,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
      });

      const pipeline = $('[data-pipeline]');
      if (pipeline && below(pipeline)) {
        const tl = gsap.timeline({ scrollTrigger: { trigger: pipeline, start: 'top 75%', once: true } });
        const stages = $$('[data-stage]', pipeline);
        const step = 0.6 / Math.max(1, stages.length - 1);
        stages.forEach((stage, i) => {
          const lit = $('[data-node-lit]', stage);
          if (lit) tl.from(lit, { opacity: 0, scale: 0.96, duration: 0.2, ease: EASE_OUT }, i * step);
          const conns = $$('[data-conn]', stage);
          if (conns.length) {
            tl.fromTo(
              conns,
              { clipPath: (_: number, el: HTMLElement) => (el.dataset.conn === 'y' ? CLIP_FROM_TOP : CLIP_FROM_LEFT) },
              { clipPath: CLIP_FULL, duration: step, ease: 'none' },
              i * step,
            );
          }
        });
      }

      $$('[data-visual="rack"]').forEach((tile) => {
        if (!below(tile)) return;
        const tl = gsap.timeline({
          defaults: { duration: 0.6, ease: EASE_IN_OUT },
          scrollTrigger: { trigger: tile, start: 'top 70%', once: true },
        });
        const sharp = $('[data-rack-sharp]', tile);
        const soft = $('[data-rack-soft]', tile);
        const focus = $$('[data-rack-focus]', tile);
        if (sharp) tl.from(sharp, { opacity: 1 }, 0);
        if (soft) tl.from(soft, { opacity: 0 }, 0);
        if (focus.length) tl.from(focus, { opacity: 0, scale: 0.85, duration: 0.32, ease: EASE_OUT }, 0.3);
      });

      $$('[data-bar-fill]').forEach((fill) => {
        if (!below(fill)) return;
        gsap.fromTo(
          fill,
          { scaleX: Number(fill.dataset.from) },
          {
            scaleX: Number(fill.dataset.to),
            duration: 0.6,
            ease: EASE_OUT,
            scrollTrigger: { trigger: fill, start: 'top 80%', once: true },
          },
        );
      });

      $$('[data-visual="cells"]').forEach((tile) => {
        const cells = $$('[data-cell]', tile);
        if (!cells.length || !below(tile)) return;
        gsap.from(cells, {
          opacity: 0,
          scale: 0.8,
          duration: 0.32,
          ease: EASE_OUT,
          stagger: 0.03,
          scrollTrigger: { trigger: tile, start: 'top 80%', once: true },
        });
      });

      $$('[data-band]').forEach((band) => {
        if (!below(band)) return;
        gsap.fromTo(
          band,
          { clipPath: CLIP_FROM_LEFT },
          {
            clipPath: CLIP_FULL,
            duration: 0.4,
            ease: EASE_OUT,
            scrollTrigger: { trigger: band, start: 'top 85%', once: true },
          },
        );
      });
    };

    mm.add({ pin: conditions.pinPyvulds, flow: `not all and ${conditions.pinPyvulds}` }, (context) => {
      if (context.conditions?.pin) {
        const cleanup = pinned();
        if (cleanup) return cleanup;
      }
      reveals();
      return undefined;
    });

    return () => {
      split?.revert();
      typed.forEach((t) => t.revert());
      if (beat) delete beat.dataset.typing;
      if (caret) gsap.set(caret, { clearProps: 'all' });
    };
  });

  return <div ref={ref}>{children}</div>;
}
