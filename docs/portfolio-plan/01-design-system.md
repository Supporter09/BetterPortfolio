# 01 — Design System “RUNTIME”

> Chi tiết hoá `00-master-plan.md` §2.1 (từ điển ẩn dụ), §4.2 (scene contract), §5 (token contract), §7 (claim ledger). Nếu mâu thuẫn, master thắng; điểm lệch có chủ đích ghi ở cuối file (“Ghi chú cho orchestrator”).
> Prose tiếng Việt; mọi chuỗi UI (label, aria-label, copy) bằng tiếng Anh.
> Phạm vi: màu, chữ, lưới, spacing, shape, icon, 16 component, `globals.css` Tailwind v4, anti-pattern. Motion timing chi tiết thuộc `02a`/`02b`; file này chỉ định nghĩa token và trạng thái tĩnh/hover/focus.

Quy ước: `px@375 → px@1440` là giá trị đo tại hai mốc viewport. Tỉ lệ contrast tính theo WCAG 2.x (relative luminance sRGB), làm tròn 2 chữ số.

---

## 1. Nguyên tắc thị giác

1. **Một khung hình, một chủ thể (rack focus).** Mỗi màn hình chỉ có một điểm nét: một headline, một số liệu, hoặc một media. Mọi thứ khác lùi về `--ink-2`/`--ink-3` hoặc nằm ngoài vùng scrim. Đúng một primary CTA amber trên mỗi màn hình (master §4.3).
2. **Grade mang nghĩa, không trang trí.** Teal = hệ thống, dữ liệu, link; amber = con người, hành động (CTA, focus). Mỗi scene nghiêng về một tông theo §2.6; không bao giờ trộn cả hai tông làm nền chữ trong cùng một khối đọc.
3. **Precision là typography.** Số liệu, timecode, hash, toạ độ luôn Geist Mono `tabular-nums`; không số nào “nhảy bề rộng”. Lưới Swiss 4/8/12 cột; mọi khoảng cách là bội của 4 px.
4. **Cạnh cứng như khung phim.** Radius 0–4 px; pill chỉ cho badge. Phân tầng bằng nền `bg-0 → bg-1 → bg-2` và hairline, không bằng đổ bóng, không glass.
5. **Analog có liều lượng.** Grain toàn trang ở 0.06; letterbox chỉ ở hero và hai scene pin; light leak chỉ ở `field-notes`. Hiệu ứng analog không bao giờ chạm vào chữ nội dung (không blur, không distort, không giảm contrast dưới AA).
6. **Trạng thái trung thực, không chỉ bằng màu.** Mọi trạng thái (REC, PRE-PRODUCTION, IN PRODUCTION, RELEASED, selected, error) có chữ + icon/hình; màu chỉ củng cố. Badge là thiết bị mã hoá claim ledger.
7. **DOM là bản dựng cuối (final cut).** Mọi số liệu, chữ, ảnh đều có trạng thái cuối nằm sẵn trong HTML; motion chỉ là lớp trình chiếu phủ lên. Tier C và no-JS thấy đúng nội dung đó.

---

## 2. Màu

### 2.1 Token gốc (master §5.1) — giá trị chốt

Tên giữ nguyên văn. Mọi giá trị khớp master §5.1 (`--ink-3` đã nâng lên `#9A9893`, lý do C-30).

| Token | Giá trị chốt | Master | Vai trò |
|---|---|---|---|
| `--bg-0` | `#0A0A0B` | = | Nền trang, letterbox bar |
| `--bg-1` | `#111113` | = | Surface nâng: HUD khi cuộn, palette, menu, input |
| `--bg-2` | `#18181B` | = | Card, panel, toast, hàng được chọn |
| `--line` | `#26262B` | = | Hairline trang trí (divider, viền card) |
| `--line-strong` | `#3A3A40` | = | Viền nhấn, hover viền, nền nút disabled |
| `--ink` | `#F2EEE8` | = | Chữ chính, headline |
| `--ink-2` | `#B9B6B0` | = | Chữ phụ, body dài trên nền tint mạnh |
| `--ink-3` | **`#9A9893`** | = | Meta, label, placeholder, viền input |
| `--grade-teal` | `#5BC8C0` | = | Link, dữ liệu, lane git, accent kỹ thuật |
| `--grade-amber` | `#F2A65A` | = | Primary CTA, focus ring, selection |
| `--rec` | `#FF4D3D` | = | Chấm REC / IN PRODUCTION; không làm chữ |
| `--grain-opacity` | `0.06` (scene `field-notes`: `0.10`) | = | Độ mờ lớp grain |

Biến dẫn xuất (không thuộc contract, chỉ dùng nội bộ component; khai báo trong `globals.css`):

| Biến | Giá trị | Công thức | Dùng |
|---|---|---|---|
| `--amber-hover` | `#F2AF6B` | amber trộn 12 % ink | Nút primary hover |
| `--amber-active` | `#D69351` | amber trộn 12 % bg-0 | Nút primary active |
| `--teal-hover` | `#81D2CA` | teal trộn 25 % ink | Link hover |
| `--scrim` | `rgb(10 10 11 / 0.75)` | bg-0 @ 75 % | Dải chữ phủ trên video |

### 2.2 Ánh xạ sang biến shadcn/ui

shadcn dùng `accent` cho **nền hàng được hover/chọn** (CommandItem, MenuItem), không phải “màu nhấn thương hiệu”. Vì `--ink` trên teal/amber chỉ đạt 1.74/1.75 (fail), `--accent` ánh xạ về surface, còn accent thương hiệu đi qua `--primary` và `--ring`.

| Biến shadcn | Ánh xạ | Contrast cặp chính |
|---|---|---|
| `--background` | `var(--bg-0)` | ink 17.12 |
| `--foreground` | `var(--ink)` | — |
| `--card` | `var(--bg-2)` | ink 15.33 |
| `--card-foreground` | `var(--ink)` | — |
| `--popover` | `var(--bg-1)` | ink 16.32 |
| `--popover-foreground` | `var(--ink)` | — |
| `--primary` | `var(--grade-amber)` | bg-0 trên amber 9.78 |
| `--primary-foreground` | `var(--bg-0)` | — |
| `--secondary` | `var(--bg-2)` | ink 15.33 |
| `--secondary-foreground` | `var(--ink)` | — |
| `--muted` | `var(--bg-1)` | ink-3 6.54 |
| `--muted-foreground` | `var(--ink-3)` | — |
| `--accent` | `var(--bg-2)` | ink 15.33 |
| `--accent-foreground` | `var(--ink)` | — |
| `--destructive` | `var(--rec)` | chỉ icon/viền; chữ trên nó = bg-0 (6.01) |
| `--destructive-foreground` | `var(--bg-0)` | — |
| `--border` | `var(--line)` | trang trí |
| `--input` | `var(--ink-3)` | ranh giới control ≥ 3:1 (6.54 trên bg-1) |
| `--ring` | `var(--grade-amber)` | 9.78 / 9.32 / 8.76 |
| `--radius` | `2px` | — |

### 2.3 Quy tắc dùng màu

- **Amber** = (a) nền primary CTA, (b) focus ring, (c) `::selection`, (d) viewfinder bracket khi hover/focus, (e) accent chủ đạo của scene `origin`/`field-notes`. Không dùng amber cho link thường, không cho số liệu, không cho icon trang trí.
- **Teal** = link (luôn có gạch chân), số liệu/odometer, lane git-graph, icon RELEASED, progress của player. Không làm nền nút (ink trên teal 1.74 fail; bg-0 trên teal 9.86 đạt nhưng sẽ cạnh tranh với primary amber).
- **Rec** = chỉ chấm tròn (REC trong HUD, IN PRODUCTION) và icon cảnh báo. **Không bao giờ** làm màu chữ thân, không làm nền lớn, không làm viền card. Tối đa một chấm rec nhìn thấy cùng lúc ngoài HUD.
- **Ink-3** = meta (ngày, hash, nhãn trục, caption, placeholder). Không dùng cho câu văn > 1 dòng; không dùng trên video.
- **Trên video/ảnh**: chỉ `--ink` (và `--ink-2` khi đã có scrim ≥ 0.75). Mọi chữ trên media phải nằm trong dải scrim.
- **Không** dùng `#000`/`#FFF` thuần; không dùng palette mặc định Tailwind (đã xoá bằng `--color-*: initial`).
- Không có chế độ sáng (master §9.3). `/cv` print stylesheet là ngoại lệ do `03a` định nghĩa.

### 2.4 Bảng contrast

Ngưỡng: chữ thường AA 4.5:1; chữ lớn (≥ 24 px, hoặc ≥ 18.66 px đậm) AA 3:1; thành phần phi văn bản (WCAG 1.4.11) 3:1. “Grain worst-case” = pixel grain trắng phủ ở chế độ `normal` với opacity tương ứng — mô hình bảo thủ; thực tế grain dùng `overlay` gần như không đổi nền (dòng C-33).

**Chữ trên surface phẳng**

| # | Chữ | Nền | Tỉ lệ | Ngưỡng | Kết quả |
|---|---|---|---|---|---|
| C-01 | ink `#F2EEE8` | bg-0 | 17.12 | 4.5 | ✅ AAA |
| C-02 | ink | bg-1 | 16.32 | 4.5 | ✅ AAA |
| C-03 | ink | bg-2 | 15.33 | 4.5 | ✅ AAA |
| C-04 | ink-2 `#B9B6B0` | bg-0 | 9.78 | 4.5 | ✅ AAA |
| C-05 | ink-2 | bg-1 | 9.32 | 4.5 | ✅ AAA |
| C-06 | ink-2 | bg-2 | 8.76 | 4.5 | ✅ AAA |
| C-07 | ink-3 `#9A9893` | bg-0 | 6.87 | 4.5 | ✅ AA |
| C-08 | ink-3 | bg-1 | 6.54 | 4.5 | ✅ AA |
| C-09 | ink-3 | bg-2 | 6.15 | 4.5 | ✅ AA |
| C-10 | grade-teal `#5BC8C0` | bg-0 | 9.86 | 4.5 | ✅ AAA |
| C-11 | grade-teal | bg-1 | 9.40 | 4.5 | ✅ AAA |
| C-12 | grade-teal | bg-2 | 8.83 | 4.5 | ✅ AAA |
| C-13 | grade-amber `#F2A65A` | bg-0 | 9.78 | 4.5 | ✅ AAA |
| C-14 | grade-amber | bg-1 | 9.32 | 4.5 | ✅ AAA |
| C-15 | grade-amber | bg-2 | 8.76 | 4.5 | ✅ AAA |
| C-16 | bg-0 (chữ nút) | grade-amber | 9.78 | 4.5 | ✅ AAA |
| C-17 | bg-0 | amber-hover `#F2AF6B` | 10.48 | 4.5 | ✅ AAA |
| C-18 | bg-0 | amber-active `#D69351` | 7.68 | 4.5 | ✅ AAA |
| C-19 | teal-hover `#81D2CA` | bg-0 | 11.31 | 4.5 | ✅ AAA |
| C-20 | teal-hover | bg-2 | 10.13 | 4.5 | ✅ AAA |
| C-21 | bg-0 (destructive-fg, dự phòng) | rec | 6.01 | 4.5 | ✅ AA |
| C-22 | bg-0 (`::selection`) | grade-amber | 9.78 | 4.5 | ✅ AAA |

**Chữ trên nền grade theo scene** (tint = trộn accent vào bg-0)

| # | Nền | ink | ink-2 | ink-3 | accent dẫn | Kết quả |
|---|---|---|---|---|---|---|
| C-23 | teal 6 % `#0F1516` | 15.95 | 9.11 | 6.40 | teal 9.19 | ✅ |
| C-24 | teal 10 % `#121D1D` | 14.90 | 8.51 | 5.98 | teal 8.59 | ✅ |
| C-25 | amber 8 % `#1D1611` | 15.46 | 8.83 | 6.20 | amber 8.83 | ✅ |
| C-26 | amber 12 % `#261D14` (chỉ mép vignette) | 14.33 | 8.19 | 5.75 | amber 8.18 | ✅ |

**Grain worst-case**

| # | Nền | ink-3 | ink-2 | Kết quả |
|---|---|---|---|---|
| C-27 | bg-0 + grain 0.06 `#19191A` | 6.10 | 8.68 | ✅ |
| C-28 | bg-0 + grain 0.10 `#222223` | 5.52 | 7.86 | ✅ |
| C-29 | bg-1 + grain 0.06 `#1F1F21` | 5.71 | 8.13 | ✅ |
| C-30 | bg-2 + grain 0.10 `#2F2F32` | 4.63 | 6.60 | ✅ (master `#8C8A86` chỉ đạt **3.87** ❌ → lý do đổi `--ink-3`) |
| C-31 | teal 10 % + grain 0.06 `#202B2B` | 5.05 | 7.20 | ✅ (master ink-3: 4.23 ❌) |
| C-32 | amber 8 % + grain 0.10 `#342D29` | 4.69 | 6.68 | ✅ (master ink-3: 3.92 ❌) |
| C-33 | bg-0 + grain 0.10 `overlay` `#0B0B0C` | 6.83 | 9.73 | ✅ (trường hợp thực tế) |

**Chữ trên video** (worst-case: pixel video trắng `#FFFFFF` dưới scrim bg-0)

| # | Scrim | Nền tương đương | ink | ink-2 | ink-3 | Quy định |
|---|---|---|---|---|---|---|
| C-34 | 0.65 | `#606060` | 5.44 | 3.11 ❌ | 1.83 ❌ | Chỉ headline `--ink` ≥ 24 px |
| C-35 | 0.75 | `#474748` | 8.03 | 4.59 | 3.22 ❌ | **Mặc định dải chữ hero**; ink-3 cấm trên video |

**Cặp bị cấm** (fail — lint/review phải chặn)

| # | Chữ | Nền | Tỉ lệ | Lý do cấm |
|---|---|---|---|---|
| C-36 | ink | rec | 2.85 | Nền rec không bao giờ chứa chữ sáng |
| C-37 | ink | grade-amber | 1.75 | Nút amber luôn dùng chữ bg-0 |
| C-38 | ink | grade-teal | 1.74 | Teal không làm nền chữ |

**Phi văn bản (≥ 3:1)**

| # | Thành phần | Nền | Tỉ lệ | Kết quả |
|---|---|---|---|---|
| N-01 | Focus ring amber | bg-0 / bg-1 / bg-2 | 9.78 / 9.32 / 8.76 | ✅ |
| N-02 | Chấm rec | bg-0 / bg-1 / bg-2 | 6.01 / 5.73 / 5.38 | ✅ |
| N-03 | Viền input `--input` (= ink-3) | bg-0 / bg-1 | 6.87 / 6.54 | ✅ |
| N-04 | Lane/node git teal | bg-0 | 9.86 | ✅ |
| N-05 | Lane phụ ink-3 | bg-0 | 6.87 | ✅ |
| N-06 | Scrubber track ink-3 / progress teal | bg-0 scrim | ≥ 3.22 / ≥ 7 | ✅ |
| N-07 | `--line` / `--line-strong` | bg-0 | 1.31 / 1.75 | Chỉ trang trí — không là dấu hiệu nhận diện duy nhất của control |

Script kiểm lại (stdlib, chạy ở P0 khi đổi token): công thức `L = 0.2126R + 0.7152G + 0.0722B` sau khi tuyến tính hoá sRGB; `ratio = (L1 + 0.05)/(L2 + 0.05)`.

### 2.5 Grade theo scene

Grade thực hiện bằng `::before` của `<section data-scene="…">` (gradient tĩnh, `z-index: -1`, `pointer-events: none`). Footage được grade sẵn khi export (LUT teal-shadow/amber-highlight); CSS chỉ bổ sung tint và vignette. Tint vùng chữ không vượt các mức đã đo ở §2.4; mức cao hơn chỉ ở mép (vignette) nơi không có chữ.

| Scene `id` | Nền / gradient | Vignette | Accent dẫn | Grain | Letterbox | Light leak |
|---|---|---|---|---|---|---|
| `cold-open` | bg-0 phẳng | không | ink; amber chỉ cho focus “Skip intro” | 0.06, tĩnh | không | không |
| `opening` | Video full-bleed; trên cùng radial teal 8 % tại `50% 0%`; đáy radial amber 6 % tại `50% 110%`; dải chữ scrim 0.75 | ellipse, trong suốt 55 % → bg-0 @ 60 % ở mép | teal (meta, HUD) → amber (primary CTA) | 0.06 | **Có**: bar 2.39:1 (landscape); khung media 2.39:1 (portrait) | không |
| `origin` | bg-0; radial amber 7 % tại `85% 20%` (phía portrait), cột chữ phẳng | nhẹ, bg-0 @ 35 % | amber | 0.06 | không | không |
| `log` | bg-0; radial teal 6 % tại `8% 0%` (phía rail git) | không | teal (lane, hash type) | 0.06 | không | không |
| `pyvulds` | Linear bg-0 → teal 10 % ở hai mép trái/phải (cột giữa ≤ 6 %) | mạnh, bg-0 @ 70 % | teal (đậm nhất); evidence cuối = teal + ink | 0.06 | **Có** khi pin #1 (Tier A); Tier B/C không | không |
| `reel` | bg-0 phẳng; mỗi case card tự mang grade (top hairline teal cho engineering, amber cho award) | không | mixed | 0.06 | **Có** khi pin #2 (Tier A, ≥ 1024) | không |
| `field-notes` | Radial amber 8 % toàn vùng chữ, 12 % ở mép; dải negative strip nền bg-1 | bg-0 @ 50 % | amber (đậm nhất) | **0.10** | không | **Có** (§2.8) |
| `credits` | bg-0 phẳng | không | ink; link teal | 0.06 | không | không |
| `next-scene` | Hai radial: teal 6 % tại `0% 50%`, amber 6 % tại `100% 50%` | nhẹ, bg-0 @ 35 % | teal (research, badge) + amber (CTA cuối) | 0.06 | không | không |

Grain 0.10 khi `html[data-active-scene="field-notes"]` (SceneObserver `components/chrome/scene-observer.tsx`, 02a §3.3 — nguồn duy nhất); Tier C đổi theo scene nhưng không tween.

### 2.6 Grain

- **Kỹ thuật:** một `<div class="grain" aria-hidden="true">` cố định, `z-index: 70`, `pointer-events: none`. Ảnh nguồn: **SVG `feTurbulence` inline data-URI** (`fractalNoise`, `baseFrequency 0.85`, `numOctaves 2`, `stitchTiles`, desaturate) — 0 request, ~450 byte, tile 256 px. Phương án thay thế khi profiling thấy rasterize SVG tốn: PNG noise 256×256 xám trung tính ≤ 20 KB trong `public/`.
- **Opacity:** `var(--grain-opacity)` = 0.06; 0.10 khi `html[data-active-scene="field-notes"]`.
- **Blend:** `mix-blend-mode: overlay`. Trên Tier B nếu đo thấy jank khi cuộn (blend toàn màn hình), hạ xuống `normal` + opacity 0.04 (đã nằm trong biên C-27).
- **Jitter:** chỉ Tier A — `transform: translate()` theo 10 bước/giây (`steps(1)` giữa 10 keyframe), layer lớn hơn viewport 64 px mỗi phía để không lộ mép. Tier B: tĩnh. Tier C: tĩnh. Dừng khi `document.hidden` (CSS animation tự throttle; nếu chuyển sang Canvas thì pause rAF — `02a` §8).

### 2.7 Letterbox 2.39:1

- **Ở đâu:** `opening` (luôn có), pin #1 `pyvulds` và pin #2 `reel` (chỉ Tier A, bar trượt vào khi pin bắt đầu, rút ra khi unpin). Không ở nơi khác.
- **Hình học:** chiều cao mỗi bar `max(0px, (100svh - 100vw / 2.39) / 2)`; khi viewport đã hẹp hơn 2.39:1 (bar = 0) thì không render bar. Màu bar `--bg-0` + hairline `--line` ở mép trong.
- **Portrait (< 768 hoặc `aspect-ratio < 1`):** không dùng bar toàn màn hình (sẽ ăn 80 % viewport); thay bằng khung media `aspect-ratio: 2.39 / 1` full-width, chữ nằm dưới khung.
- **Nội dung trong bar:** cho phép một dòng meta mono `ink-3` (`2.39:1 · 24 FPS` hoặc slate scene) — chỉ chữ thật, không thông số máy giả.
- Tier C: bar tĩnh ở trạng thái cuối, không animate.

### 2.8 Light leak (chỉ `field-notes`)

- Hai radial gradient amber (22 % và 14 %), `mix-blend-mode: screen`, opacity 0.8, neo ở góc trên-phải và dưới-trái của scene, **bên ngoài cột chữ** (cột chữ nằm trên plate bg-1 hoặc vùng tint ≤ 8 %).
- Tier A: trôi `translate ±4 %` trong 12 s `ease-in-out` alternate (GPU transform). Tier B: tĩnh. Tier C: **không render** (`02a` §8).
- Không dùng màu rec trong leak; không phủ lên negative strip khi frame đang ở trạng thái “developed”.

---

## 3. Typography

### 3.1 Họ chữ và vai trò

| Token | Font | Vai trò | Ghi chú |
|---|---|---|---|
| `--font-display` | Fraunces (roman) | Tên hero, tiêu đề scene, tiêu đề case, credits | Sentence case; không viết HOA toàn bộ (dấu chồng trên chữ hoa như “Ấ”, “Ậ” cần thêm line-height) |
| `--font-display` + italic | Fraunces Italic (instance riêng, §3.6) | Phụ đề, pull quote “I care about what's actually in focus.”, caption phim | Utility `font-display-italic` |
| `--font-sans` | Geist | Body, UI, nút, menu | Weight 400 body, 500 UI, 600 tiêu đề nhỏ |
| `--font-mono` | Geist Mono | HUD, timecode, slate, hash, số liệu, code, badge | Luôn `font-variant-numeric: tabular-nums slashed-zero` cho số |

Trục Fraunces theo vai trò (`font-optical-sizing: auto` mặc định — opsz bám cỡ chữ; chỉ ghi đè ở hero):

| Vai trò | opsz | wght | SOFT | WONK | Ghi chú |
|---|---|---|---|---|---|
| Hero name (`display-2xl`) | 144 (cố định) | 340 | 50 | 0 | Mềm như title card phim; WONK 0 để “Minh”, “Nhật” không nghiêng lệch |
| Scene title (`display-xl`) | auto (≈ 112) | 380 | 0 | 0 | Sắc, trung tính |
| Case / section title (`display-lg`, `display-md`) | auto | 420 | 0 | 0 | — |
| Heading (`heading-lg`, `heading-md`) | auto | 460 | 0 | 0 | Fraunces ở cỡ nhỏ cần đậm hơn để giữ nét mảnh |
| Credits name | auto | 360 | 100 | 0 | Cảm giác end credits |
| `/404` title “Scene not found” | auto | 380 | 50 | 1 | Ngoại lệ duy nhất dùng WONK |
| Italic phụ đề | auto | 360 | — | — | Instance italic chỉ có opsz + wght |

SOFT/WONK là **nâng cấp**: nếu P0 bỏ trục (03a §6.2 bước 3) thì `font-variation-settings` bị trình duyệt bỏ qua, layout không đổi.

### 3.2 Thang chữ fluid

Công thức: `clamp(min, intercept + slope·100vw, max)`, nội suy tuyến tính 375 → 1440. Phần `rem` trong intercept giúp chữ vẫn phóng theo zoom trình duyệt (WCAG 1.4.4); kiểm 200 % zoom ở QA.

| Token | Font | px@375 → px@1440 | `clamp()` | Line-height | Tracking | Weight |
|---|---|---|---|---|---|---|
| `display-2xl` | Fraunces | 56 → 160 | `clamp(3.5rem, 1.211rem + 9.765vw, 10rem)` | 1.1 | -0.025em | 340 |
| `display-xl` | Fraunces | 44 → 112 | `clamp(2.75rem, 1.254rem + 6.385vw, 7rem)` | 1.1 | -0.02em | 380 |
| `display-lg` | Fraunces | 36 → 80 | `clamp(2.25rem, 1.282rem + 4.131vw, 5rem)` | 1.12 | -0.015em | 420 |
| `display-md` | Fraunces | 30 → 56 | `clamp(1.875rem, 1.303rem + 2.441vw, 3.5rem)` | 1.15 | -0.01em | 420 |
| `heading-lg` | Fraunces | 24 → 36 | `clamp(1.5rem, 1.236rem + 1.127vw, 2.25rem)` | 1.2 | -0.005em | 460 |
| `heading-md` | Fraunces | 20 → 28 | `clamp(1.25rem, 1.074rem + 0.7512vw, 1.75rem)` | 1.25 | 0 | 460 |
| `heading-sm` | Geist | 18 → 22 | `clamp(1.125rem, 1.037rem + 0.3756vw, 1.375rem)` | 1.3 | -0.005em | 600 |
| `body-lg` | Geist | 18 → 20 | `clamp(1.125rem, 1.081rem + 0.1878vw, 1.25rem)` | 1.6 | 0 | 400 |
| `body` | Geist | 16 → 17 | `clamp(1rem, 0.978rem + 0.0939vw, 1.0625rem)` | 1.65 | 0 | 400 |
| `body-sm` | Geist | 14 → 15 | `clamp(0.875rem, 0.853rem + 0.0939vw, 0.9375rem)` | 1.55 | 0.005em | 400 |
| `label` | Geist Mono | 12 → 13 | `clamp(0.75rem, 0.728rem + 0.0939vw, 0.8125rem)` | 1.4 | 0.08em (UPPERCASE) | 500 |
| `caption` | Geist / Geist Mono | 12 → 12 | `0.75rem` | 1.45 | 0.02em | 400 |

Số liệu lớn (OdometerMetric) dùng Geist Mono ở cỡ `display-lg`, weight 300, tracking -0.02em, line-height 1.

Giá trị trung gian tham khảo: `display-2xl` = 94 px @768, 119 px @1024; `display-xl` = 69 / 85 px.

Tên hero “Mai Văn Nhật Minh” ở 160 px vượt bề rộng khung → luôn ngắt hai dòng cố định: `Mai Văn` / `Nhật Minh` (`<span class="block">`), ở mọi breakpoint. Bọc tên bằng `<span lang="vi">` để screen reader đọc đúng tiếng Việt trong trang `lang="en"`.

### 3.3 Dấu tiếng Việt (stacked diacritics)

- Line-height tối thiểu: display **1.1**, heading 1.2, body **1.5–1.7** (đã chốt trong bảng).
- SplitText: wrapper dòng/chữ có `overflow: hidden` để làm mask **phải** thêm `padding-block: 0.14em; margin-block: -0.14em;` (utility `split-safe`) để dấu “ậ”, “ỗ”, “ữ” không bị cắt; line-height của container SplitText ≥ 1.15 (`02a` §4.1). Sau `SplitText.revert()` mọi style tạm bị gỡ.
- Không dùng `text-transform: uppercase` cho Fraunces có tiếng Việt; label mono uppercase chỉ chứa chuỗi tiếng Anh.
- Letterbox bar, HUD và mask clip-path không được cắt vào vùng `ascent` của dòng đầu tiên: khoảng cách tối thiểu từ mép mask tới đỉnh chữ = `0.2em`.
- Chuỗi test visual regression (03b R4): `Mai Văn Nhật Minh · ỗ ữ ặ ẫ ợ ự · Ấ Ậ Ỗ` ở cả ba font.

### 3.4 Measure và đoạn văn

- Đoạn đọc: `max-width: 68ch` (khoảng 60–72 ch tuỳ font fallback); token `--container-measure`.
- Lead/sub-headline: `max-width: 40ch`. Headline: `text-wrap: balance`. Body: `text-wrap: pretty`.
- Khoảng cách đoạn = `1em`; không thụt đầu dòng. Danh sách dùng marker `—` màu ink-3 cho meta, bullet mặc định cho nội dung.
- Link trong đoạn: teal, gạch chân `1px`, `text-underline-offset: 0.2em`; hover đổi `--teal-hover` và gạch chân dày `2px`.

### 3.5 Số, mono và code

- `tabular-nums slashed-zero` cho timecode, hash, ngày, số liệu, odometer; `lining-nums` cho Fraunces khi chứa số (năm trong credits).
- Timecode luôn đủ 4 cặp `HH:MM:SS:FF`; hash commit 7 ký tự.
- Code block (case study): nền bg-1, viền `--line`, Geist Mono `body-sm`, line-height 1.6, `tab-size: 2`; syntax highlight giới hạn 4 màu: ink (mặc định), ink-3 (comment), teal (keyword/type), amber (string) — tất cả đã đạt ≥ 6 trên bg-1.

### 3.6 Kế hoạch `next/font`

```ts
// app/fonts.ts
import { Fraunces, Geist, Geist_Mono } from 'next/font/google';

export const fraunces = Fraunces({
  subsets: ['latin', 'vietnamese'],
  style: ['normal'],
  axes: ['opsz', 'SOFT', 'WONK'], // weight bỏ trống = variable wght; P0 đo, vượt budget → cắt WONK, rồi SOFT (03a §6.2)
  display: 'swap',
  variable: '--font-fraunces',
  preload: true,                  // tên hero là LCP-text
});

export const frauncesItalic = Fraunces({
  subsets: ['latin', 'vietnamese'],
  style: ['italic'],
  axes: ['opsz'],
  display: 'swap',
  variable: '--font-fraunces-italic',
  preload: false,                 // italic chỉ xuất hiện dưới fold
});

export const geist = Geist({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-geist-sans',
  preload: true,
});

export const geistMono = Geist_Mono({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-geist-mono',
  preload: false,                 // theo 03a §6.3; HUD chấp nhận swap từ fallback metric-adjusted
});
```

- Gắn cả 4 `.variable` lên **`<html>`** (không phải `<body>`) để `--font-display` trong `@theme` resolve được ở `:root`.
- `adjustFontFallback` để mặc định (bật) → fallback metric giảm CLS.
- Subset đã kiểm qua metadata Google Fonts (Fontsource mirror): Fraunces `latin, latin-ext, vietnamese` với trục `opsz 9–144, wght 100–900, SOFT 0–100, WONK 0–1`; Geist và Geist Mono đều có `vietnamese`. Rủi ro R12 của 03b về subset coi như đóng; vẫn giữ test `document.fonts.check()` ở P0.
- Budget font ≤ 120 KB (03a): thứ tự cắt — bỏ WONK → bỏ SOFT → Fraunces italic chuyển sang `font-synthesis: none` + roman cho phụ đề.

---

## 4. Lưới, spacing, shape

### 4.1 Breakpoint

| Tên Tailwind | px | rem | Lưới | Ghi chú |
|---|---|---|---|---|
| (base) | < 375 | — | 4 cột | Thiết kế ở 360 vẫn không tràn ngang |
| `xs` | 375 | 23.4375 | 4 cột | Mốc thiết kế mobile |
| `md` | 768 | 48 | 8 cột | Hiện TimecodeHUD |
| `lg` | 1024 | 64 | 12 cột | Telemetry HUD, pin #2, ngưỡng Tier A |
| `xl` | 1440 | 90 | 12 cột | Khung đạt max |
| `2xl` | 1920 | 120 | 12 cột | Chỉ margin tăng, nội dung không giãn |

### 4.2 Cột, gutter, frame

- Cột: 4 / 8 / 12; `grid-template-columns: repeat(N, minmax(0, 1fr))`.
- Gutter: `--spacing-gutter: clamp(16px, 2.5vw, 32px)` (16 @375, 19 @768, 26 @1024, 32 @≥1280).
- Frame margin: `--spacing-frame: clamp(20px, 5vw, 80px)` (20 @375, 38 @768, 51 @1024, 72 @1440, 80 @1920).
- Khung: `max-width: 1440px` (`--container-frame`), `margin-inline: auto`, `padding-inline: var(--spacing-frame)` → vùng nội dung 1296 px @1440. Media full-bleed (hero, negative strip) thoát khung bằng `grid-column: 1 / -1` trên lưới ngoài `[full-start] frame [full-end]`.
- Vị trí điển hình @12 cột: đoạn đọc cột 2–8 (≈ 68ch); meta/slate cột 1–3; media cột 7–12 hoặc 1–12.

### 4.3 Spacing (4 pt)

Tailwind v4 `--spacing: 0.25rem` → `p-1` = 4 px. Chỉ dùng các bước sau:

| Bước | px | Dùng |
|---|---|---|
| 1 | 4 | Khe icon–chữ trong badge |
| 2 | 8 | Khe icon–chữ trong nút, padding chip |
| 3 | 12 | Padding badge ngang, khe dòng meta |
| 4 | 16 | Padding card mobile, khe nhóm nhỏ |
| 6 | 24 | Padding card desktop, slate → title |
| 8 | 32 | Title → lead |
| 12 | 48 | Lead → nội dung (mobile) |
| 16 | 64 | Lead → nội dung (desktop), nội dung → CTA chương |
| 24 | 96 | Section padding tối thiểu |
| 32 | 128 | Khoảng trống “beat” trước climax |
| 48 | 192 | Section padding tối đa |

Token có tên: `--spacing-gutter`, `--spacing-frame`, `--spacing-section: clamp(96px, 14vh, 192px)`, `--spacing-hud` (= chiều cao HUD: 56 px < 1024, 64 px ≥ 1024), `--spacing-timecode` (= chiều cao TimecodeHUD khi hiện: 0 px mặc định; 44 px khi `(min-width: 48rem) and (min-height: 501px)`). Base layer: `scroll-padding-top: calc(var(--spacing-hud) + 16px)`, `scroll-padding-bottom: calc(var(--spacing-timecode) + 24px)`.

### 4.4 Nhịp section

```
[section padding-top: --spacing-section]
  Slate (label mono)            ↓ 24
  Title (display-xl)            ↓ 32
  Lead (body-lg, ≤ 40ch)        ↓ 48 / 64
  Content (grid)                ↓ 48 / 64
  Chapter CTA (1 nút hoặc link)
[section padding-bottom: --spacing-section]
```

Scene liền nhau không có divider; “cắt cảnh” bằng slate mới. Ngoại lệ: `credits` dùng hairline `--line` giữa các block như dòng credits.

### 4.5 Radius

| Token | Giá trị | Dùng |
|---|---|---|
| `--radius-none` | 0 | Card, media, film frame, HUD, menu overlay |
| `--radius-xs` | 1px | Kbd, chip tech |
| `--radius-sm` | 2px | Nút, input, toast, scrubber thumb track |
| `--radius-md` | 2px | (alias cho component shadcn dùng `rounded-md`) |
| `--radius-lg` | 4px | Dialog / CommandPalette |
| `--radius-xl` | 4px | (chặn trần cho class shadcn `rounded-xl`) |
| `--radius-full` | 9999px | **Chỉ** StatusBadge, chấm rec, node git, thumb scrubber |

### 4.6 Elevation

Không dùng `box-shadow` cho chiều sâu (đã xoá `--shadow-*`). Thứ bậc:

| Tầng | Nền | Viền | Ví dụ |
|---|---|---|---|
| 0 | bg-0 | — | Trang |
| 1 | bg-1 | `--line` | HUD khi cuộn, palette, menu |
| 2 | bg-2 | `--line` → `--line-strong` khi hover | Card, toast, item chọn |
| Overlay | bg-0 @ 80 % (không blur) | — | Backdrop Dialog/Menu |

### 4.7 z-index (copy master §5.4)

| Token | Giá trị | Lớp |
|---|---|---|
| `--z-content` | 10 | Nội dung nổi trong scene (sticky portrait, letterbox bar) |
| `--z-hud` | 40 | HUD top, TimecodeHUD |
| `--z-menu` | 50 | Menu overlay |
| `--z-cursor` | 60 | Custom cursor |
| `--z-grain` | 70 | Grain (pointer-events none) |
| `--z-modal` | 100 | CommandPalette, Dialog, Toast |
| `--z-cold-open` | 1000 | Cold open overlay |

Toast đặt cùng tầng modal (100) để không bị grain/menu che; grain nằm trên menu nhưng dưới modal theo master.

### 4.8 Icon

- Thư viện: `@phosphor-icons/react`; trong Server Component import từ `@phosphor-icons/react/dist/ssr`.
- Một weight duy nhất: **`regular`**. Kích thước token: `--icon-sm` 16 px (badge, inline), `--icon-md` 20 px (nút, menu), `--icon-lg` 24 px (player, HUD).
- Màu `currentColor`; không icon nhiều màu, không emoji.
- Icon trang trí cạnh chữ: `aria-hidden="true"`. Nút chỉ có icon: bắt buộc `aria-label` + hit area ≥ 44×44 px.
- Bộ icon chốt: `ArrowRight` (CTA nội bộ), `ArrowUpRight` (link ngoài), `Play`, `Pause`, `SpeakerSimpleHigh`, `SpeakerSimpleSlash`, `ClosedCaptioning`, `CornersOut`, `MagnifyingGlass`, `Command`, `List`, `X`, `Copy`, `Check`, `CheckCircle`, `Record`, `NotePencil`, `GitCommit`, `GitMerge`, `Warning`, `FilmStrip`, `MapPin`, `GithubLogo`, `LinkedinLogo`, `YoutubeLogo`, `InstagramLogo`, `Envelope`.

---

## 5. Component

Quy ước chung cho mọi component tương tác: focus ring = `outline: 2px solid var(--grade-amber); outline-offset: 2px` (§5.6), touch target ≥ 44×44 px, transition màu `--dur-instant`/`--dur-fast` với `--ease-standard`, Tier C chỉ đổi màu/opacity ≤ 200 ms.

### 5.1 HUD bar

- **Anatomy:** `<header>` cố định top. Trái: monogram `NM` (link `href="#opening"`, `aria-label="Mai Văn Nhật Minh — back to top"`). Giữa (≥ 1024): telemetry `VIETNAM · 21:04 ICT · ● REC` (label mono, ink-2; chấm rec 6 px). Profile chỉ cho công khai cấp quốc gia; chuỗi thành phố là phương án chỉ dùng khi Minh duyệt (owner-approved option, master §10 câu 6). Phải: nút `⌘K` (hiện `Ctrl K` trên non-Mac) + nút `Menu`.
- **Kích thước:** cao 56 px (< 1024) / 64 px (≥ 1024); padding-inline = `--spacing-frame`; nút 44 px cao.
- **States:** *top* — nền trong suốt; *scrolled* (> 24 px) — bg-1 @ 92 % + hairline đáy `--line`, chuyển `--dur-fast`; *hidden* — không bao giờ ẩn khi focus nằm trong HUD; Tier A có thể trượt ẩn khi cuộn xuống trong pin, hiện lại khi cuộn lên. Nút: hover ink-2 → ink, focus-visible ring, active `translateY(1px)`.
- **A11y:** landmark `header`; skip link “Skip to content” là phần tử focus đầu tiên (trước HUD), hiện khi focus, đích `#main`; ngoại lệ: khi cold-open đang hiển thị, Skip intro là focus đầu tiên (sau khi cold-open kết thúc/bị bỏ qua, skip link trở lại vị trí đầu). Đồng hồ là `<time>` không `aria-live`; nhóm telemetry `aria-label="Local time in Vietnam (ICT)"` (nếu Minh duyệt phương án thành phố ở master câu 6 thì đổi nhãn tương ứng); chấm REC `aria-hidden`, chữ “REC” đọc là trạng thái trang trí → bọc `aria-hidden`. `scroll-padding-top: calc(var(--spacing-hud) + 16px)` (§4.3).
- **Responsive:** < 1024 chỉ monogram + Menu (⌘K vào trong menu); ≥ 1024 đủ 3 cụm.

### 5.2 TimecodeHUD chip

- **Anatomy:** cả chip là **một** `<button>` cố định góc dưới-phải: `SC 04 · 00:02:41:12` (label mono, tabular). Trái: chấm trạng thái scene (teal); phải: icon `List` 16 px. Không có nút con riêng (không `[LIST]` text-xs).
- **Kích thước:** cao 44 px (`h-11`), padding-inline 12 px (`px-3`), cách mép = `--spacing-frame` / 24 px đáy; nền bg-1 @ 92 % (`bg-bg-1/92`), viền `--line` (`border-line`), radius `--radius-sm` (`rounded-sm`); không `backdrop-blur`, không `rounded-full`. Chiều cao này là `--spacing-timecode` (§4.3).
- **States:** default ink-3 chữ timecode, ink cho `SC 04`; hover viền `--line-strong`, chữ ink; focus-visible ring 2 px (không dùng `ring-1`); active bg-2. Khi CommandPalette mở: ẩn (`visibility: hidden`).
- **A11y:** chữ số cập nhật mỗi frame nằm trong `<span aria-hidden="true">` bên trong button; `aria-label` tĩnh chỉ đổi khi đổi scene: `"Scene list. Current scene 04, Feature presentation"`. Click phát window event `open-scene-palette`; `components/chrome/hud.tsx` đăng ký listener eager, lazy-import `command-palette` và mở nó lọc nhóm “Scenes”. Không `aria-live`.
- **Responsive:** ẩn < 768 hoặc khi chiều cao ≤ 500 px (scene list nằm trong Menu; khi đó `--spacing-timecode: 0px`). Tier C: hiển thị scene hiện tại, timecode đứng yên theo scene (không gắn scroll listener; chỉ cập nhật khi SceneObserver đổi scene).

### 5.3 Slate (mở scene)

- **Anatomy:** biến thể *inline* (mọi scene): `<p class="slate">SCENE 04 · TAKE 01 · FEATURE PRESENTATION</p>` — label mono ink-3, số scene ink; đứng trên `<h2>`. Biến thể *board* (cold-open, `/404`): khối 2 hàng — thanh clapper sọc chéo 45° (ink/bg-0, 12 px) + lưới 3 ô `SCENE | TAKE | ROLL` với giá trị Fraunces `heading-lg` và nhãn label mono.
- **Kích thước:** inline cao 1 dòng label; board rộng `min(480px, 100%)`, viền `--line-strong` 1 px, radius 0.
- **States:** tĩnh. Board có trạng thái *clap* (thanh xoay −18° → 0°, chỉ cold-open, Tier A/B; `02a` B0.3).
- **A11y:** slate là văn bản đọc được, đứng trước heading; dấu `·` là ký tự thường. Không dùng slate thay heading. Board trong cold-open nằm trong overlay có `aria-hidden` khi đã xong.
- **Responsive:** < 768 rút gọn `SC 04 · TAKE 01` + tiêu đề trên dòng thứ hai nếu tràn (`flex-wrap`).

### 5.4 StatusBadge

| Biến thể | Icon (16 px) | Chữ | Viền | Ý nghĩa |
|---|---|---|---|---|
| `pre-production` | `NotePencil` ink-2 | `PRE-PRODUCTION` ink-2 | 1 px **dashed** `--ink-3` | Kế hoạch, chưa có kết quả |
| `in-production` | chấm rec 6 px (`Record` fill) | `IN PRODUCTION` ink | 1 px solid `--line-strong` | Đang làm, có kết quả từng phần |
| `released` | `CheckCircle` teal | `RELEASED` ink | 1 px solid teal @ 50 % | Đã xong, có bằng chứng |

- **Anatomy:** pill `--radius-full`, cao 24 px, padding-inline 10 px, khe 6 px, label mono 12 px uppercase tracking 0.08em.
- **States:** không tương tác. `in-production` có pulse opacity chấm rec 2 s chỉ Tier A; Tier B/C tĩnh.
- **A11y:** ba kênh phân biệt (chữ, icon, kiểu viền) → không phụ thuộc màu. Thêm `<span class="sr-only">` mô tả: “Status: planned research, not started”, “Status: in progress”, “Status: released”. Badge lấy giá trị từ `claimStatus` trong data (03a D4), không gõ tay.
- **Responsive:** không đổi kích thước; trong case card nằm hàng meta, xuống dòng nếu thiếu chỗ.

### 5.5 Button

| Biến thể | Nền | Chữ | Viền | Hover | Active | Disabled |
|---|---|---|---|---|---|---|
| `primary` | amber | bg-0 (9.78) | — | `--amber-hover` (10.48), icon `translateX(2px)` | `--amber-active` (7.68), `translateY(1px)` | nền `--line-strong`, chữ ink-3, `cursor: not-allowed` |
| `secondary` (ghost) | trong suốt | ink | 1 px `--line-strong` | viền ink-3, nền bg-1 | nền bg-2 | viền `--line`, chữ ink-3 |
| `link` | — | teal + gạch chân 1 px | — | `--teal-hover`, gạch chân 2 px | ink | không dùng (ẩn link thay vì disable) |

- **Anatomy:** `[label] [icon trailing]`; label Geist 500 `body` (15–16 px), icon 20 px `ArrowRight` (nội bộ) / `ArrowUpRight` (ngoài, kèm sr-only “(opens in a new tab)” nếu `target=_blank`).
- **Kích thước:** `sm` 44 px cao, padding-inline 16 px; `md` 48 px, 20 px; `lg` 56 px, 24 px (CTA hero, CTA climax). **Không có kích thước < 44 px.** Link trong đoạn văn được miễn 44 px nhưng có `padding-block: 2px` và khoảng cách ≥ 8 px với link khác.
- **States:** focus-visible ring amber 2 px, offset 2 px (với primary, khe offset bg-0 tách ring khỏi nền amber); loading không dùng (site tĩnh).
- **A11y:** `<a>` cho điều hướng, `<button>` cho hành động; disabled dùng `aria-disabled="true"` + giữ focus được nếu có tooltip giải thích. Mỗi màn hình tối đa một `primary`.
- **Responsive:** < 768 nút CTA chương `width: 100%`; cặp CTA hero xếp dọc, primary trên.

### 5.6 Viewfinder frame + focus ring

- **Focus ring toàn cục:** `:focus-visible { outline: 2px solid var(--grade-amber); outline-offset: 2px; }`. Dùng `outline` (không `box-shadow`) để hoạt động trong Forced Colors (`outline-color: Highlight`). Không bao giờ `outline: none` mà không có thay thế.
- **Viewfinder (utility `viewfinder`):** 4 góc chữ L ở ngoài khung media/card, cách 6 px; cạnh 12 px (16 px ≥ 1024), dày 1 px màu `--line-strong`.
- **States:** default — góc `--line-strong`; hover (pointer) — góc amber, dày 1 px; focus-visible (trong card: `:has(:focus-visible)`) — góc amber dày 2 px **cộng** outline 2 px của phần tử focus; active — góc thu vào 2 px (`--dur-instant`); Tier C — đổi màu, không đổi vị trí.
- **A11y:** góc là pseudo-element trang trí, không mang thông tin. Viewfinder không thay thế outline.
- **Responsive:** < 768 cạnh 10 px, cách 4 px; trên touch không có hover state.

### 5.7 OdometerMetric

- **Anatomy:** `<figure>` gồm: giá trị (Geist Mono 300 `display-lg`, teal) + đơn vị (`%`, ink-2, nửa cỡ); nhãn (`body-sm` ink-2: “fewer manual steps in the release workflow”); footnote marker `¹` (link tới slot); **slot nguồn/phạm vi** `<figcaption>` (`caption` ink-3: “FPT Smart Cloud, 2025. Reduction in manual operational steps for the SRE release-management ticket workflow.”). Không thêm phương pháp đếm cho tới khi Minh cung cấp.
- **DOM:** giá trị cuối luôn có trong HTML: `<data value="70">70%</data>`. Cuộn số (cột 0–9 dịch `translateY`) là lớp `aria-hidden="true"` đè lên, render sau hydrate; lớp tĩnh `visibility: hidden` chỉ trong lúc animate, layout giữ nguyên (không CLS) nhờ tabular-nums.
- **Kích thước:** cột 0–9 cao `1em`, mask `overflow: hidden` + `split-safe` không cần (số không dấu).
- **States:** *idle* (chưa vào viewport) — Tier A/B hiển thị `00`; *rolling* — 900 ms `--ease-out` stagger 60 ms/chữ số; *settled* — giá trị cuối. Tier C / no-JS: chỉ *settled*.
- **A11y:** screen reader đọc lớp tĩnh một lần. Chỉ dùng cho claim có trạng thái cho phép odometer (master §7: “70 %”, “3 scholarships”); claim `reported` (30 %, 90 %) dùng biến thể `StaticMetric` với tag `REPORTED` và không cuộn — ràng buộc bằng type (03b: truyền `reported` vào `OdometerMetric` phải lỗi typecheck).
- **Responsive:** 1 cột < 768; 2–3 cột ≥ 768; giá trị không xuống dòng (`white-space: nowrap`).

### 5.8 Git-graph commit card (scene `log`)

- **Anatomy:** hàng gồm *rail* (SVG trái: lane 2 px, node 10 px; merge node = vòng rỗng; nhánh nghiêng 45°) + *card*: dòng 1 `a3f9c21` (mono ink-3) · `feat(sre):` (mono teal) · message (Geist ink); dòng 2 org + khoảng thời gian `2025-06 → 2025-12` (mono ink-3) + StatusBadge nếu cần; vùng *details* (stack chips, 2–4 bullet outcome, OdometerMetric nếu có claim hợp lệ). Nhãn `HEAD →` (mono teal) cho mốc hiện tại.
- **Màu lane:** lane `main` teal; lane phụ ink-3; lane phân biệt bằng **vị trí + nhãn tên nhánh** (`main`, `work`, `ship`, `research`, `field` — khớp 02a và schema `LogCommit` 03a) ở đầu lane, không chỉ bằng màu.
- **Kích thước:** card padding 16/24 px, khe giữa commit 8 px; header card cao ≥ 56 px (cả hàng là `<button>`).
- **States:** default nền trong suốt, viền trái `--line`; hover nền bg-1, node phóng 1.2; focus-visible ring trên button + node amber; expanded (`aria-expanded="true"`) nền bg-1, viền `--line-strong`, details mở **không animate height**: hiện tức thì (bỏ `hidden`), nội dung bên trong `opacity 0 → 1` + `translateY(8px → 0)` `--dur-base` (Tier A/B); Tier C: hiện tức thì; active nền bg-2.
- **A11y:** `<ol aria-label="Professional and research experience timeline">`; mỗi `<li>` có `<button aria-expanded aria-controls>`; SVG rail `aria-hidden`; ngày dùng `<time datetime>`; ArrowUp/ArrowDown di chuyển focus (`02a`). Nội dung details có trong DOM (ẩn bằng `hidden` khi đóng) để tìm được bằng Ctrl F khi mở.
- **Responsive:** ≥ 1024 rail đủ 5 lane rộng 160 px; < 1024 gộp còn 1 lane 24 px, tên nhánh thành chip mono trong card.

### 5.9 Case card (scene `reel`)

- **Anatomy:** media 16:10 trong viewfinder; hàng meta `05.1` (mono ink-3) + StatusBadge; tiêu đề `heading-md` Fraunces; outcome 1 câu (`body` ink-2, ≤ 2 dòng); chip tech (mono 12 px, viền `--line`, radius-xs, tối đa 4); link “Read the case” (biến thể `link`). Top hairline 2 px: teal (engineering) hoặc amber (award).
- **Kích thước:** pin #2: `width: clamp(560px, 40vw, 720px)`; dọc: full cột. Padding nội dung 24 px.
- **States:** default nền bg-2 viền `--line`; hover — media `scale(1.03)` trong mask (Tier A/B), góc viewfinder amber, tiêu đề gạch chân; focus-visible — tiêu đề là link duy nhất, `::after` phủ toàn card (stretched link), card hiện outline qua `:has(:focus-visible)`; active — media `scale(1.01)`.
- **A11y:** một link/card (không lồng link); thứ tự đọc: tiêu đề → meta → outcome; ảnh có `alt` mô tả nội dung, ảnh SRE đã che thông tin nội bộ. Badge trung thực theo claim ledger.
- **Responsive:** ≥ 1024 (Tier A) cuộn ngang trong pin; Tier B/C hoặc < 1024: stack dọc, 1 cột < 768, 2 cột 768–1023.

### 5.10 FilmFrame (scene `field-notes`)

- **Anatomy:** ô negative: lỗ sprocket trên/dưới (repeating-linear-gradient, bg-0 trên nền bg-1, 8×5 px, cách 14 px); ảnh still 3:2; dải meta dưới: frame code `06A` (mono ink), thành phố `DAEJEON, KR` (mono ink-2), timecode `00:00:12:04` (mono ink-3), toạ độ GPS **chỉ khi Minh duyệt** (master §10 câu 4). Nút phụ `Play clip` (44 px, icon `Play`) hiện khi developed.
- **States:**
  - *negative* (mặc định Tier A/B): `filter: invert(1) hue-rotate(180deg) saturate(0.6)` + lớp amber 18 % `multiply` mô phỏng orange mask.
  - *develop* (transition): filter về `none` trong `--dur-slow` `--ease-out`; Tier C: đổi tức thì (crossfade 200 ms).
  - *developed*: ảnh thật, meta chuyển ink, nút Play hiện.
  - hover (Tier A): xem trước develop, rời chuột trở lại negative nếu chưa nhấn.
  - focus-visible: outline + viewfinder amber.
  - pressed: `aria-pressed="true"` giữ developed.
- **Tier C mặc định developed** (nội dung rõ ngay, không cần thao tác).
- **A11y:** ô là `<button aria-pressed>` nhãn “Develop frame 06A, Daejeon”; ảnh `alt` mô tả cảnh (không phụ thuộc trạng thái); copy gợi ý “tap to develop” hiển thị trên touch, “click to develop” trên pointer fine. Nút Play là phần tử riêng, không lồng trong button cha (đặt anh em, định vị tuyệt đối).
- **Responsive:** strip cuộn ngang native (`overflow-x: auto`, `scroll-snap-type: x mandatory`) ở mọi tier; ô rộng 72 vw (< 768), 36 vw (768–1023), 22 vw (≥ 1024). Có nút trước/sau 44 px cho người không cuộn ngang được.

### 5.11 Video player controls

- **Anatomy (player đầy đủ, `/films` và field-notes):** thanh dưới trên scrim gradient (bg-0 0 → 75 %): `Play/Pause` · timecode `00:00:12:04 / 00:02:30:00` (mono ink-2) · scrubber · `Mute` · `Captions` · `Fullscreen`.
- **Anatomy (hero loop):** chỉ một nút `Pause background video` / `Play background video` (WCAG 2.2.2), góc dưới-trái khung, luôn hiện.
- **Kích thước:** mọi nút 44×44 px (icon 24 px); scrubber: hit area cao 44 px, track 2 px ink-3, progress teal, buffered `--line-strong`, thumb 12 px ink (radius-full), phóng 16 px khi kéo/focus.
- **States:** nút: default ink-2, hover ink + nền bg-0 @ 40 %, focus-visible ring, active `scale(0.96)`, disabled (Captions khi không có `.vtt`) ink-3 + `aria-disabled` + tooltip “No captions for this clip”. Toggle Mute/Captions dùng `aria-pressed`. Thanh điều khiển: Tier A tự ẩn sau 2.5 s không di chuột **khi đang phát**; không bao giờ ẩn khi focus ở trong, khi tạm dừng, hoặc trên touch.
- **A11y:** Play/Pause đổi `aria-label` theo trạng thái; scrubber `<input type="range" aria-label="Seek" aria-valuetext="12 seconds of 2 minutes 30 seconds">`; phím: Space/K play-pause, ←/→ ±5 s, M mute, C captions, F fullscreen (chỉ khi focus trong player). Video không autoplay ở Tier C (poster + nút play). Phụ đề `.vtt` dùng `::cue` Geist 500, nền bg-0 @ 75 %.
- **Responsive:** < 768 ẩn timecode tổng, giữ hiện tại; Fullscreen dùng API native.

### 5.12 CommandPalette

- **Nền tảng:** shadcn `CommandDialog` (cmdk trong Radix Dialog).
- **Anatomy:** Dialog `width: min(640px, 100vw - 32px)`, cách top 20 vh, nền bg-1, viền `--line-strong`, radius-lg (4 px). Input cao 56 px: icon `MagnifyingGlass` 20 px + placeholder “Jump to a scene, case study, or action…” (ink-3) + viền dưới `--input`. Nhóm: `Scenes` (mỗi item: `SC 04` mono ink-3 + tên), `Case studies`, `Actions` (Copy email, Reduce motion on/off, Sound on/off nếu có), `Links`. Footer gợi ý: `↑↓ navigate · ↵ open · esc close` (mono ink-3).
- **Kích thước:** item cao 44 px, padding-inline 16 px; group heading label mono 12 px.
- **States:** item default ink-2; selected (`aria-selected`/`data-selected`) nền bg-2 + thanh trái 2 px amber + chữ ink; disabled ink-3 (không ẩn, để giải thích); empty state “No results.” (body-sm ink-3). Mở: fade + `scale(0.98 → 1)` `--dur-fast`; đóng 60–70 % thời lượng; Tier C chỉ fade.
- **A11y:** `DialogTitle` sr-only “Command palette”; focus trap; Escape đóng; trả focus về nút gọi; phím tắt ⌘K / Ctrl K không chặn khi focus đang trong input khác; nút mở có `aria-keyshortcuts="Meta+K Control+K"`. Hành động Copy email phát Toast (§5.15).
- **Responsive:** < 768 neo top 16 px, `max-height: 70dvh`, item 48 px; mở qua nút trong Menu.

### 5.13 Menu overlay

- **Nền tảng:** Radix Dialog toàn màn hình, `z-index: 50`.
- **Anatomy:** nền bg-0 (không blur) + grain; cột trái: danh sách 8 scene `01 Opening shot` … `08 Next scene` — số mono ink-3, tên Fraunces `display-md`; cột phải: links (`Films`, `Archive`, `CV` nếu bật), contact (email copy, LinkedIn), toggle “Reduce motion”, telemetry HUD rút gọn. Góc phải trên: nút `Close menu` (icon `X`, 44 px).
- **States:** item default ink-2; hover ink + gạch dưới 1 px; focus-visible ring; current scene `aria-current="location"` + thanh trái 2 px amber + chữ ink; mở: wipe `clip-path` từ trên xuống `--dur-scene` (Tier A/B), Tier C fade 200 ms.
- **A11y:** `aria-modal`, `DialogTitle` sr-only “Site menu”; focus đầu tiên vào item scene hiện tại; Escape đóng; chọn scene → đóng menu → scroll tới `#id` → focus heading scene (`tabindex="-1"`).
- **Responsive:** < 768 một cột, item 56 px, tên scene `heading-lg`; ≥ 1024 hai cột 7/5.

### 5.14 Footer split (Engineering / Film)

- **Anatomy:** `<footer>` hai cột với heading label mono: **ENGINEERING** (GitHub, LinkedIn, Email — nút copy, CV nếu bật, Changelog nếu bật) và **FILM** (kênh video đã duyệt, Instagram). Mỗi link: icon 20 px + chữ (không icon-only). Dải dưới: “Built with Next.js, GSAP, and a lot of `ScrollTrigger.refresh()`” (copy cần Minh duyệt) · “© 2026 Mai Văn Nhật Minh” · nút `Back to top`.
- **States:** link default ink-2; hover ink + gạch chân; focus-visible ring; link ngoài có `ArrowUpRight` + sr-only “(opens in a new tab)”.
- **A11y:** landmark `contentinfo`; mỗi cột là `<nav aria-label="Engineering links">` / `"Film links"`; không có số điện thoại (master §7). Chỉ hiển thị link đã xác nhận (master §8 A8).
- **Responsive:** < 768 xếp dọc, Engineering trước; ≥ 768 hai cột 6/6 trên lưới 12 (cột 1–5 và 7–11).

### 5.15 Toast

- **Anatomy:** một vùng `role="status" aria-live="polite"` luôn có trong DOM (rỗng khi không có thông báo); toast: icon `Check` teal 20 px + chữ `body-sm` ink (“Email copied to clipboard.”); lỗi: icon `Warning` (rec, icon chứ không phải chữ) + “Couldn't copy. The address is shown below.” kèm email dạng text chọn được.
- **Kích thước:** cao ≥ 48 px, padding 12/16 px, nền bg-2, viền `--line-strong`, radius-sm; tối đa 1 toast cùng lúc.
- **States:** enter fade + `translateY(8px → 0)` `--dur-base`; hiển thị 4 s; tạm dừng đếm khi hover/focus; exit fade `--dur-fast`. Tier C: fade 200 ms.
- **A11y:** polite, không lấy focus; không chứa action bắt buộc. `z-index: 100`.
- **Responsive:** < 768 giữa đáy, cách 16 px + safe-area; ≥ 768 góc dưới-**trái** (TimecodeHUD ở dưới-phải).

### 5.16 Custom cursor (chỉ Tier A)

- **Anatomy:** `<div aria-hidden="true">` cố định `z-index: 60`, `pointer-events: none`; chấm 6 px ink; trạng thái *viewfinder*: 4 góc amber 40×40 px quanh media; trạng thái *label*: chữ mono 12 px `VIEW` / `PLAY` / `EXPAND` (ink trên bg-0 @ 80 %).
- **States:** default; media hover → viewfinder; link media → label; nhấn → `scale(0.9)`; rời cửa sổ → ẩn; **bàn phím** (Tab/arrow lần cuối) → ẩn hoàn toàn cho tới khi chuột di chuyển lại.
- **A11y & ràng buộc:** không bao giờ thay hay che focus ring; **không ẩn con trỏ native** ở text, input, nút, link — chỉ đặt `cursor: none` trên vùng media có viewfinder. Không mount ở Tier B/C (không chỉ ẩn bằng CSS). Tôn trọng `forced-colors: active` → không mount.
- **Responsive:** chỉ ≥ 1024 + `pointer: fine` + motion cho phép.

---

## 6. Tailwind v4 — `app/globals.css`

Paste nguyên khối. Thứ tự: import → variants → token gốc (`:root`) → `@theme inline` (ánh xạ sang biến) → `@theme` (giá trị tĩnh) → base → utilities → components.

```css
@import "tailwindcss";

/* ---------------------------------------------------------------
   1. Variants
   Tailwind ≥ 4.1 đã có sẵn `pointer-fine:` / `pointer-coarse:` —
   không khai báo lại. Dưới đây: 3 tier + biến thể hover chỉ cho chuột.
---------------------------------------------------------------- */
@custom-variant tier-a (&:where([data-tier="A"], [data-tier="A"] *));
@custom-variant tier-b (&:where([data-tier="B"], [data-tier="B"] *));
@custom-variant tier-c (&:where([data-tier="C"], [data-tier="C"] *));
@custom-variant hover-fine {
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      @slot;
    }
  }
}

/* ---------------------------------------------------------------
   2. Token gốc — tên theo master §5 (KHÔNG đổi tên)
---------------------------------------------------------------- */
:root {
  --bg-0: #0a0a0b;
  --bg-1: #111113;
  --bg-2: #18181b;
  --line: #26262b;
  --line-strong: #3a3a40;
  --ink: #f2eee8;
  --ink-2: #b9b6b0;
  --ink-3: #9a9893;
  --grade-teal: #5bc8c0;
  --grade-amber: #f2a65a;
  --rec: #ff4d3d;
  --grain-opacity: 0.06;

  /* dẫn xuất (§2.1) */
  --amber-hover: #f2af6b;
  --amber-active: #d69351;
  --teal-hover: #81d2ca;
  --scrim: rgb(10 10 11 / 0.75);

  /* motion (master §5.3) */
  --dur-instant: 120ms;
  --dur-fast: 200ms;
  --dur-base: 320ms;
  --dur-slow: 600ms;
  --dur-scene: 900ms;

  /* z-index (master §5.4) */
  --z-content: 10;
  --z-hud: 40;
  --z-menu: 50;
  --z-cursor: 60;
  --z-grain: 70;
  --z-modal: 100;
  --z-cold-open: 1000;

  /* icon */
  --icon-sm: 16px;
  --icon-md: 20px;
  --icon-lg: 24px;

  /* shadcn/ui */
  --background: var(--bg-0);
  --foreground: var(--ink);
  --card: var(--bg-2);
  --card-foreground: var(--ink);
  --popover: var(--bg-1);
  --popover-foreground: var(--ink);
  --primary: var(--grade-amber);
  --primary-foreground: var(--bg-0);
  --secondary: var(--bg-2);
  --secondary-foreground: var(--ink);
  --muted: var(--bg-1);
  --muted-foreground: var(--ink-3);
  --accent: var(--bg-2);
  --accent-foreground: var(--ink);
  --destructive: var(--rec);
  --destructive-foreground: var(--bg-0);
  --border: var(--line);
  --input: var(--ink-3);
  --ring: var(--grade-amber);
  --radius: 2px;
}

html[data-active-scene="field-notes"] {
  --grain-opacity: 0.1;
}

/* ---------------------------------------------------------------
   3. Theme — ánh xạ biến (inline: utility dùng thẳng var(--…))
---------------------------------------------------------------- */
@theme inline {
  --color-*: initial;

  --color-bg-0: var(--bg-0);
  --color-bg-1: var(--bg-1);
  --color-bg-2: var(--bg-2);
  --color-line: var(--line);
  --color-line-strong: var(--line-strong);
  --color-ink: var(--ink);
  --color-ink-2: var(--ink-2);
  --color-ink-3: var(--ink-3);
  --color-grade-teal: var(--grade-teal);
  --color-grade-amber: var(--grade-amber);
  --color-rec: var(--rec);

  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
}

/* ---------------------------------------------------------------
   4. Theme — giá trị tĩnh
---------------------------------------------------------------- */
@theme {
  /* Fonts: biến do next/font gắn trên <html> */
  --font-display: var(--font-fraunces), Georgia, "Times New Roman", serif;
  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, "SFMono-Regular", monospace;

  /* Breakpoints 375 / 768 / 1024 / 1440 / 1920 */
  --breakpoint-*: initial;
  --breakpoint-xs: 23.4375rem;
  --breakpoint-md: 48rem;
  --breakpoint-lg: 64rem;
  --breakpoint-xl: 90rem;
  --breakpoint-2xl: 120rem;

  /* Containers */
  --container-frame: 90rem;
  --container-measure: 68ch;
  --container-lead: 40ch;

  /* Spacing 4pt + token có tên */
  --spacing: 0.25rem;
  --spacing-gutter: clamp(16px, 2.5vw, 32px);
  --spacing-frame: clamp(20px, 5vw, 80px);
  --spacing-section: clamp(96px, 14vh, 192px);
  --spacing-hud: 56px;
  --spacing-timecode: 0px;

  /* Type scale (§3.2) */
  --text-display-2xl: clamp(3.5rem, 1.211rem + 9.765vw, 10rem);
  --text-display-2xl--line-height: 1.1;
  --text-display-2xl--letter-spacing: -0.025em;
  --text-display-2xl--font-weight: 340;
  --text-display-xl: clamp(2.75rem, 1.254rem + 6.385vw, 7rem);
  --text-display-xl--line-height: 1.1;
  --text-display-xl--letter-spacing: -0.02em;
  --text-display-xl--font-weight: 380;
  --text-display-lg: clamp(2.25rem, 1.282rem + 4.131vw, 5rem);
  --text-display-lg--line-height: 1.12;
  --text-display-lg--letter-spacing: -0.015em;
  --text-display-lg--font-weight: 420;
  --text-display-md: clamp(1.875rem, 1.303rem + 2.441vw, 3.5rem);
  --text-display-md--line-height: 1.15;
  --text-display-md--letter-spacing: -0.01em;
  --text-display-md--font-weight: 420;
  --text-heading-lg: clamp(1.5rem, 1.236rem + 1.127vw, 2.25rem);
  --text-heading-lg--line-height: 1.2;
  --text-heading-lg--letter-spacing: -0.005em;
  --text-heading-lg--font-weight: 460;
  --text-heading-md: clamp(1.25rem, 1.074rem + 0.7512vw, 1.75rem);
  --text-heading-md--line-height: 1.25;
  --text-heading-md--font-weight: 460;
  --text-heading-sm: clamp(1.125rem, 1.037rem + 0.3756vw, 1.375rem);
  --text-heading-sm--line-height: 1.3;
  --text-heading-sm--letter-spacing: -0.005em;
  --text-heading-sm--font-weight: 600;
  --text-body-lg: clamp(1.125rem, 1.081rem + 0.1878vw, 1.25rem);
  --text-body-lg--line-height: 1.6;
  --text-body: clamp(1rem, 0.978rem + 0.0939vw, 1.0625rem);
  --text-body--line-height: 1.65;
  --text-body-sm: clamp(0.875rem, 0.853rem + 0.0939vw, 0.9375rem);
  --text-body-sm--line-height: 1.55;
  --text-body-sm--letter-spacing: 0.005em;
  --text-label: clamp(0.75rem, 0.728rem + 0.0939vw, 0.8125rem);
  --text-label--line-height: 1.4;
  --text-label--letter-spacing: 0.08em;
  --text-label--font-weight: 500;
  --text-caption: 0.75rem;
  --text-caption--line-height: 1.45;
  --text-caption--letter-spacing: 0.02em;

  /* Radius 0–4px; pill chỉ cho badge */
  --radius-*: initial;
  --radius-none: 0;
  --radius-xs: 1px;
  --radius-sm: 2px;
  --radius-md: 2px;
  --radius-lg: 4px;
  --radius-xl: 4px;
  --radius-full: 9999px;

  /* Không có shadow: elevation = surface + hairline */
  --shadow-*: initial;
  --inset-shadow-*: initial;
  --drop-shadow-*: initial;

  /* Easing (master §5.3) */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --default-transition-duration: 200ms;
  --default-transition-timing-function: cubic-bezier(0.2, 0, 0, 1);

  /* Animations (Tier A gắn bằng variant tier-a:) */
  --animate-grain: grain 1s steps(1, end) infinite;
  --animate-rec-pulse: rec-pulse 2s cubic-bezier(0.65, 0, 0.35, 1) infinite;
  --animate-leak-drift: leak-drift 12s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate;

  @keyframes grain {
    0% { transform: translate(0, 0); }
    10% { transform: translate(-24px, 16px); }
    20% { transform: translate(16px, -32px); }
    30% { transform: translate(-40px, -8px); }
    40% { transform: translate(32px, 24px); }
    50% { transform: translate(-8px, 40px); }
    60% { transform: translate(40px, -16px); }
    70% { transform: translate(-32px, 32px); }
    80% { transform: translate(8px, -40px); }
    90% { transform: translate(-16px, 8px); }
    100% { transform: translate(0, 0); }
  }
  @keyframes rec-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.35; }
  }
  @keyframes leak-drift {
    from { transform: translate3d(-4%, -2%, 0); }
    to { transform: translate3d(4%, 3%, 0); }
  }
}

/* ---------------------------------------------------------------
   5. Base
---------------------------------------------------------------- */
@layer base {
  :root {
    @media (width >= 64rem) {
      --spacing-hud: 64px;
    }
    @media (width >= 48rem) and (height >= 501px) {
      --spacing-timecode: 44px;
    }
  }

  html {
    color-scheme: dark;
    background-color: var(--bg-0);
    color: var(--ink);
    font-family: var(--font-sans);
    scroll-padding-top: calc(var(--spacing-hud) + 16px);
    scroll-padding-bottom: calc(var(--spacing-timecode) + 24px);
    -webkit-text-size-adjust: 100%;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Lenis điều khiển cuộn ở Tier A; Tier B dùng smooth native cho anchor */
  html[data-tier="B"] {
    scroll-behavior: smooth;
  }

  body {
    font-size: var(--text-body);
    line-height: var(--text-body--line-height);
    font-variant-numeric: lining-nums;
  }

  h1, h2, h3 {
    font-family: var(--font-display);
    font-optical-sizing: auto;
    text-wrap: balance;
  }

  p, li, figcaption {
    text-wrap: pretty;
  }

  :where(time, data, code, kbd, samp, .tabular) {
    font-variant-numeric: tabular-nums slashed-zero;
  }

  ::selection {
    background-color: var(--grade-amber);
    color: var(--bg-0);
  }

  :focus-visible {
    outline: 2px solid var(--grade-amber);
    outline-offset: 2px;
  }

  @media (forced-colors: active) {
    :focus-visible {
      outline-color: Highlight;
    }
  }

  a:where(:not([class])) {
    color: var(--grade-teal);
    text-decoration-line: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 0.2em;
  }
  a:where(:not([class])):hover {
    color: var(--teal-hover);
    text-decoration-thickness: 2px;
  }

  /* Reduced motion: cắt mọi keyframe, transition chỉ còn đổi màu/opacity ≤ 200ms */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation: none !important;
      transition-property: opacity, color, background-color, border-color, outline-color, text-decoration-color, fill, stroke !important;
      transition-duration: var(--dur-fast) !important;
      scroll-behavior: auto !important;
    }
  }
  [data-tier="C"] *,
  [data-tier="C"] *::before,
  [data-tier="C"] *::after {
    animation: none !important;
    transition-property: opacity, color, background-color, border-color, outline-color, text-decoration-color, fill, stroke !important;
    transition-duration: var(--dur-fast) !important;
  }
  html[data-tier="C"] {
    scroll-behavior: auto;
  }
}

/* ---------------------------------------------------------------
   6. Utilities
---------------------------------------------------------------- */
@utility frame {
  width: 100%;
  max-width: var(--container-frame);
  margin-inline: auto;
  padding-inline: var(--spacing-frame);
}

@utility grid-frame {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  column-gap: var(--spacing-gutter);
  @media (width >= 48rem) {
    grid-template-columns: repeat(8, minmax(0, 1fr));
  }
  @media (width >= 64rem) {
    grid-template-columns: repeat(12, minmax(0, 1fr));
  }
}

@utility font-display-italic {
  font-family: var(--font-fraunces-italic), Georgia, serif;
  font-style: italic;
  font-optical-sizing: auto;
}

@utility fraunces-hero {
  font-variation-settings: "opsz" 144, "SOFT" 50, "WONK" 0;
}

@utility fraunces-credits {
  font-variation-settings: "SOFT" 100, "WONK" 0;
}

/* Mask an toàn cho dấu tiếng Việt khi SplitText dùng overflow hidden */
@utility split-safe {
  padding-block: 0.14em;
  margin-block: -0.14em;
}

@utility label-mono {
  font-family: var(--font-mono);
  font-size: var(--text-label);
  line-height: var(--text-label--line-height);
  letter-spacing: var(--text-label--letter-spacing);
  font-weight: 500;
  text-transform: uppercase;
  font-variant-numeric: tabular-nums slashed-zero;
}

/* Lớp grain toàn trang: <div class="grain tier-a:animate-grain" aria-hidden="true"> */
@utility grain {
  position: fixed;
  inset: -64px;
  z-index: var(--z-grain);
  pointer-events: none;
  opacity: var(--grain-opacity);
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 256px 256px;
  will-change: transform;
  transition: opacity var(--dur-slow) var(--ease-standard);
}

/* Letterbox 2.39:1 — bar bằng pseudo-element, chỉ khi viewport landscape */
@utility letterbox {
  position: relative;
  --lb-h: max(0px, calc((100svh - 100vw / 2.39) / 2));
  @media (min-aspect-ratio: 1/1) {
    &::before,
    &::after {
      content: "";
      position: absolute;
      inset-inline: 0;
      height: var(--lb-h);
      background-color: var(--bg-0);
      z-index: var(--z-content);
      pointer-events: none;
    }
    &::before {
      top: 0;
      border-bottom: 1px solid var(--line);
    }
    &::after {
      bottom: 0;
      border-top: 1px solid var(--line);
    }
  }
}

/* Light leak — chỉ scene field-notes; Tier C không render (ẩn bằng tier-c:hidden) */
@utility light-leak {
  position: absolute;
  inset: -20%;
  z-index: 0;
  pointer-events: none;
  opacity: 0.8;
  mix-blend-mode: screen;
  background:
    radial-gradient(40% 35% at 85% 15%, color-mix(in srgb, var(--grade-amber) 22%, transparent), transparent 70%),
    radial-gradient(30% 30% at 10% 90%, color-mix(in srgb, var(--grade-amber) 14%, transparent), transparent 70%);
}

/* Viewfinder brackets (§5.6). Đặt trên phần tử position: relative. */
@utility viewfinder {
  --vf-c: var(--line-strong);
  --vf-w: 1px;
  --vf-len: 12px;
  --vf-gap: 6px;
  position: relative;
  &::after {
    content: "";
    position: absolute;
    inset: calc(var(--vf-gap) * -1);
    pointer-events: none;
    background:
      linear-gradient(var(--vf-c) 0 0) top left / var(--vf-len) var(--vf-w),
      linear-gradient(var(--vf-c) 0 0) top left / var(--vf-w) var(--vf-len),
      linear-gradient(var(--vf-c) 0 0) top right / var(--vf-len) var(--vf-w),
      linear-gradient(var(--vf-c) 0 0) top right / var(--vf-w) var(--vf-len),
      linear-gradient(var(--vf-c) 0 0) bottom left / var(--vf-len) var(--vf-w),
      linear-gradient(var(--vf-c) 0 0) bottom left / var(--vf-w) var(--vf-len),
      linear-gradient(var(--vf-c) 0 0) bottom right / var(--vf-len) var(--vf-w),
      linear-gradient(var(--vf-c) 0 0) bottom right / var(--vf-w) var(--vf-len);
    background-repeat: no-repeat;
    transition: transform var(--dur-instant) var(--ease-standard);
  }
  @media (width >= 64rem) {
    --vf-len: 16px;
  }
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      --vf-c: var(--grade-amber);
    }
  }
  &:has(:focus-visible),
  &:focus-visible {
    --vf-c: var(--grade-amber);
    --vf-w: 2px;
  }
  &:active::after {
    transform: scale(0.98);
  }
}

/* ---------------------------------------------------------------
   7. Grade theo scene (§2.5)
---------------------------------------------------------------- */
@layer components {
  [data-scene] {
    position: relative;
    isolation: isolate;
    padding-block: var(--spacing-section);
  }
  [data-scene]::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background: var(--scene-grade, none);
  }
  [data-scene="opening"] {
    --scene-grade:
      radial-gradient(120% 80% at 50% 0%, color-mix(in srgb, var(--grade-teal) 8%, transparent), transparent 60%),
      radial-gradient(90% 70% at 50% 110%, color-mix(in srgb, var(--grade-amber) 6%, transparent), transparent 70%),
      radial-gradient(ellipse at 50% 50%, transparent 55%, rgb(10 10 11 / 0.6) 100%);
  }
  [data-scene="origin"] {
    --scene-grade:
      radial-gradient(60% 50% at 85% 20%, color-mix(in srgb, var(--grade-amber) 7%, transparent), transparent 70%),
      radial-gradient(ellipse at 50% 50%, transparent 60%, rgb(10 10 11 / 0.35) 100%);
  }
  [data-scene="log"] {
    --scene-grade: radial-gradient(50% 60% at 8% 0%, color-mix(in srgb, var(--grade-teal) 6%, transparent), transparent 70%);
  }
  [data-scene="pyvulds"] {
    --scene-grade:
      linear-gradient(90deg,
        color-mix(in srgb, var(--grade-teal) 10%, transparent) 0%,
        color-mix(in srgb, var(--grade-teal) 6%, transparent) 30% 70%,
        color-mix(in srgb, var(--grade-teal) 10%, transparent) 100%),
      radial-gradient(ellipse at 50% 50%, transparent 50%, rgb(10 10 11 / 0.7) 100%);
  }
  [data-scene="field-notes"] {
    --scene-grade:
      radial-gradient(80% 70% at 50% 50%, color-mix(in srgb, var(--grade-amber) 8%, transparent), color-mix(in srgb, var(--grade-amber) 12%, transparent) 100%),
      radial-gradient(ellipse at 50% 50%, transparent 55%, rgb(10 10 11 / 0.5) 100%);
  }
  [data-scene="next-scene"] {
    --scene-grade:
      radial-gradient(50% 70% at 0% 50%, color-mix(in srgb, var(--grade-teal) 6%, transparent), transparent 70%),
      radial-gradient(50% 70% at 100% 50%, color-mix(in srgb, var(--grade-amber) 6%, transparent), transparent 70%),
      radial-gradient(ellipse at 50% 50%, transparent 60%, rgb(10 10 11 / 0.35) 100%);
  }
  /* cold-open, reel, credits: bg-0 phẳng (không khai báo) */

  .hero-scrim {
    background: linear-gradient(to top, var(--scrim) 0%, var(--scrim) 40%, transparent 100%);
  }
}
```

Ghi chú áp dụng:

- Class dùng trực tiếp: `bg-bg-0`, `text-ink-3`, `border-line`, `ring-grade-amber`, `bg-primary text-primary-foreground`, `text-display-xl font-display`, `label-mono`, `px-frame`, `gap-gutter`, `py-section`, `max-w-measure`, `rounded-sm`, `z-(--z-hud)`, `duration-(--dur-fast)`, `ease-standard`, `tier-a:animate-grain`, `tier-c:hidden`, `pointer-fine:cursor-none` (chỉ vùng media).
- `data-tier` do inline boot script đặt trước paint (03a D3); khi chưa có attribute, không variant tier nào khớp → mặc định an toàn là trạng thái tĩnh. Media query `prefers-reduced-motion` vẫn là lưới an toàn khi script lỗi.
- Component shadcn sinh ra có `shadow-*`, `bg-black/50`, `rounded-xl`: class shadow/black không còn sinh CSS (đã xoá theme) — sửa overlay thành `bg-background/80` khi generate.
- Không viết hex ngoài file này (03b gate grep CI).

---

## 7. Anti-pattern riêng cho RUNTIME

| # | Không làm | Vì sao | Thay bằng |
|---|---|---|---|
| 1 | Neon xanh lá “hacker”, ma trận chữ rơi, terminal xanh trên đen | Profile yêu cầu tránh hình ảnh hacker chung chung; ngược tính “evidence-first” | Teal hệ thống + mono tabular + git-graph có dữ liệu thật |
| 2 | Glassmorphism khắp nơi (`backdrop-blur` cho HUD, card, menu) | Giảm contrast không đoán được trên video/grain; tốn GPU khi cuộn | Surface đặc bg-1/bg-2 + hairline |
| 3 | Logo wall công nghệ (Docker, K8s, AWS… thành lưới logo) | Không chứng minh gì; nhiễu thị giác | Chip tech trong từng case, gắn với outcome |
| 4 | Emoji làm icon (👋, 🚀, 🔒) | Không nhất quán, screen reader đọc lạc; di sản site cũ | Phosphor `regular`, `aria-hidden` |
| 5 | Pixel/display font cho body hoặc nội dung dài | Giảm khả năng đọc (bài học eddy-naboulet) | Geist body, Fraunces chỉ cho tiêu đề |
| 6 | Số liệu giả hoặc không phạm vi (“99.99% uptime”, “42+ CVEs”, “1,200+ commits”) | Vi phạm claim ledger §7; phá trụ Trustworthy | Chỉ claim trong ledger, OdometerMetric có footnote phạm vi |
| 7 | Trạng thái chỉ bằng màu (chấm xanh/đỏ không chữ) | WCAG 1.4.1; mơ hồ về claim | StatusBadge chữ + icon + kiểu viền |
| 8 | Odometer cho claim `reported`/mơ hồ (30 %, 90 %, GPA) | Gợi ý độ chắc chắn không có | `StaticMetric` + tag REPORTED, hoặc ẩn |
| 9 | Blur hoặc grain lên chữ nội dung (rack focus trên text) | Mất đọc, mất contrast | Blur chỉ lớp trang trí (`02a`) |
| 10 | Letterbox/light leak ở mọi scene | Mất nghĩa “khoảnh khắc điện ảnh” | Đúng vị trí §2.7–2.8 |
| 11 | Shadow lớn, gradient nút, bo tròn 12–24 px | Phá “cạnh cứng như khung phim”, trông như template SaaS | Radius ≤ 4 px, hairline |
| 12 | Custom cursor thay focus ring hoặc ẩn con trỏ native toàn trang | Phá điều hướng bàn phím, khó dùng | Cursor Tier A, chỉ `cursor: none` trên media |
| 13 | Scroll-jacking trong container (`#scroll-container`), chặn landscape | Phá scroll native/iOS, zoom (bài học curtisdesignr) | Lenis trên window, không chặn orientation |
| 14 | Nhiều theme màu / chế độ sáng chỉ để khoe | Nhân đôi chi phí contrast; loãng grade | Dark-only một grade (master §9.3) |
| 15 | Chữ trên video không scrim; ink-3 trên media | Fail contrast (C-34/C-35) | Dải scrim 0.75, chỉ ink/ink-2 |
| 16 | Viết HOA toàn bộ tiêu đề Fraunces có tiếng Việt | Dấu chồng trên chữ hoa bị cắt/chạm dòng | Sentence case; HOA chỉ cho label mono tiếng Anh |
| 17 | Cosplay nửa vời: lẫn OS/CRT/terminal với film | Ẩn dụ vỡ; eddy-naboulet mạnh vì nhất quán | Chỉ từ điển §2.1 master; boot log chỉ ở cold-open |
| 18 | Nút chỉ icon không nhãn, target < 44 px | Lỗi axe của site cũ (link icon không tên) | `aria-label`, ≥ 44×44 |
| 19 | Rec làm màu chữ hoặc nền lớn | Ink trên rec 2.85 fail; rec mất nghĩa “live” | Rec chỉ là chấm |
| 20 | Nhiều primary CTA amber trên một màn hình | Phá nguyên tắc một chủ thể | 1 primary + secondary ghost/link |

---

## 8. Checklist nghiệm thu design system (dùng ở P0–P1)

- [ ] 12 token §5.1 có trong `:root` đúng tên, đúng giá trị §2.1; không hex ngoài `globals.css`.
- [ ] Mọi cặp chữ/nền dùng trong UI có dòng trong §2.4; cặp cấm C-36…C-38 không xuất hiện (axe + review).
- [ ] Trang test font: `Mai Văn Nhật Minh · ỗ ữ ặ ẫ ợ ự · Ấ Ậ Ỗ` không bị cắt ở `display-2xl` trong SplitText mask (Tier A) và tĩnh (Tier C).
- [ ] Zoom 200 % ở 1280 px: không mất nội dung, không tràn ngang; 320 px reflow (WCAG 1.4.10).
- [ ] Mọi phần tử tương tác ≥ 44×44 px (trừ link trong đoạn), focus ring amber 2 px/2 px nhìn thấy trên bg-0/1/2 và trên amber.
- [ ] StatusBadge, REC, selected, error đều có chữ/icon ngoài màu.
- [ ] Forced Colors (Windows High Contrast): focus ring hiện, custom cursor không mount, badge còn đọc được.
- [ ] Tier C: không keyframe nào chạy, light leak không render, FilmFrame mặc định developed, OdometerMetric hiển thị giá trị cuối.

---

## Ghi chú cho orchestrator

1. Đã xử lý: master §5.1 đã cập nhật `--ink-3` = `#9A9893`.
2. Đã xử lý: 02a đã sửa TimecodeHUD, focus ring dùng base `:focus-visible` (2 px amber + offset 2 px).
3. Đã xử lý: 03a §6.2/§6.3 thống nhất roman `['opsz','SOFT','WONK']` preload, italic `['opsz']` không preload, cắt WONK → SOFT.
4. Đã xử lý: 03b hạ R12 xuống “đã giảm thiểu”, giữ smoke test `document.fonts.check()` ở P0.
5. **`pointer-fine`**: Tailwind ≥ 4.1 có sẵn `pointer-fine:`/`pointer-coarse:`; snippet không khai báo lại (tránh ghi đè) mà thêm `hover-fine` (hover + pointer fine). Nếu dự án khoá Tailwind 4.0.x thì cần thêm `@custom-variant pointer-fine { @media (pointer: fine) { @slot; } }`.
6. **`02a` `useMotionTier` khởi tạo `useState('A')`** và chỉ đặt `data-tier` sau hydrate → thiết bị touch có thể thấy trạng thái Tier A trong khoảnh khắc đầu. File này giả định `data-tier` do inline boot script đặt trước paint (03a D3); hook chỉ đồng bộ lại. Đề nghị 02a sửa giá trị khởi tạo đọc từ `document.documentElement.dataset.tier`.
7. **Component count:** brief liệt kê “15 component” nhưng danh sách có 16 mục (tính cả Custom cursor); file này spec đủ 16.
8. **Toast z-index**: master không có tầng toast; file này đặt toast ở `--z-modal` (100) để không bị grain (70) đè. Nếu master muốn tầng riêng, đề nghị thêm `toast 90`.
9. **Menu overlay ở `z-index: 50` nằm dưới grain (70)** theo master — có chủ đích (menu cũng có grain). CommandPalette 100 nằm trên grain → palette “sạch”, đúng vai trò công cụ.
