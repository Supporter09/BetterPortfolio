# RUNTIME — Hệ thống chuyển động & Storyboard Hồi I (Scenes 00–03)

> **File:** `02a-motion-system-and-act-1.md`  
> **Tài liệu cha:** `00-master-plan.md` (source of truth)  
> **Tài liệu phối hợp:** `01-design-system.md` (tokens & components), `02b-storyboard-act-2-3.md` (Scenes 04–08 & QA matrix)  
> **Ngôn ngữ:** Đặc tả bằng tiếng Việt; copy hiển thị trên giao diện (on-site copy) viết bằng **tiếng Anh**.

---

# PHẦN 1: HỆ THỐNG CHUYỂN ĐỘNG TOÀN CỤC (MOTION SYSTEM)

Hệ thống motion của RUNTIME lấy cảm hứng từ phòng dựng phim chuyên nghiệp và nhịp vận hành chuẩn xác của kỹ sư SRE. Chuyển động không phục vụ mục đích trang trí thuần tuý mà là công cụ dẫn dắt nhận thức (cognitive guidance), tạo nhịp thở điện ảnh (cinematic pacing) và chứng minh độ tin cậy kỹ thuật (technical precision).

---

## 1. Nguyên lý chuyển động & Ánh xạ ngôn ngữ điện ảnh

| Thuật ngữ điện ảnh | Ý nghĩa kỹ thuật & UX | Quy tắc & Thời điểm sử dụng | Thuộc tính CSS/GSAP cho phép |
|---|---|---|---|
| **Cut (Cắt cảnh)** | Chuyển trạng thái tức thời, dứt khoát | Dùng khi user nhảy nhanh qua Command Palette (`⌘K`), đổi tab, đóng modal, hoặc khi kích hoạt Tier C (Reduced Motion). Thời lượng: `0ms` hoặc `--dur-instant` (`120ms`). Tuyệt đối không giật layout. | `opacity`, `visibility`, `display` |
| **Dissolve / Crossfade (Chồng mờ)** | Chuyển dịch mềm mại giữa hai ngữ cảnh liên quan | Dùng khi tải poster sang video loop, hover đổi trạng thái card, chuyển ảnh/stills trong dải phim. Thời lượng: `--dur-fast` (`200ms`) đến `--dur-base` (`320ms`), ease: `--ease-standard`. | `opacity` duy nhất |
| **Rack Focus (Kéo nét)** | Hướng sự chú ý từ bối cảnh sang bằng chứng | Dùng trong case study PyVulDS (lọc 38 finding mờ thành 2 finding nét), hoặc làm mờ nhẹ nền trang trí khi mở HUD navigation. **Quy tắc bất di bất dịch:** Chỉ áp dụng `filter: blur()` trên layer đồ hoạ/trang trí; text nội dung và số liệu **luôn rõ nét**, không bao giờ làm mờ chữ. | `filter: blur(...)` trên layer `::before` hoặc SVG overlay |
| **Dolly / Push-in (Đẩy khung)** | Tiến sâu vào không gian quan sát | Dùng khi scroll-out khỏi Scene 01 (Opening Shot) hoặc phóng to frame media. Tỉ lệ scale giới hạn nghiêm ngặt từ `1.00` đến `1.06`, kết hợp đóng mép letterbox. Không scale vượt quá `1.08` để tránh vỡ texture và mỏi mắt. | `transform: scale()`, `clip-path` |
| **Whip-pan ( Lia máy nhanh)** | Chuyển hướng ngang dứt khoát | Chỉ dùng khi chuyển slide trong The Reel (Scene 05, Tier A) hoặc chuyển project lân cận. Thời lượng: `--dur-base` (`320ms`), ease: `--ease-in-out`. | `transform: translateX()`, `opacity` |
| **Letterbox (Khung phim 2.39:1)** | Khung hình điện ảnh widescreen | Xuất hiện ở Hero (Scene 01) và các phân đoạn pin (pin chỉ bật khi đạt guard chiều cao master §5.3: `pyvulds` khi `min-height: 720px`, `reel` khi `min-height: 600px`). Hai vạch đen tỉ lệ 2.39:1 tạo tiêu cự thị giác tập trung, thu hẹp hoặc mở rộng nhịp nhàng theo vị trí cuộn trang. | `clip-path: inset(top 0 bottom 0)` hoặc translateY của bar |

---

## 2. Cấu hình Lenis Smooth Scroll & Tích hợp GSAP Ticker

RUNTIME sử dụng **Lenis** trên `window` scroll mặc định (không bọc trong container `#scroll-container` nhằm giữ trọn vẹn hành vi cuộn gốc của trình duyệt và gesture iOS Safari). Lenis được điều phối hoàn toàn qua `gsap.ticker` để triệt tiêu hiện tượng xé hình (tearing) và lệch pha giữa thanh cuộn và ScrollTrigger.

**Ranh giới bundle (master §9.8):** GSAP và Lenis **không** nằm trong initial JS. `lib/motion/lenis.ts` và mọi module có `import { gsap }` chỉ được nạp bằng `import()` động sau first paint, qua `lib/motion/runtime.ts` (§3.2): GSAP ở Tier A/B, Lenis chỉ ở Tier A. Component chrome (HUD, timecode) không bao giờ import tĩnh các module này.

### 2.1 Cấu hình thông số (Parameters)
- `lerp: 0.09`: Độ trễ quán tính vừa đủ để tạo độ đầm điện ảnh nhưng không gây cảm giác "trôi nổi" (floaty/sluggish).
- `wheelMultiplier: 1.0`: Giữ tỉ lệ cuộn chuột 1:1 chính xác.
- `touchMultiplier: 1.0`: Không khuếch đại cảm ứng.
- `syncTouch: false`: **Bắt buộc `false`**. Không can thiệp hoặc mô phỏng cuộn trên mobile/touch screen để bảo toàn 100% momentum cuộn tự nhiên của iOS và Android.
- `autoResize: true`: Tự động tính toán lại kích thước viewport.

### 2.2 Snippet tích hợp Lenis + gsap.ticker (`lib/motion/lenis.ts`)

```typescript
// Module này chỉ được nạp qua import() động từ lib/motion/runtime.ts (Tier A), sau first paint.
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

export function initSmoothScroll(): () => void {
  // Chỉ chạy trên client và khi không bật reduced-motion
  if (typeof window === 'undefined') return () => {};
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return () => {};
  }

  lenisInstance = new Lenis({
    lerp: 0.09,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.0,
    syncTouch: false, // Tuyệt đối không can thiệp touch native trên mobile
    autoResize: true,
  });

  // Đồng bộ sự kiện cuộn của Lenis với ScrollTrigger
  lenisInstance.on('scroll', ScrollTrigger.update);

  // Đưa rAF của Lenis vào GSAP ticker để đồng bộ timing frame
  const tickerCallback = (time: number) => {
    lenisInstance?.raf(time * 1000);
  };
  gsap.ticker.add(tickerCallback);

  // Tắt lagSmoothing để tránh nhảy bước khi giật frame
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tickerCallback);
    lenisInstance?.destroy();
    lenisInstance = null;
  };
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}
```

### 2.3 Chính sách `ScrollTrigger.refresh()` (Refresh Policy)
Nhằm chống layout shifting (CLS) và tính toán sai toạ độ pin/trigger:
1. **Sau khi tải xong Web Fonts:** Gọi `document.fonts.ready.then(() => ScrollTrigger.refresh())` đảm bảo typography (Fraunces & Geist) render đúng bounding box trước khi tính vị trí.
2. **Sau khi tải poster media Hero:** Sự kiện `onLoad` của ảnh poster hoặc metadata video A1 kích hoạt `ScrollTrigger.refresh()`.
3. **Debounced Resize:** Lắng nghe window resize với debounce `200ms`, chỉ refresh khi chiều rộng viewport thay đổi thực sự (bỏ qua sự kiện đổi chiều cao ảo do thanh địa chỉ ẩn/hiện trên iOS Safari). Việc bật/tắt pin theo guard chiều cao (`pyvulds` cần `min-height: 720px`, `reel` cần `min-height: 600px`) do `gsap.matchMedia` trong `runtime.ts` tự xử lý khi media query đổi trạng thái, không phụ thuộc lần refresh này.

---

## 3. Hệ thống phân tầng chuyển động (Motion Tiers)

RUNTIME phân bổ trải nghiệm qua 3 tier nghiêm ngặt. Tier được xác định **trước paint** bằng inline boot script ghi `<html data-tier="A|B|C">` (§3.1); sau hydration, `useMotionTier()` đọc thuộc tính đó và theo dõi thay đổi bằng native `window.matchMedia` (§3.2). `gsap.matchMedia()` chỉ tồn tại bên trong module motion được import động, không bao giờ dùng để *phát hiện* tier (master §5.3, §9.8).

- **Tier A (Desktop Full):** Viewport $\ge 1024\text{px}$, chuột trỏ chính xác (`pointer: fine`), không bật reduced-motion. Đầy đủ Lenis, 2 section pin, custom cursor, SplitText, scrubbing mượt. **Guard chiều cao pin:** Pin #1 (`pyvulds`) chỉ khi `min-height: 720px`, Pin #2 (`reel`) chỉ khi `min-height: 600px`; dưới ngưỡng, scene tương ứng dùng layout không pin (vẫn ở Tier A).
- **Tier B (Mobile / Tablet Touch):** Viewport $< 1024\text{px}$ hoặc màn cảm ứng (`pointer: coarse`), không bật reduced-motion. Tắt Lenis (cuộn native), không pin ngang (chuyển sang dạng vuốt/card stack dọc), tắt custom cursor, video hero hạ 720p.
- **Tier C (Reduced Motion):** Hệ điều hành bật `prefers-reduced-motion: reduce`, hoặc người dùng chọn "Motion off" (lưu `localStorage.runtime_motion = 'off'`). Tắt hoàn toàn Lenis, tắt mọi hiệu ứng scrub/parallax/pin, mọi scene hiển thị trạng thái hoàn thiện cuối cùng ngay từ đầu, chỉ dùng transition mờ (`opacity \le 200\text{ms}`), preloader Cold Open được bỏ qua hoàn toàn. GSAP/Lenis **không được tải** ở Tier C.

### 3.1 Inline boot script ghi `data-tier` trước paint (canonical: `lib/boot/boot-script.ts`, 03a §4.3)

02a **không** định nghĩa script boot thứ hai. Nguồn duy nhất là chuỗi hằng `lib/boot/boot-script.ts` ở 03a §4.3, render đầu `<head>` trong `app/layout.tsx`. Script đó (bọc `try/catch`):

1. Đọc `localStorage.getItem('runtime_motion')` **trước tiên**: giá trị `'off'` (lựa chọn "Motion off" trong palette/menu) → tier `'C'`.
2. Nếu không có override: `prefers-reduced-motion: reduce` → `'C'`; `(min-width: 1024px) and (pointer: fine)` → `'A'`; còn lại → `'B'`.
3. Ghi `data-tier`, `data-js`, và `data-boot="play"` (chỉ khi tier ≠ C, đúng route `/`, không có `#hash`, chưa xem cold open trong session).

```tsx
// app/layout.tsx (trích): chỉ tham chiếu, chuỗi script nằm ở lib/boot/boot-script.ts (03a §4.3)
<html lang="en" data-active-scene="opening" suppressHydrationWarning>
  <head>
    <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
  </head>
  …
</html>
```

- Script chạy đồng bộ trước first paint → CSS dựa ngay vào `html[data-tier]` / `html[data-boot]` mà không nháy layout.
- **CSP:** hash `sha256-…` của đúng chuỗi 03a §4.3 (master §9.7, unit test so khớp hash ở 03a); không nonce, không `'unsafe-inline'` cho `script-src`.
- `suppressHydrationWarning` trên `<html>` vì `data-tier` / `data-active-scene` bị client ghi đè sau SSR.
- Điều kiện media query trong script phải khớp 1:1 với `MOTION_CONDITIONS` (§3.2).

### 3.2 Hook `useMotionTier` (`lib/motion/tiers.ts`) & nạp motion động (`lib/motion/runtime.ts`)

```typescript
'use client';

import { useSyncExternalStore } from 'react';

export type MotionTier = 'A' | 'B' | 'C';

// Khớp 1:1 với điều kiện trong lib/boot/boot-script.ts (03a §4.3).
export const MOTION_CONDITIONS = {
  reduced: '(prefers-reduced-motion: reduce)',
  desktopFine: '(min-width: 1024px) and (pointer: fine)',
} as const;

export const MOTION_PREF_KEY = 'runtime_motion'; // 'off' = người dùng chọn Motion off → Tier C

function motionOptOut(): boolean {
  try {
    return localStorage.getItem(MOTION_PREF_KEY) === 'off';
  } catch {
    return false;
  }
}

function computeTier(): MotionTier {
  if (motionOptOut()) return 'C'; // override ưu tiên trên mọi media query
  if (window.matchMedia(MOTION_CONDITIONS.reduced).matches) return 'C';
  return window.matchMedia(MOTION_CONDITIONS.desktopFine).matches ? 'A' : 'B';
}

function getSnapshot(): MotionTier {
  const t = document.documentElement.dataset.tier;
  return t === 'A' || t === 'B' || t === 'C' ? t : computeTier();
}

// SSR không biết tier → null. Component phải render trạng thái tĩnh (an toàn như Tier C)
// cho tới khi có tier thật; tuyệt đối không giả định 'A'.
function getServerSnapshot(): MotionTier | null {
  return null;
}

function subscribe(onChange: () => void): () => void {
  const lists = Object.values(MOTION_CONDITIONS).map((q) => window.matchMedia(q));
  // computeTier() kiểm runtime_motion trước, nên đổi media query không làm mất override 'off'.
  const handler = () => {
    document.documentElement.dataset.tier = computeTier();
    onChange();
  };
  lists.forEach((l) => l.addEventListener('change', handler));
  return () => lists.forEach((l) => l.removeEventListener('change', handler));
}

export function useMotionTier(): MotionTier | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
```

```typescript
// lib/motion/motion-provider.tsx — client component nhỏ, không import gsap/lenis tĩnh
'use client';

import { useEffect } from 'react';
import { useMotionTier } from '@/lib/motion/tiers';

export function MotionProvider() {
  const tier = useMotionTier();

  useEffect(() => {
    if (tier !== 'A' && tier !== 'B') return; // Tier C hoặc SSR: không tải GSAP/Lenis
    let cancelled = false;
    let stop: (() => void) | undefined;

    // useEffect chạy sau hydration, khi HTML SSR đã paint → đây là "sau first paint".
    import('@/lib/motion/runtime')
      .then(({ startMotion }) => startMotion(tier))
      .then((cleanup) => {
        if (cancelled) cleanup();
        else stop = cleanup;
      });

    return () => {
      cancelled = true;
      stop?.();
    };
  }, [tier]);

  return null;
}
```

```typescript
// lib/motion/runtime.ts — CHỈ được nạp qua import() động; nơi duy nhất dùng gsap.matchMedia
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export async function startMotion(tier: 'A' | 'B'): Promise<() => void> {
  let stopLenis = () => {};
  if (tier === 'A') {
    const { initSmoothScroll } = await import('./lenis'); // Lenis chỉ Tier A
    stopLenis = initSmoothScroll();
  }

  const mm = gsap.matchMedia();
  mm.add(
    {
      pinPyvulds: '(min-width: 1024px) and (pointer: fine) and (min-height: 720px) and (prefers-reduced-motion: no-preference)',
      pinReel: '(min-width: 1024px) and (pointer: fine) and (min-height: 600px) and (prefers-reduced-motion: no-preference)',
    },
    (context) => {
      const { pinPyvulds, pinReel } = context.conditions as { pinPyvulds: boolean; pinReel: boolean };
      // Đăng ký timeline từng scene tại đây; ScrollTrigger `pin: true` cho `pyvulds`/`reel`
      // chỉ khi guard tương ứng = true, ngược lại dùng layout không pin.
    },
  );

  return () => {
    mm.revert();
    stopLenis();
  };
}
```

### 3.3 Scene đang active: `<html data-active-scene>` (`components/chrome/scene-observer.tsx`)

Một observer duy nhất phản chiếu scene đang ở giữa viewport lên `<html data-active-scene="<scene-id>">` (master §5.3) và phát sự kiện `runtime:scenechange` cho Timecode HUD. Dùng `IntersectionObserver` (không cần GSAP nên chạy ở cả Tier C).

```typescript
'use client';

import { useEffect } from 'react';

export type SceneChangeDetail = { id: string; number: string; title: string };

export function SceneObserver() {
  useEffect(() => {
    const root = document.documentElement;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          const detail: SceneChangeDetail = {
            id: el.id,
            number: el.dataset.sceneNumber ?? '00',
            title: el.dataset.sceneTitle ?? '',
          };
          if (root.dataset.activeScene === detail.id) continue;
          root.dataset.activeScene = detail.id;
          window.dispatchEvent(new CustomEvent<SceneChangeDetail>('runtime:scenechange', { detail }));
        }
      },
      // Dải 1px ở giữa viewport → mỗi thời điểm chỉ một scene active.
      { rootMargin: '-50% 0px -50% 0px' },
    );
    document.querySelectorAll<HTMLElement>('[data-scene-number]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
```

```css
/* Grain & grade đọc trạng thái từ <html>, không cần JS riêng cho từng scene */
/* Nguồn duy nhất của grain 0.10: html[data-active-scene="field-notes"] */
html[data-active-scene='field-notes'] { --grain-opacity: 0.10; }
```

- `<SceneShell>` render `id="<scene-id>"` + `data-scene-number="04"` + `data-scene-title="Feature presentation"`; observer đọc ba thuộc tính này (title dùng cho `aria-label` của Timecode HUD, §5.1).
- Nếu sau này dùng ScrollTrigger `onToggle` thay IO (trong `runtime.ts`), nó phải ghi cùng thuộc tính và cùng sự kiện; không có nguồn thứ hai.

---

## 4. Quy chuẩn kỹ thuật cho SplitText

SplitText tạo nên ấn tượng thị giác tựa tiêu đề phim chiếu rạp, nhưng nếu lạm dụng sẽ gây vỡ layout và phá hủy khả năng tiếp cận (Accessibility).

### 4.1 Quy tắc áp dụng
1. **Giới hạn độ dài:** Chỉ áp dụng cho tiêu đề chính (headline) **dưới 8 từ** (ví dụ: tên *"Mai Văn Nhật Minh"*, tiêu đề slate scene). Tuyệt đối **không** áp dụng SplitText cho đoạn văn bản dài, body copy, hoặc bio.
2. **Khả năng tiếp cận (Accessibility):**
   - Thẻ cha chứa văn bản gốc phải giữ nguyên thuộc tính `aria-label="<Nguyên văn headline>"`.
   - Toàn bộ các thẻ `span` ký tự/từ con sinh ra bởi SplitText phải được gán thuộc tính `aria-hidden="true"`, hoặc cấu hình SplitText với cờ `aria: true`. Tránh việc trình đọc màn hình đọc ngắt quãng từng âm tiết.
3. **Dọn dẹp bộ nhớ (Revert on cleanup):** Luôn lưu instance của SplitText và gọi `.revert()` trong hook dọn dẹp hoặc scope cleanup của `useGSAP()` khi component unmount hoặc resize.
4. **Đồng bộ Font:** Chỉ khởi tạo SplitText sau khi `document.fonts.ready` resolve để kích thước bounding box của từng glyph chính xác tuyệt đối.
5. **Bảo toàn dấu tiếng Việt:** Font Fraunces hiển thị dấu tiếng Việt (ê, ế, ệ, ơ, ở, ũ...) cần khoảng đệm chiều dọc an toàn. Các container chứa từ/chữ cắt lát phải có `line-height: 1.15` trở lên và không dùng `overflow: hidden` quá sát mép trên/dưới gây cắt cụt dấu mũ và dấu thanh.

---

## 5. Logic Timecode HUD & Telemetry

Bộ đếm thời gian dạng phim (`TimecodeHUD`) thay thế cho thanh cuộn truyền thống, chạy đồng bộ theo tiến độ cuộn trang của người dùng.

### 5.1 Quy cách hiển thị & Công thức
- **Chuẩn hiển thị:** `SC [XX] · [HH]:[MM]:[SS]:[FF]` (Ví dụ: `SC 01 · 00:00:42:18`).
- **Tốc độ khung hình (Frame rate):** Chuẩn điện ảnh $24\text{ fps}$.
- **Thời lượng giả định (Nominal runtime):** $4\text{ phút}$ toàn phim ($240\text{ giây} = 5.760\text{ frames}$).
- **Scene index:** Lấy từ sự kiện `runtime:scenechange` do `SceneObserver` phát (cùng nguồn với `<html data-active-scene>`, §3.3); số scene đọc từ `data-scene-number` của `<SceneShell>` đang active.
- **Nguồn tiến độ:** Đọc `window.scrollY` và `document.documentElement.scrollHeight - window.innerHeight`. Lenis cuộn chính `window` nên sự kiện `scroll` gốc vẫn phát ở Tier A; **không** import tĩnh `lib/motion/lenis`.
- **Điều phối hiệu năng:** Chỉ cập nhật khi có sự kiện `scroll` (listener `passive: true`, throttle bằng một `requestAnimationFrame` mỗi frame); **không** có vòng lặp rAF chạy liên tục. Chỉ ghi DOM khi giá trị frame hoặc scene thay đổi.
- **Clamp cuối phim:** `frame = Math.min(Math.floor(progress * TOTAL_FRAMES), TOTAL_FRAMES)` → cuối trang hiển thị đúng `00:04:00:00` (khớp test `timecode.test.ts` ở 03a §9.2 và wireframe Scene 08 của 02b).
- **Tier C:** timecode **đóng băng theo scene**: không gắn scroll listener, chỉ tính lại một lần khi `runtime:scenechange` phát (và một lần lúc mount).
- **Hiển thị:** Chỉ từ $\ge 768\text{px}$ chiều rộng; **ẩn khi `max-height: 500px`** (điện thoại xoay ngang).
- **REC dot:** Nhấp nháy nhẹ ở Tier A/B; **tĩnh ở Tier C** (và khi tier chưa xác định lúc SSR).
- **Chip = một `<button>` duy nhất** (01 §5.2): `h-11` (44px) `px-3`, `rounded-sm`, `bg-bg-1/92 border border-line`, nền đặc, **không** hiệu ứng blur/glass (01 anti-pattern #2). Focus ring dùng base `:focus-visible` chung (2px `--grade-amber`, offset 2px); không override `outline`/`ring` cục bộ.
- **Khả năng tiếp cận:** REC dot và chuỗi timecode trong nút gắn `aria-hidden="true"`; nút mang `aria-label` theo mẫu `"Scene list. Current scene 04, Feature presentation"` (số + tên scene từ `runtime:scenechange`).
- **Mở scene list:** click dispatch `window` event `open-scene-palette`. Consumer duy nhất là listener **eager** trong `components/chrome/hud.tsx`: listener lazy-import `command-palette` rồi mở palette lọc sẵn nhóm `Scenes` (03a). TimecodeHUD không import palette.

### 5.2 Snippet Logic Timecode HUD (`lib/motion/timecode.ts` + `components/chrome/timecode-hud.tsx`)

```typescript
// lib/motion/timecode.ts — hàm thuần, có unit test (03a §9.2: progress 1 → 00:04:00:00)
export const NOMINAL_RUNTIME_SECONDS = 240; // 4 phút
export const FPS = 24;
export const TOTAL_FRAMES = NOMINAL_RUNTIME_SECONDS * FPS; // 5760

export function progressToFrame(progress: number): number {
  const p = Math.min(Math.max(progress, 0), 1);
  return Math.min(Math.floor(p * TOTAL_FRAMES), TOTAL_FRAMES);
}

export function formatTimecode(frameIndex: number, sceneNumber: string): string {
  const hours = Math.floor(frameIndex / (FPS * 3600));
  const rem1 = frameIndex % (FPS * 3600);
  const minutes = Math.floor(rem1 / (FPS * 60));
  const rem2 = rem1 % (FPS * 60);
  const seconds = Math.floor(rem2 / FPS);
  const frames = rem2 % FPS;

  const pad = (n: number) => n.toString().padStart(2, '0');
  return `SC ${sceneNumber} · ${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
}
```

```typescript
// components/chrome/timecode-hud.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useMotionTier } from '@/lib/motion/tiers';
import { formatTimecode, progressToFrame } from '@/lib/motion/timecode';
import type { SceneChangeDetail } from '@/components/chrome/scene-observer';

export function TimecodeHUD() {
  const tier = useMotionTier();
  const timecodeRef = useRef<HTMLSpanElement>(null);
  const sceneRef = useRef<string>('01');
  const lastKeyRef = useRef<string>('');
  const [scene, setScene] = useState<{ number: string; title: string }>({ number: '01', title: 'Opening' });
  const live = tier === 'A' || tier === 'B'; // Tier C / SSR: đóng băng theo scene

  useEffect(() => {
    let rafId = 0;

    const render = () => {
      rafId = 0;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const frame = progressToFrame(maxScroll > 0 ? window.scrollY / maxScroll : 0);
      const key = `${sceneRef.current}:${frame}`;
      if (key === lastKeyRef.current) return; // không đổi → không ghi DOM
      lastKeyRef.current = key;
      if (timecodeRef.current) {
        timecodeRef.current.textContent = formatTimecode(frame, sceneRef.current);
      }
    };

    // rAF-throttle: tối đa một lần render mỗi frame, chỉ khi có scroll/scene change.
    const schedule = () => {
      if (!rafId) rafId = requestAnimationFrame(render);
    };

    const onSceneChange = (event: Event) => {
      const { number, title } = (event as CustomEvent<SceneChangeDetail>).detail;
      sceneRef.current = number;
      setScene({ number, title });
      schedule();
    };

    if (live) window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('runtime:scenechange', onSceneChange);
    schedule(); // vẽ giá trị ban đầu một lần (ví dụ reload giữa trang)

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('runtime:scenechange', onSceneChange);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [live]);

  return (
    // Ẩn mặc định; chỉ hiện khi ≥768px rộng VÀ cao > 500px (ẩn ở max-height: 500px).
    // Focus ring lấy từ base :focus-visible (2px --grade-amber, offset 2px) — không override.
    <button
      type="button"
      aria-label={`Scene list. Current scene ${scene.number}, ${scene.title}`}
      className="fixed bottom-6 right-6 z-40 hidden [@media(min-width:768px)_and_(min-height:501px)]:flex h-11 items-center gap-3 px-3 rounded-sm bg-bg-1/92 border border-line"
      onClick={() => {
        window.dispatchEvent(new CustomEvent('open-scene-palette')); // consumer: hud.tsx (eager listener)
      }}
    >
      <span className={`w-2 h-2 rounded-full bg-rec ${live ? 'animate-pulse' : ''}`} aria-hidden="true" />
      <span
        ref={timecodeRef}
        aria-hidden="true"
        className="font-mono text-xs tracking-wider text-ink tabular-nums"
      >
        SC 01 · 00:00:00:00
      </span>
    </button>
  );
}
```

```typescript
// components/chrome/hud.tsx (trích) — listener eager, palette vẫn lazy
useEffect(() => {
  const open = () => {
    import('@/components/chrome/command-palette').then(({ openCommandPalette }) =>
      openCommandPalette({ group: 'Scenes' }),
    );
  };
  window.addEventListener('open-scene-palette', open);
  return () => window.removeEventListener('open-scene-palette', open);
}, []);
```

---

## 6. Chuyển trang (Page Transitions: `/` ↔ `/work/[slug]`)

Quá trình điều hướng giữa danh mục chính và case study chi tiết tuân thủ quy tắc bất đối xứng (asymmetric timing): **Rời cảnh nhanh, vào cảnh chậm và có chiều sâu**.

- **Exit (Rời trang):** $\le 250\text{ms}$, dùng ease `--ease-standard` hoặc `--ease-in-out`. Tối ưu hoá cảm giác phản hồi nhanh nhẹn, không bao giờ bắt người dùng đợi animation thoát.
- **Enter (Vào trang mới):** $500\text{ms} - 800\text{ms}$, dùng ease `--ease-out` (expo-out), tạo cảm giác mở màn khung hình điện ảnh.
- **Shared Element Flip:** Sử dụng GSAP `Flip` plugin trên duy nhất **1 cặp phần tử**: Media thumbnail của card dự án $\rightarrow$ Khung hero media của trang case study chi tiết (`data-flip-id="case-hero-${slug}"`).
- **Khôi phục vị trí cuộn (Scroll Restoration):** Lưu toạ độ `window.scrollY` vào `sessionStorage` khi rời `/`. Khi bấm Back từ case study quay lại `/`, Lenis tức thời gán toạ độ cuộn trước khi chạy animation xuất hiện, tránh việc giật trang về đầu dòng.
- **Tier C Fallback:** Bỏ qua Flip hoàn toàn, chuyển trang bằng hiệu ứng crossfade `opacity` tức thì $\le 200\text{ms}$.

---

## 7. Custom Viewfinder Cursor (Chỉ Tier A)

Con trỏ tuỳ biến chỉ hoạt động ở Tier A (`pointer: fine` và desktop) nhằm tôn vinh chủ đề ống kính điện ảnh mà không gây cản trở thao tác.

- **Trạng thái mặc định:** Một chấm tròn đường kính $6\text{px}$ màu `--ink`, di chuyển theo toạ độ chuột với độ trễ siêu nhỏ (`gsap.quickTo` x/y, duration `0.08s`).
- **Trạng thái ngắm (Viewfinder Brackets):** Khi hover lên ảnh, video, frame phim hoặc card dự án, chấm tròn nở thành 4 góc ngắm máy quay (viewfinder brackets `⌜ ⌝ ⌞ ⌟`) màu `--grade-amber` ôm lấy vùng nhìn.
- **Trạng thái nhãn (Label State):** Khi hover lên nút bấm hoặc liên kết media, con trỏ hiển thị chữ nhỏ font mono: `'VIEW'`, `'PLAY'`, `'EXPAND'`.
- **Nguyên tắc an toàn (Safety & A11y):**
  - **Tuyệt đối không ẩn focus ring bản địa:** Khi người dùng chuyển sang bấm phím Tab, custom cursor tự động ẩn hoàn toàn; focus ring bàn phím (`outline: 2px solid var(--grade-amber)`) hiển thị sắc nét.
  - Tắt hoàn toàn trên mọi thiết bị touch (`pointer: coarse`).

---

## 8. Quy tắc chuyển động Grain, Letterbox & Light Leak

- **Film Grain Overlay:**
  - Dùng SVG noise tĩnh hoặc Canvas 2D render vòng lặp bước nhảy (step animation) ở tần số **8–12 fps**, tuyệt đối **không render 60 fps** để tiết kiệm GPU và pin.
  - Định vị `fixed`, phủ toàn màn hình, `pointer-events: none`, `z-index: 70`.
  - Độ mờ: Mặc định `--grain-opacity: 0.06`; chỉ tăng lên `0.10` ở Scene 06 (Behind The Lens), điều khiển bằng selector `html[data-active-scene='field-notes']` (§3.3). Color grade theo scene cũng đọc cùng thuộc tính này.
  - Tự động ngắt (pause rAF) khi tab chuyển sang background (`document.hidden`).
- **Letterbox 2.39:1:**
  - Sử dụng CSS clip-path hoặc 2 thanh bar đen cố định.
  - Đóng nhẹ góc nhìn khi bước vào scene tập trung và mở rộng khi lướt qua bio.
- **Light Leak (Lọt sáng):**
  - Giới hạn nghiêm ngặt: **Chỉ xuất hiện tại Scene 06 (Field Notes)** cho footage du lịch và KAIST GPW.
  - Sử dụng radial gradient trôi nhẹ bằng GPU transform, không dùng tính toán pixel nặng.
  - Tắt hoàn toàn trong Tier C.

---

# PHẦN 2: STORYBOARD CHI TIẾT HỒI I (SCENES 00–03)

Hồi I mang tên **"Thiết lập" (The Setup)**: Đặt nhân vật vào bối cảnh, giới thiệu nhãn quan điện ảnh, chân dung kỹ thuật và lịch sử phát triển thực tế.

---

## SCENE 00: COLD OPEN (BOOT & SLATE)
**Mã scene:** `cold-open` · **Slate:** — · **Grade:** Neutral (`--bg-0`) · **Pin:** Overlay

### 1. Mục đích trong câu chuyện
Mở màn bằng một nghi thức khởi động hệ thống kỹ thuật: site index các scene, ống kính cân chỉnh, slate vỗ. Mang lại cảm giác tò mò, chỉn chu, kết hợp tính kỷ luật của SRE với nét hóm hỉnh nhẹ nhàng của đời sống kỹ sư. Boot log chỉ chứa dòng đúng sự thật về chính site hoặc dòng đùa rõ ràng; không thông số máy giả, không số phiên bản, không dòng tự nhận "đã kiểm chứng", không dòng audio (audio tắt mặc định).

### 2. Copy (EN)
```text
RUNTIME [SYSTEM BOOT]
[ OK ] scenes indexed: 9
[ OK ] lens.calibrate
[ OK ] letterbox: 2.39:1
[ .. ] coffee.sys: refill pending
[ OK ] slate.clap: SCENE 01 LOADED

[ Skip intro (Esc) ]
```

### 3. Wireframe Desktop 1440 (ASCII)
```text
+----------------------------------------------------------------------------------------------------+
|                                                                                [ Skip intro (Esc) ]|
|                                                                                                    |
|                                                                                                    |
|                                       RUNTIME [SYSTEM BOOT]                                        |
|                                                                                                    |
|                       [ OK ] scenes indexed: 9                                                     |
|                       [ OK ] lens.calibrate                                                        |
|                       [ OK ] letterbox: 2.39:1                                                     |
|                       [ .. ] coffee.sys: refill pending                                            |
|                       [ OK ] slate.clap: SCENE 01 LOADED                                           |
|                                                                                                    |
|                                              /=======\                                             |
|                                             | ///// |  CLAP! (Take 01)                             |
|                                              \=======/                                             |
|                                                                                                    |
+----------------------------------------------------------------------------------------------------+
```

### 4. Wireframe Mobile 390 (ASCII, Tier B: 4 dòng)
```text
+-----------------------------------------+
|                    [ Skip intro (Esc) ] |
|                                         |
|  RUNTIME [SYSTEM BOOT]                  |
|                                         |
|  [ OK ] scenes indexed: 9               |
|  [ OK ] lens.calibrate                  |
|  [ .. ] coffee.sys: refill pending      |
|  [ OK ] slate.clap: SCENE 01 LOADED     |
|                                         |
|                 /=====\                 |
|                | ///// | CLAP!          |
|                 \=====/                 |
|                                         |
+-----------------------------------------+
```

### 5. Timeline Beats
| Beat | Trigger / Thời điểm | Đối tượng | Thuộc tính chuyển động | Thời lượng / Ease | Stagger |
|---|---|---|---|---|---|
| **B0.1** | First paint (`0.0s`), chỉ khi `html[data-boot=play]` | Overlay & Skip button | `opacity: 0 -> 1` | `180ms` (`--ease-standard`) | — |
| **B0.2** | `0.15s` – `1.30s` | 5 dòng boot log text (Tier B: 4) | `opacity: 0 -> 1`, `transform: translateY(6px -> 0)` | `120ms` mỗi dòng | `240ms` (`animation-delay` theo dòng) |
| **B0.3** | `1.40s` – `1.85s` | Slate visual icon | `transform: rotate(-18deg -> 0deg)` (Clap hit) | `220ms` (`cubic-bezier(0.3, 1.4, 0.4, 1)`) | — |
| **B0.4** | `1.90s` – `2.30s` | Toàn bộ màn che Cold Open | `animation: boot-out 400ms var(--ease-out) 1.9s forwards`: `opacity: 1 -> 0`, `transform: scale(1 -> 1.02)`; keyframe cuối có `visibility: hidden` để overlay không chặn input | `400ms` (`--ease-out`) | — |
| **B0.5** | `2.30s` | Dọn dẹp | `cold-open-controller` gỡ `data-boot` khỏi `<html>` → `.cold-open { display: none }` | Tức thời | — |

### 6. Tier B (Mobile & Tablet)
- Nén beat: `html[data-tier=B]` đổi overlay sang `boot-out 400ms var(--ease-out) 1.2s forwards` (kết thúc ở $1.6\text{s}$), chỉ hiển thị 4 dòng (ẩn `letterbox`), delay từng dòng rút theo tỷ lệ. Nút "Skip intro" có kích thước tap target tối thiểu $44 \times 44\text{px}$.

### 7. Tier C (Reduced Motion)
- **Bỏ qua hoàn toàn (Bypass):** Với tier C (`prefers-reduced-motion: reduce` hoặc `runtime_motion = 'off'`), boot script (03a §4.3) **không bao giờ** đặt `data-boot`, nên `.cold-open` giữ `display: none` từ first paint; Scene 01 hiển thị trực tiếp. Không có nhánh React/JS riêng cho Tier C.

### 8. Tương tác & Bàn phím
- Khi cold open đang hiển thị, "Skip intro" là focus đầu tiên (đứng trước skip link trong DOM); khi cold open không hiển thị, skip link "Skip to content" là focus đầu tiên như mọi trang.
- Bấm phím `Escape` hoặc phím `Space`/`Enter` vào nút Skip: `cold-open-controller` gỡ `data-boot` ngay, chuyển cảnh vào Scene 01 trong `100ms`.
- Ghi nhận `sessionStorage.setItem('runtime_boot_seen', 'true')`. Khi user reload trang trong cùng session, boot script không đặt `data-boot` nên Cold Open tự động bỏ qua.

### 9. Hiệu năng & LCP Safe
- **Không chặn LCP:** HTML và text của Scene 01 (Opening Shot) nằm sẵn trong DOM ngay phía dưới overlay; trình duyệt phân tích và crawl nội dung tức thì.
- **Chỉ CSS keyframes**, gated bởi `html[data-boot=play]` (03a §4.3): overlay là markup RSC, không dùng GSAP (GSAP chỉ tải sau first paint + idle nên không thể điều khiển overlay lúc first paint). Overlay tự kết thúc ở $\le 2.3\text{s}$ dù chunk JS lỗi; tắt JS hoặc CSP chặn script → overlay không hiện (fail-safe).

### 10. Assets
- Không tải video/ảnh lớn. Chỉ dùng text Mono, SVG slate nhẹ ($< 2\text{KB}$).

---

## SCENE 01: OPENING SHOT (HERO)
**Mã scene:** `opening` · **Slate:** `SCENE 01 · TAKE 01 · OPENING SHOT` · **Grade:** Teal $\rightarrow$ Amber · **Pin:** Không pin (Scroll dolly tự nhiên)

### 1. Mục đích trong câu chuyện
Khai màn ấn tượng thị giác: Đưa người xem đến với góc máy toàn cảnh rộng mở (cinematic letterbox), công bố danh tính kỹ sư "Mai Văn Nhật Minh", định vị cốt lõi kết hợp giữa bảo mật, hạ tầng cloud và nghiên cứu thực nghiệm.

### 2. Copy (EN)
- **Slate Tag:** `SCENE 01 · TAKE 01 · OPENING SHOT`
- **Headline (Tên & Định vị):**
  - Name: `Mai Văn Nhật Minh`
  - Tagline: `Building secure, reliable systems across software, cloud infrastructure, and applied security research.`
- **Subheadline:**
  `I am a Cyber Security undergraduate at HUST with hands-on software engineering and DevOps/SRE experience. I build production tooling, cloud-native automation, and evidence-oriented security systems—from CI/CD and Kubernetes operations to path-aware vulnerability triage for Python repositories.`
- **CTAs:**
  - Primary CTA: `View my engineering and security work` (`href="#log"`)
  - Secondary CTA: `Watch the reel` (`href="#field-notes"`)

### 3. Wireframe Desktop 1440 (ASCII)
```text
+----------------------------------------------------------------------------------------------------+
| NM                                        VIETNAM · 21:04 ICT · ● REC                   [⌘K] [MENU]|
|----------------------------------------------------------------------------------------------------|
| [=========================== 2.39:1 CINEMATIC LETTERBOX BAR (TOP) ===============================] |
|                                                                                                    |
|    +------------------------------------------------------------------------------------------+    |
|    |                                                                                          |    |
|    |                                  [ HERO VIDEO LOOP A1 ]                                  |    |
|    |                                 (Wide aerial footage /                                   |    |
|    |                                   Slow directional pan)                                  |    |
|    |                                                                                          |    |
|    |       SCENE 01 · TAKE 01 · OPENING SHOT                                                  |    |
|    |       MAI VĂN NHẬT MINH                                                                  |    |
|    |                                                                                          |    |
|    |       Building secure, reliable systems across software,                                 |    |
|    |       cloud infrastructure, and applied security research.                               |    |
|    |                                                                                          |    |
|    |       I am a Cyber Security undergraduate at HUST with hands-on                          |    |
|    |       software engineering and DevOps/SRE experience...                                  |    |
|    |                                                                                          |    |
|    |       [ View my engineering and security work -> ]   [ Watch the reel -> ]               |    |
|    |                                                                                          |    |
|    +------------------------------------------------------------------------------------------+    |
|                                                                                                    |
| [========================== 2.39:1 CINEMATIC LETTERBOX BAR (BOTTOM) =============================] |
| [ ❙❙ Pause background video ]                                                  SC 01 · 00:00:12:04 |
+----------------------------------------------------------------------------------------------------+
```

### 4. Wireframe Mobile 390 (ASCII)
```text
+-----------------------------------------+
| NM                             [= MENU] |
|-----------------------------------------|
| [=== 2.39:1 LETTERBOX BAR (TOP) ===]    |
| +-------------------------------------+ |
| |                                     | |
| |        [ HERO VIDEO LOOP A1 ]       | |
| |                                     | |
| | SCENE 01 · TAKE 01                  | |
| | MAI VĂN NHẬT MINH                   | |
| |                                     | |
| | Building secure, reliable           | |
| | systems across software, cloud      | |
| | infrastructure, and applied         | |
| | security research.                  | |
| |                                     | |
| | I am a Cyber Security undergraduate | |
| | at HUST with hands-on software...   | |
| |                                     | |
| | [ View engineering work -> ]        | |
| | [ Watch the reel -> ]               | |
| +-------------------------------------+ |
| [== 2.39:1 LETTERBOX BAR (BOTTOM) ==]   |
| [ ❙❙ Pause background video ]           |
+-----------------------------------------+
```

### 5. Timeline Beats
| Beat | Trigger / Vị trí cuộn | Đối tượng | Thuộc tính chuyển động | Thời lượng / Ease | Stagger |
|---|---|---|---|---|---|
| **B1.1** | Vào trang (sau Cold Open) | Video letterbox frame | `clip-path` mở rộng từ tâm, `opacity: 0 -> 1` | `800ms` (`--ease-out`) | — |
| **B1.2** | Sau B1.1 (`+200ms`) | Name "Mai Văn Nhật Minh" | SplitText characters: `translateY(100% -> 0)`, `opacity: 0 -> 1` | `600ms` (`--ease-out`) | `35ms` |
| **B1.3** | Sau B1.2 (`+150ms`) | Tagline Headline | `translateY(24px -> 0)`, `opacity: 0 -> 1` | `500ms` (`--ease-out`) | — |
| **B1.4** | Sau B1.3 (`+100ms`) | Subheadline copy | `translateY(16px -> 0)`, `opacity: 0 -> 1` | `450ms` (`--ease-standard`) | — |
| **B1.5** | Sau B1.4 (`+100ms`) | 2 nút CTA | `translateY(12px -> 0)`, `opacity: 0 -> 1` | `350ms` (`--ease-standard`) | `80ms` |
| **B1.6** | Scroll progress `0% -> 100%` | Video background | `transform: scale(1.00 -> 1.06)`, `opacity: 1 -> 0.4` | Scrubbed với scroll | — |

### 6. Tier B (Mobile & Tablet)
- Thay thế video 1080p bằng phiên bản nén 720p hoặc poster ảnh WebP chất lượng cao để tiết kiệm băng thông mạng 4G/5G.
- Giảm biên độ SplitText; các ký tự xuất hiện theo từng từ (words) thay vì từng chữ cái (chars) để tối ưu vi xử lý di động.

### 7. Tier C (Reduced Motion)
- Video **không tự động phát (no autoplay)**: Hiển thị poster tĩnh; nút góc trái dưới đổi nhãn thành `Play background video` để người dùng tự phát.
- Bỏ hiệu ứng SplitText và dolly scale; toàn bộ tên, tiêu đề và CTA xuất hiện tức thời ở trạng thái cuối cùng (`opacity: 1`, `transform: none`).

### 8. Tương tác & Bàn phím
- Phím Tab di chuyển mượt mà: Skip to content $\rightarrow$ Logo `NM` $\rightarrow$ Nút `⌘K` $\rightarrow$ Menu $\rightarrow$ Primary CTA $\rightarrow$ Secondary CTA $\rightarrow$ `Pause background video`. Focus ring màu `--grade-amber` sắc nét với offset $2\text{px}$.
- Nút `Pause background video` (góc trái dưới khung hero, WCAG 2.2.2; 01 §5.11, 03a §5.3) là `<button>` thật, tap target $\ge 44 \times 44\text{px}$; bấm thì dừng loop A1 và đổi nhãn thành `Play background video`.
- Nhấp chuột vào Primary CTA cuộn mượt đến `#log`. Nhấp vào Secondary CTA cuộn đến `#field-notes`.

### 9. Hiệu năng
- Video hero A1 được nén với định dạng AV1/WebM + fallback MP4 H.264, không có audio track (muted). Bitrate và trần dung lượng theo 03a §5.1 (desktop ≤ 5 MB, mobile ≤ 2.5 MB).
- Thuộc tính CSS `will-change: transform` chỉ kích hoạt trong thời gian cuộn qua Scene 01 và tự huỷ khi ra khỏi viewport.

### 10. Assets
- **A1:** Hero loop video (8–12s, cảnh quay góc rộng, slow motion nhẹ, ẩn danh tính khuôn mặt, poster WebP tối ưu).

---

## SCENE 02: ORIGIN (ABOUT & TRAJECTORY)
**Mã scene:** `origin` · **Slate:** `SCENE 02 · TAKE 01 · ORIGIN` · **Grade:** Amber ấm (`--grade-amber`) · **Pin:** Không GSAP pin (Sử dụng CSS `position: sticky`)

### 1. Mục đích trong câu chuyện
Giải thích cội nguồn và quỹ đạo phát triển: Từ những ngày xây dựng sản phẩm web/hackathon ban đầu đến việc chuyển hướng sang kỹ thuật hạ tầng DevOps/SRE và tập trung chuyên sâu vào nghiên cứu bảo mật dựa trên bằng chứng (evidence-oriented security).

### 2. Copy (EN)
- **Slate Tag:** `SCENE 02 · TAKE 01 · ORIGIN`
- **Section Title:** `THE TRAJECTORY`
- **Short Bio (§3.3):**
  `Mai Van Nhat Minh is a Cyber Security undergraduate at Hanoi University of Science and Technology. His experience spans software engineering, cloud migration, CI/CD, Kubernetes operations, DevSecOps tooling, and AI-assisted SRE automation. His current security research project, PyVulDS, explores how learned vulnerability scores, bounded Deep-AST paths, and sink-aware evidence can produce more reviewable Python security findings.`
- **Narrative Anchor:**
  `"I care about what's actually in focus — in cinematography, it's the subject; in production systems, it's reliability; in security, it's verifiable evidence."`

### 3. Wireframe Desktop 1440 (ASCII)
```text
+----------------------------------------------------------------------------------------------------+
|                                                                                SC 02 · 00:00:48:16 |
|                                                                                                    |
|    SCENE 02 · TAKE 01 · ORIGIN                                                                     |
|    // 02. THE TRAJECTORY                                                                           |
|                                                                                                    |
|    +-----------------------------+   +--------------------------------------------------------+    |
|    | [PORTRAIT ASSET A4]         |   |                                                        |    |
|    |                             |   |  Mai Van Nhat Minh is a Cyber Security undergraduate   |    |
|    |  (Directional lighting,     |   |  at Hanoi University of Science and Technology.        |    |
|    |   dark background,          |   |                                                        |    |
|    |   amber tint grade,         |   |  His experience spans software engineering, cloud      |    |
|    |   viewfinder brackets ⌜ ⌝)  |   |  migration, CI/CD, Kubernetes operations, DevSecOps    |    |
|    |                             |   |  tooling, and AI-assisted SRE automation.              |    |
|    |                             |   |                                                        |    |
|    |                             |   |  His current security research project, PyVulDS,       |    |
|    |                             |   |  explores how learned vulnerability scores, bounded    |    |
|    |  (Sticky CSS: top: 120px)   |   |  Deep-AST paths, and sink-aware evidence produce       |    |
|    |                             |   |  more reviewable Python security findings.             |    |
|    |                             |   |                                                        |    |
|    |                             |   |  ----------------------------------------------------  |    |
|    |                             |   |  "I care about what's actually in focus — in           |    |
|    |                             |   |   cinematography, it's the subject; in production      |    |
|    |                             |   |   systems, it's reliability; in security, it's         |    |
|    |                             |   |   verifiable evidence."                                |    |
|    +-----------------------------+   +--------------------------------------------------------+    |
|                                                                                                    |
+----------------------------------------------------------------------------------------------------+
```

### 4. Wireframe Mobile 390 (ASCII)
```text
+-----------------------------------------+
| SCENE 02 · TAKE 01 · ORIGIN             |
| // 02. THE TRAJECTORY                   |
|                                         |
| +-------------------------------------+ |
| | [PORTRAIT A4]                       | |
| |                                     | |
| +-------------------------------------+ |
|                                         |
| Mai Van Nhat Minh is a Cyber Security   |
| undergraduate at Hanoi University of    |
| Science and Technology.                 |
|                                         |
| His experience spans software           |
| engineering, cloud migration, CI/CD,    |
| Kubernetes operations, DevSecOps        |
| tooling, and AI-assisted SRE...         |
|                                         |
| [Narrative Quote Card]                  |
| "I care about what's actually in focus  |
| — in cinematography, it's the subject;  |
| in systems, reliability; in security,   |
| verifiable evidence."                   |
+-----------------------------------------+
```

### 5. Timeline Beats
| Beat | Trigger / Vị trí cuộn | Đối tượng | Thuộc tính chuyển động | Thời lượng / Ease | Stagger |
|---|---|---|---|---|---|
| **B2.1** | `top 80%` vào viewport | Cột ảnh chân dung A4 | `opacity: 0 -> 1`, `clip-path: inset(0 0 100% 0 -> 0 0 0 0)` | `600ms` (`--ease-out`) | — |
| **B2.2** | `top 75%` vào viewport | Viewfinder brackets góc ảnh | `transform: scale(1.2 -> 1.0)`, `opacity: 0 -> 1` | `400ms` (`--ease-standard`) | — |
| **B2.3** | `top 70%` vào viewport | Toàn khối Bio (một block, không tách từ) | One-shot reveal: `opacity: 0 -> 1`, `transform: translateY(16px -> 0)`; trạng thái đầu chỉ đặt bằng `gsap.set()` trong `gsap.matchMedia()` | `450ms` (`--ease-out`), chạy **một lần** | — |
| **B2.4** | `top 40%` vào viewport | Khung Narrative Quote | `opacity: 0 -> 1`, `translateY(20px -> 0)` | `500ms` (`--ease-out`) | — |

### 6. Tier B (Mobile & Tablet)
- Không dùng 2 cột sticky; chân dung A4 đặt phía trên đoạn văn bản dạng linear stack thông thường.
- Bio dùng cùng one-shot block reveal như B2.3 (`opacity: 0 -> 1`, `translateY(16px -> 0)`, `450ms`, một lần); không tách từ, không làm mờ từng đoạn.

### 7. Tier C (Reduced Motion)
- Toàn bộ văn bản bio và ảnh chân dung hiển thị với độ mờ đầy đủ `opacity: 1` ngay từ đầu.
- Không có reveal bio, không clip-path animation.

### 8. Tương tác & Bàn phím
- Cột ảnh chân dung **không** focus được (không phải phần tử tương tác) và mặc định **không** có overlay. Chỉ thêm overlay thông tin ảnh nếu Minh cung cấp metadata thật của A4; không bịa thông số máy.
- Toàn bộ nội dung văn bản bio là thẻ HTML ngữ nghĩa `<p>`, cho phép người dùng chọn bôi đen (selectable) bình thường, không bị bọc bởi các layer cản trở sự kiện chuột.

### 9. Hiệu năng
- **Bảo đảm không GSAP Pin:** Sử dụng hoàn toàn CSS native `position: sticky; top: 120px;` cho cột ảnh trái. Nhờ đó trình duyệt tự quản lý composition thread mà không tốn chi phí layout recalculation từ JavaScript.
- Reveal bio chỉ dùng `opacity` + `transform`, tuyệt đối không thay đổi layout (`width`, `height`, `margin`).

### 10. Assets
- **A4:** Ảnh chân dung nghệ thuật mới (ánh sáng có hướng, phông tối, góc rộng lấy bối cảnh môi trường làm việc, xử lý tông màu hổ phách ấm `--grade-amber`).

---

## SCENE 03: THE LOG (EXPERIENCE GIT-GRAPH)
**Mã scene:** `log` · **Slate:** `SCENE 03 · TAKE 01 · THE LOG` · **Grade:** Teal lạnh kỹ thuật (`--grade-teal`) · **Pin:** Không pin

### 1. Mục đích trong câu chuyện
Trình bày kinh nghiệm thực tế qua hình tượng trực quan: một nhánh cây Git (`git log --graph --oneline`). Mỗi cột mốc sự nghiệp, giải thưởng và dự án nghiên cứu là một commit thật (Conventional Commits), minh bạch hoá mọi số liệu theo đúng Claim Ledger.

### 2. Copy (EN)
- **Slate Tag:** `SCENE 03 · TAKE 01 · THE LOG`
- **Section Heading:** `THE COMMIT LOG`
- **Sub-label:** `Work, research, and competition history. Reported figures are labelled as reported.`
- **Branch Lanes (5 nhánh):**
  - `main`: Học tập tại HUST Cyber Security
  - `work`: Kỹ thuật tại Selfomy & FPT Smart Cloud
  - `ship`: Sản phẩm thi đấu & Hackathons
  - `research`: Dự án nghiên cứu PyVulDS
  - `field`: Trải nghiệm quốc tế KAIST GPW
- **Commit types (5 loại):** `feat`, `perf`, `sec`, `award`, `research`. Mỗi commit khớp schema zod `LogCommit` ở 03a: `{ lane, type, scope, message, date, claimId? }` (`lane` ∈ 5 nhánh trên, `type` ∈ 5 loại này; `scope` là phần trong ngoặc như `hust`, `academic`, `pyvulds`; `claimId` trỏ về Claim Ledger nếu commit mang số liệu).
- **Danh sách Commits chuẩn xác** (hash chỉ mang tính minh hoạ, phải trùng với wireframe desktop):
  1. `0a12d` · `feat(hust): matriculate cyber security programme [2023-07]`  
     *Hanoi University of Science and Technology (SOICT).*
  2. `0e81c` · `award(academic): receive 3x academic achievement scholarships [2024.1, 2024.2, 2025.1]`  
     *Academic Achievement Scholarships for semesters 2024.1, 2024.2 and 2025.1.* (Odometer đếm `3`).
  3. `1f93b` · `feat(ship): deliver testeria at iai hackathon [2023]`  
     *2nd Prize. RPG educational game platform with Phaser & Next.js; WebSockets handling 50+ concurrent students.*
  4. `2a04e` · `feat(ship): build hust smart assistant at samsung soict [2023]`  
     *4th Place Track. Real-time student chatbot with OpenAI API & WebSockets. (Reported query accuracy: 90%).*
  5. `3b91f` · `feat(work): migrate selfomy service from vm to aws [2024-07 - present]`  
     *Software Engineer (remote). Migrated a service from a virtual machine to AWS; established CI/CD automation with GitHub Actions and integrated BugSnag for production error monitoring; hardened server infrastructure with firewall controls and CrowdSec; developed Laravel product features with unit and feature tests. Reported 30% reduction in production errors (CV-reported).* (Không odometer; mốc `present` phải được Minh xác nhận trước khi publish — launch blocker master §10.)
  6. `4d2c8` · `perf(work): automate sre release workflow at fpt smart cloud [2025-06 - 2025-12]`  
     *DevOps/SRE Intern. Built an automated SRE release-management ticket workflow that reduced manual operational steps by 70%.* (Odometer đếm `70%`).
  7. `5e8d3` · `feat(work): deploy argocd notifications for k8s sync status [2025-06 - 2025-12]`  
     *Deployed ArgoCD notifications for real-time Kubernetes synchronization status in the CI/CD workflow.*
  8. `6b19a` · `sec(work): operate centralized sonarqube for devsecops checks [2025-06 - 2025-12]`  
     *Set up and operated centralized SonarQube infrastructure for code-quality and security checks in a DevSecOps workflow.*
  9. `6d3f7` · `feat(work): develop internal ai assistant for sre operations [2025-06 - 2025-12]`  
     *Developed an internal AI assistant for answering SRE process and operations questions.*
  10. `8f2a1` · `feat(field): complete kaist soc global preview week [2026]`  
     *Completed in-person preview program in Daejeon & Seoul.*
  11. `7c4e2` · `research(pyvulds): evaluate path-aware vulnerability triage [2026-06]`  
     *Staged triage workflow for Python repositories combining local models, bounded Deep-AST, and sink gating.* (Status: `IN PRODUCTION`).

  Ranh giới FPT Smart Cloud (master §7): các mục 6–9 chỉ nêu outcome + công nghệ đúng câu chữ profile; không có tháng riêng cho từng mục (chỉ dùng khoảng thời gian thực tập), không mô tả kiến trúc/quy trình nội bộ.

### 3. Wireframe Desktop 1440 (ASCII)
```text
+----------------------------------------------------------------------------------------------------+
|                                                                                SC 03 · 00:01:24:08 |
|                                                                                                    |
|    SCENE 03 · TAKE 01 · THE LOG                                                                     |
|    // 03. THE COMMIT LOG (git log --graph --date=iso)                                              |
|                                                                                                    |
|    Lanes: (● main) (● work) (● ship) (● research) (● field)                                        |
|    ---------------------------------------------------------------------------------------------   |
|    GRAPH    HASH     COMMIT DETAILS                                                  METRIC/TAG    |
|    ---------------------------------------------------------------------------------------------   |
|    |        8f2a1    feat(field): complete kaist soc global preview week [2026]     [KAIST GPW]    |
|    | \                                                                                             |
|    |  *     7c4e2    research(pyvulds): path-aware vulnerability triage [2026-06]   [IN PRODUCTION]|
|    | /                                                                                             |
|    *  |     6d3f7    feat(work): internal ai assistant for sre [2025-06 - 2025-12]  [FPT CLOUD]    |
|    *  |     6b19a    sec(work): centralized sonarqube checks [2025-06 - 2025-12]    [FPT CLOUD]    |
|    *  |     5e8d3    feat(work): argocd k8s sync notifications [2025-06 - 2025-12]  [FPT CLOUD]    |
|    *  |     4d2c8    perf(work): automate sre release tickets [2025-06 - 2025-12]   [-70% STEPS]   |
|    |  |              >> Reduced manual operational steps by [ 70% ] <<                             |
|    *  |     3b91f    feat(work): migrate selfomy vm -> aws [2024-07 - present]      [SELFOMY]      |
|    |  |              >> Reported 30% reduction in production errors (CV-reported)                  |
|    |  *     2a04e    feat(ship): build hust smart assistant at samsung soict [2023] [4th PLACE]    |
|    |  *     1f93b    feat(ship): deliver testeria at iai hackathon [2023]           [2nd PRIZE]    |
|    *  |     0e81c    award(academic): receive academic achievement scholarships     [ 3 SCHOLAR ]  |
|    *        0a12d    feat(hust): matriculate cyber security programme [2023-07]     [HUST SOICT]   |
|    ---------------------------------------------------------------------------------------------   |
|                                                                                                    |
+----------------------------------------------------------------------------------------------------+
```

### 4. Wireframe Mobile 390 (ASCII)
```text
+-----------------------------------------+
| SCENE 03 · THE LOG                      |
| git log --graph                         |
|                                         |
| +-------------------------------------+ |
| | [2026] KAIST GPW                    | |
| | feat(field): complete global preview| |
| +-------------------------------------+ |
| | [2026-06] PYVULDS                   | |
| | research(pyvulds): staged triage    | |
| | Badge: [IN PRODUCTION]              | |
| +-------------------------------------+ |
| | [2025-06 - 2025-12] FPT SMART CLOUD | |
| | perf(work): automate sre tickets    | |
| | >> [ -70% ] manual steps <<         | |
| | + argocd · sonarqube · ai assistant | |
| +-------------------------------------+ |
| | [2024-07 - present] SELFOMY         | |
| | feat(work): migrate vm -> aws       | |
| | Reported 30% error reduction (CV)   | |
| +-------------------------------------+ |
| | [2024.1 - 2025.1] HUST ACADEMIC     | |
| | award(academic): [ 3 ] scholarships | |
+-----------------------------------------+
```

### 5. Timeline Beats
| Beat | Trigger / Vị trí cuộn | Đối tượng | Thuộc tính chuyển động | Thời lượng / Ease | Stagger |
|---|---|---|---|---|---|
| **B3.1** | `top 80%` vào viewport | Khung SVG Git-graph đường nối | `stroke-dashoffset` từ 100% về 0 | `800ms` (`--ease-standard`) | — |
| **B3.2** | Theo đường vẽ SVG | Các nốt commit (Commit nodes `●`) | `transform: scale(0 -> 1)`, `opacity: 0 -> 1` | `250ms` (`--ease-out`) | `60ms` |
| **B3.3** | Cùng lúc với B3.2 | Thẻ thông tin commit card | `transform: translateX(-16px -> 0)`, `opacity: 0 -> 1` | `320ms` (`--ease-out`) | `60ms` |
| **B3.4** | Thẻ FPT SRE vào `top 65%` | Odometer số liệu 70% | Số nhảy từ `00%` đến `70%` dạng counter mono | `900ms` (`power2.out`) | — |
| **B3.5** | Thẻ Học bổng vào `top 70%` | Odometer số liệu học bổng | Số nhảy từ `0` đến `3` | `600ms` (`power2.out`) | — |

### 6. Tier B (Mobile & Tablet)
- Ẩn bớt độ phức tạp của 5 đường SVG đa nhánh, chuyển thành 1 đường ray dọc duy nhất (single vertical spine) bên lề trái với các chấm commit nổi bật.
- Giữ nguyên hiệu ứng Odometer cho 70% và 3 học bổng khi lướt qua thẻ.

### 7. Tier C (Reduced Motion)
- Đường nét SVG vẽ sẵn $100\%$ độ dài; toàn bộ các thẻ commit hiển thị tĩnh không trượt.
- Odometer hiển thị tĩnh giá trị cuối cùng: `"70%"` và `"3"` ngay lập tức mà không chạy hiệu ứng đếm số.

### 8. Tương tác & Bàn phím
- **Cấu trúc ngữ nghĩa:** Danh sách commit được bọc trong thẻ `<ol aria-label="Professional and research experience timeline">`.
- Mỗi mục commit là một `<button aria-expanded="false/true">` có thể focus độc lập bằng phím Tab.
- Nhấn phím `Enter` hoặc `Space` mở rộng thông tin chi tiết (tech stack, vai trò, phạm vi công việc). **Không animate `height`:** phần chi tiết hiện tức thì (bỏ `hidden`), nội dung bên trong `opacity: 0 -> 1` + `translateY(8px -> 0)` trong `--dur-base` (Tier A/B); Tier C hiện tức thì.
- **Phím mũi tên nâng cao (Progressive Enhancement):** Người dùng có thể dùng `ArrowDown` và `ArrowUp` để di chuyển focus nhanh giữa các commit liên tiếp.

### 9. Hiệu năng & Ranh giới Claim (Claim Ledger Safety)
- **Kiểm soát Claim nghiêm ngặt:**
  - Odometer **chỉ áp dụng** cho `70%` (giảm bước thủ công tại FPT Smart Cloud) và số `3` (học bổng HUST). Caption của 70% chỉ được là: `FPT Smart Cloud, 2025. Reduction in manual operational steps for the SRE release-management ticket workflow.` (không thêm phương pháp đo).
  - Số liệu 30% tại Selfomy và 90% tại HUST Smart Assistant **tuyệt đối không dùng Odometer**, được ghi rõ chú thích `reported` trong nội dung mở rộng.
  - GPA hoàn toàn được ẩn (không hiển thị con số 3.82 hay 3.84) cho đến khi có bảng điểm chính thức.
  - Dự án PyVulDS gắn nhãn `<StatusBadge status="in-production" />`.

### 10. Assets
- Biểu tượng SVG git nhánh nhẹ; không sử dụng ảnh raster ngoài trừ logo vector nhỏ nếu cần.

---

## Ghi chú cho orchestrator

1. **Về việc phân tách tài liệu:** File này (`02a-motion-system-and-act-1.md`) bao quát toàn bộ Hệ thống Motion cốt lõi (Phần 1, 8 mục) và Storyboard Hồi I (Phần 2, Scene 00 `cold-open` đến Scene 03 `log`). Phần Storyboard Hồi II và III (Scene 04–08) cùng ma trận kiểm thử responsive và QA checklist được chuyển giao sang `02b-storyboard-act-2-3.md`.
2. **Khớp nối Token và Tiers:** Toàn bộ token màu (`--bg-0`, `--line`, `--ink`, `--grade-teal`, `--grade-amber`), font chữ (Fraunces, Geist, Geist Mono) và ease curve đã được đồng bộ chuẩn mực với `00-master-plan.md` và `01-design-system.md`.
3. **Kỷ luật Claim Ledger:** Đã áp dụng chuẩn xác quy tắc odometer cho 70% và 3 học bổng; các số liệu 30% và 90% đều giữ nhãn "reported" tĩnh; GPA hoàn toàn được giấu theo quy ước bảo mật thông tin.
4. Đã xử lý: Scene 03 bỏ tháng tự đặt (ArgoCD/SonarQube dùng khoảng thực tập 2025-06 – 2025-12), câu chữ FPT/Selfomy/học bổng theo profile, thêm AI assistant nội bộ, 30% ghi "Reported … (CV-reported)", hash minh hoạ khớp list ↔ wireframe.
5. Đã xử lý: tier detection qua inline boot script canonical `lib/boot/boot-script.ts` (03a §4.3; đọc `localStorage.runtime_motion` trước, ghi `data-tier`/`data-js`/`data-boot`, cần hash CSP, master §9.7) + native `matchMedia` qua `MOTION_CONDITIONS`, không import tĩnh GSAP, không mặc định `'A'`; GSAP/Lenis import động sau first paint trong `lib/motion/motion-provider.tsx` (GSAP Tier A/B, Lenis chỉ Tier A); `data-active-scene` qua `components/chrome/scene-observer.tsx`.
6. Đã xử lý: Timecode HUD đọc `window.scrollY`, chỉ cập nhật theo scroll (rAF-throttle), clamp tới `TOTAL_FRAMES` (cuối = `00:04:00:00`), `formatTimecode` ở `lib/motion/timecode.ts`, chip là một `<button>` 44px `rounded-sm` nền đặc, đóng băng theo scene ở Tier C, ẩn ở `max-height: 500px`, REC tĩnh ở Tier C, bỏ override focus cục bộ; `open-scene-palette` do listener eager trong `components/chrome/hud.tsx` xử lý.
7. Đã xử lý: HUD telemetry đổi sang `VIETNAM · 21:04 ICT · ● REC` (đổi tên thành phố chỉ khi Minh duyệt — master câu 6); guard chiều cao pin (720px/600px) được nêu ở §1, §2.3, §3.
8. Đã xử lý (review claim/a11y): cold open chỉ CSS keyframes gated `html[data-boot=play]`, kết thúc ≤ 2.3 s, boot log 5 dòng trung thực (không thông số máy, version, dòng audio); Scene 02 bỏ EXIF bịa, chân dung không focus được, bio reveal một khối thay cho tách từ; Scene 01 thêm nút `Pause background video` (WCAG 2.2.2) và bitrate theo 03a §5.1; Scene 03 sub-label nêu rõ số liệu reported, thêm commit types + `LogCommit`, mở commit không animate height.
