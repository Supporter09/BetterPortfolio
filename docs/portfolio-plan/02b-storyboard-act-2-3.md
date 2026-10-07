# RUNTIME — Storyboard Hồi II–III (Scenes 04–08), Ma trận Responsive & QA Motion

> **File:** `02b-storyboard-act-2-3.md`  
> **Tài liệu cha:** `00-master-plan.md` (source of truth)  
> **Tài liệu phối hợp:** `02a-motion-system-and-act-1.md` (hệ thống motion: Lenis, tiers, SplitText, timecode, chuyển trang, cursor, grain/letterbox/light leak; storyboard 00–03), `01-design-system.md` (token & component), `03a-tech-architecture.md` (cấu trúc code, media pipeline, test)  
> **Ngôn ngữ:** Đặc tả bằng tiếng Việt; copy hiển thị trên giao diện (on-site copy) viết bằng **tiếng Anh**.

File này **không định nghĩa lại** hệ thống motion. Mọi tham chiếu dạng "02a §N" trỏ tới phần tương ứng của `02a`. Token dùng đúng tên ở master §5 (`--bg-0`, `--grade-teal`, `--ease-out`, `--dur-scene`…). Cấu trúc mỗi scene giữ nguyên template 10 mục của 02a.

**Luật chung cho Hồi II–III (bổ sung, không thay thế 02a):**

1. Chỉ animate `transform`, `opacity`, `clip-path`, `filter` — trong đó `filter` **chỉ** dùng trên layer trang trí hoặc media (ảnh/video), **không bao giờ** trên text hay số liệu.
2. Trang `/` có đúng **2 pin**: `pyvulds` (Pin #1, scrub) và `reel` (Pin #2, cuộn ngang, **chỉ Tier A**). Không scene nào khác được gọi `pin: true`.
3. **Trạng thái cuối = DOM mặc định.** HTML do server render là trạng thái đã "diễn xong". Trạng thái đầu của beat chỉ được `gsap.set()` bên trong `gsap.matchMedia()` sau khi runtime nạp (03a D2), và **chỉ** cho phần tử chưa vào viewport tại thời điểm đó (deep link `/#reel` → scene đang hiển thị giữ nguyên trạng thái cuối, không "nháy ngược").
4. Không bao giờ dùng `visibility: hidden` / `display: none` để chờ animation. Phần tử đang ở `opacity: 0` vẫn nằm trong accessibility tree; nếu nó nhận focus thì scene phải tua tới beat chứa nó (xem §8 của từng scene).
5. Không odometer cho bất kỳ số nào ở Hồi II–III. Odometer chỉ dùng cho `70%` và `3` ở Scene 03 (02a B3.4–B3.5); ở đây các số đều tĩnh, đi kèm câu phạm vi.

---

# PHẦN 1: STORYBOARD CHI TIẾT HỒI II–III (SCENES 04–08)

Hồi II kết thúc bằng **cao trào kỹ thuật** (PyVulDS) và **phần còn lại của reel**. Hồi III chuyển sang **con người & hướng đi**: phía sau ống kính, KAIST như bước ngoặt định hướng, end credits, và cảnh tiếp theo.

---

## SCENE 04: FEATURE PRESENTATION (PYVULDS)
**Mã scene:** `pyvulds` · **Slate:** `SCENE 04 · TAKE 01 · FEATURE PRESENTATION` · **Grade:** Teal đậm nhất (`--grade-teal` trên `--bg-0`) · **Pin:** **Pin #1** (Tier A, `scrub: 1`, `end: '+=250%'`)

### 1. Mục đích trong câu chuyện
Cao trào kỹ thuật của cả phim. Người xem "đi dọc" pipeline 6 bước của PyVulDS như một cảnh dựng liền mạch, rồi thấy ẩn dụ **rack focus** thành hiện thực: nhiễu (38 finding) mờ đi, bằng chứng (2 finding) rõ nét. Điểm khác biệt so với portfolio thông thường: mọi con số xuất hiện **cùng lúc với phạm vi của nó**, và panel **Limitations hiển thị suốt cả cảnh**, không bao giờ bị cuộn khỏi khung khi số liệu đang trên màn hình. Đây là chỗ chứng minh trụ "Trustworthy".

### 2. Copy (EN)
- **Slate Tag:** `SCENE 04 · TAKE 01 · FEATURE PRESENTATION`
- **Title:** `PyVulDS`
- **Subtitle:** `Path-aware vulnerability triage for Python repositories`
- **Status:** `<StatusBadge status="in-production" />` → hiển thị `● IN PRODUCTION`
- **Logline:** `A staged Python vulnerability-triage workflow combining learned local scoring, bounded Deep-AST path recovery, optional LLM-assisted path selection, and sink-aware evidence filtering.`
- **Pipeline (6 stage, label mono + mô tả sans):**
  1. `01 INDEX` — `Index functions in a full repository or a change-oriented file set.`
  2. `02 LOCAL SCORING` — `Score local code windows with trained vulnerability models.`
  3. `03 DEEP-AST EXPANSION` — `Bounded AST / Deep-AST context expansion for suspicious or structurally risky functions.`
  4. `04 PATH RANKING` — `Optional: an LLM ranks a deterministic set of recovered paths.` · nhánh phụ: `Fallback: deterministic AST ranking.`
  5. `05 SINK FILTERS` — `Vulnerability-type-specific sink filters.`
  6. `06 REPORTS` — `Rich JSON · Semgrep-compatible JSON · reviewer-facing Markdown.`
- **Evidence (4 tile, mỗi tile = số + câu phạm vi, không tách rời):**
  - **E1 · Rack focus:** `38 → 2` — `Refined non-SQL sink rules reduced findings from 38 to 2 without retraining — frozen two-file PyGoat subset.`
  - **E2 · Precision:** `Precision 0.105 → 1.000` — `SQL sink filtering · recall preserved at 1.000 · labeled VAmPI SQL slice.`
  - **E3 · Path recovery:** `0/9 → 9/9` — `Expected-path recovery on a nine-case curated benchmark: local-only 0/9; Deep-AST and Deep-AST + sink filtering 9/9.`
  - **E4 · Local models:** `F1 0.900–0.972` — `Final-test F1 across seven supported vulnerability categories · frozen local models.`
- **Limitations panel (bắt buộc, tiêu đề `LIMITATIONS`):**
  - `Path-aware vulnerability triage under active refinement — not a universal static-analysis replacement.`
  - `Semgrep remains broader on framework and security-hygiene coverage.`
  - `The context-training ablation is inconclusive due to limited resolved cross-file data.`
- **CTA (primary duy nhất của scene):** `Read the PyVulDS case study` → `/work/pyvulds`

> Không dùng: "outperforms Semgrep", "state-of-the-art", "detects all…". E4 **không** vẽ 7 điểm riêng cho 7 category vì không có giá trị từng category trong claim ledger — chỉ vẽ dải `0.900–0.972`.

### 3. Wireframe Desktop 1440 (ASCII) — khung pin ở progress ≈ 1.0
```text
+----------------------------------------------------------------------------------------------------+
| NM                                      VIETNAM · 21:04 ICT · [REC ●]                   [⌘K] [MENU]|
| [=========================== 2.39:1 LETTERBOX (pin active, closes 6%) ============================] |
|    SCENE 04 · TAKE 01 · FEATURE PRESENTATION                                 [● IN PRODUCTION]     |
|    PyVulDS                                                                                         |
|    Path-aware vulnerability triage for Python repositories                                         |
|    A staged Python vulnerability-triage workflow combining learned local scoring, bounded ...      |
|                                                                                                    |
|    (01)-------(02)-------(03)-------(04)-------(05)-------(06)                                     |
|    INDEX      LOCAL      DEEP-AST   PATH       SINK       REPORTS                                  |
|               SCORING    EXPANSION  RANKING    FILTERS    rich JSON · Semgrep JSON · Markdown      |
|                                      ┆ optional LLM                                                |
|                                      └─ fallback: deterministic AST ranking                        |
|    -------------------------------------------------------------------------------------------     |
|    +---------------------+ +---------------------+ +---------------------+ +------------------+    |
|    | E1  38 → 2          | | E2  PRECISION       | | E3  0/9 → 9/9       | | E4  F1           |    |
|    | ░░▒░░▒░░░▒░░▒░░░▒░  | | 0.105 [█░░░░░░░░░]  | | local  □□□□□□□□□    | | 0.85 ─[████]─1.0 |    |
|    | ░▒░░[■]░░▒░░[■]░░▒  | | 1.000 [██████████]  | | D-AST  ■■■■■■■■■    | |   0.900–0.972    |    |
|    | (decor, aria-hidden)| | recall 1.000 (kept) | | nine-case curated   | | 7 categories,    |    |
|    | non-SQL sink rules, | | labeled VAmPI SQL   | | benchmark           | | frozen local     |    |
|    | no retraining ·     | | slice               | |                     | | models · final   |    |
|    | frozen 2-file PyGoat| |                     | |                     | | test             |    |
|    +---------------------+ +---------------------+ +---------------------+ +------------------+    |
|    +------------------------------------------------------------------------------------------+    |
|    | LIMITATIONS  · under active refinement — not a universal static-analysis replacement     |    |
|    |              · Semgrep broader on framework & security-hygiene coverage                  |    |
|    |              · context-training ablation inconclusive (limited cross-file data)          |    |
|    +------------------------------------------------------------------------------------------+    |
|    [ Read the PyVulDS case study -> ]                                                              |
| [=================================== 2.39:1 LETTERBOX (BOTTOM) ===================================] |
|                                                                                SC 04 · 00:01:52:06 |
+----------------------------------------------------------------------------------------------------+
```

### 4. Wireframe Mobile 390 (ASCII) — Tier B, không pin, xếp dọc
```text
+-----------------------------------------+
| NM                             [= MENU] |
|-----------------------------------------|
| SCENE 04 · FEATURE PRESENTATION         |
| PyVulDS             [● IN PRODUCTION]   |
| Path-aware vulnerability triage         |
| for Python repositories                 |
|                                         |
| A staged Python vulnerability-triage    |
| workflow combining learned local...     |
|                                         |
| (01) INDEX                              |
|  |   full repo or change-oriented set   |
| (02) LOCAL SCORING                      |
|  |   trained vulnerability models       |
| (03) DEEP-AST EXPANSION                 |
|  |   bounded, risky functions only      |
| (04) PATH RANKING                       |
|  ┆   optional LLM · fallback: AST       |
| (05) SINK FILTERS                       |
|  |   per vulnerability type             |
| (06) REPORTS                            |
|      JSON · Semgrep JSON · Markdown     |
|                                         |
| +-------------------------------------+ |
| | E1  38 → 2   ░▒░[■]░▒░[■]░▒         | |
| | Refined non-SQL sink rules reduced  | |
| | findings from 38 to 2 without       | |
| | retraining — frozen two-file PyGoat | |
| +-------------------------------------+ |
| | E2  PRECISION 0.105 → 1.000         | |
| | [█░░░░░░░░░] → [██████████]         | |
| | recall preserved at 1.000 · VAmPI   | |
| +-------------------------------------+ |
| | E3  0/9 → 9/9  □□□□□□□□□ ■■■■■■■■■  | |
| | nine-case curated benchmark         | |
| +-------------------------------------+ |
| | E4  F1 0.900–0.972                  | |
| | 7 categories · frozen local models  | |
| +-------------------------------------+ |
| | LIMITATIONS                         | |
| | · under active refinement — not a   | |
| |   universal static-analysis tool    | |
| | · Semgrep broader on framework &    | |
| |   hygiene coverage                  | |
| | · context-training ablation         | |
| |   inconclusive                      | |
| +-------------------------------------+ |
| [ Read the PyVulDS case study -> ]      |
+-----------------------------------------+
```
> Ở 390, Limitations đặt **ngay sau** E4 (không tách bằng khoảng trắng lớn) để không có màn hình nào chứa số liệu mà mép dưới không "thấy" tiêu đề Limitations khi cuộn tiếp.

### 5. Timeline Beats
ScrollTrigger Pin #1: `trigger: '#pyvulds .pin-frame'`, `start: 'top top'`, `end: '+=250%'`, `pin: true`, `scrub: 1`, `anticipatePin: 1`, `invalidateOnRefresh: true`. Cột "Trigger" dùng **progress của timeline pin** (0 → 1). Beat B4.1 chạy trước khi pin (không scrub).

| Beat | Trigger / Vị trí cuộn | Đối tượng | Thuộc tính chuyển động | Thời lượng / Ease | Stagger |
|---|---|---|---|---|---|
| **B4.1** | Section `top 80%` (chưa pin, play once) | Slate, title `PyVulDS` (SplitText chars, 02a §4), subtitle, badge | Slate `clip-path: inset(0 100% 0 0 -> 0 0 0 0)`; title chars `translateY(100% -> 0)` + `opacity 0 -> 1`; badge `opacity 0 -> 1` | `--dur-slow` 600ms (`--ease-out`) | chars `30ms`, khối `80ms` |
| **B4.2** | Pin start `0.00` | Letterbox bars | `transform: scaleY(0 -> 1)` trên 2 bar trang trí (đóng 6% khung) | scrub | — |
| **B4.3** | `0.02 – 0.34` | 5 connector SVG giữa 6 node | `stroke-dashoffset: 1 -> 0` (`pathLength="1"`), mỗi connector chiếm 1/5 đoạn | scrub, `ease: 'none'` | tuần tự |
| **B4.4** | Theo B4.3 (node đến lượt) | Vòng node `(01)…(06)` (trang trí) | Lớp teal phủ node `opacity 0 -> 1`, `scale(0.96 -> 1)`; label & mô tả stage **luôn opacity 1** | scrub | theo connector |
| **B4.5** | `0.20 – 0.26` | Nhánh stage 04: optional LLM (nét đứt) + fallback (nét liền) | Nét đứt: `opacity 0 -> 1` (dash tĩnh); fallback: `stroke-dashoffset 1 -> 0` | scrub | fallback trễ `0.02` |
| **B4.6** | `0.36 – 0.42` | Tile E1 (khung + text) | `clip-path: inset(0 0 100% 0 -> 0)`; text `opacity 0 -> 1`, `translateY(12px -> 0)` | scrub | — |
| **B4.7** | `0.42 – 0.52` | Rack focus: layer `chips--soft` (36 chip, `filter: blur(8px)` **tĩnh**) và layer `chips--kept` (2 chip) — cả hai `aria-hidden` | Giai đoạn 1: cả 38 chip ở layer `chips--all-sharp` `opacity 1`. Giai đoạn 2: crossfade `chips--all-sharp opacity 1 -> 0` ↔ `chips--soft opacity 0 -> 0.18`; `chips--kept` `scale(1 -> 1.04)`, viền teal `opacity 0 -> 1` | scrub | — |
| **B4.8** | `0.54 – 0.66` | E2 precision bar fill (trang trí) | `transform: scaleX(0.105 -> 1)`, `transform-origin: left`; bar recall đứng yên `scaleX(1)`; nhãn `0.105` / `1.000` là text tĩnh | scrub | — |
| **B4.9** | `0.66 – 0.78` | E3: 9 ô hàng `Deep-AST` | `opacity 0 -> 1`, `scale(0.8 -> 1)`; hàng `local-only` 9 ô rỗng đứng yên | scrub | `0.01` mỗi ô |
| **B4.10** | `0.78 – 0.86` | E4: dải F1 trên trục 0.85–1.00 | `clip-path: inset(0 100% 0 0 -> 0)` của dải; nhãn `0.900–0.972` tĩnh | scrub | — |
| **B4.11** | `0.86 – 0.92` | Panel Limitations | **Không ẩn/hiện**. Chỉ lớp viền nhấn `--grade-amber` `opacity 0 -> 1` (nhấn mạnh trước khi rời cảnh) | scrub | — |
| **B4.12** | `0.88 – 0.94` | CTA `Read the PyVulDS case study` | `opacity 0 -> 1`, `translateY(8px -> 0)` | scrub | — |
| **B4.13** | `0.94 – 1.00` | — (hold) | Khung đứng yên ~0.15 viewport để người đọc kịp đọc Limitations trước khi unpin | — | — |
| **B4.14** | Pin end → rời | Letterbox bars | `scaleY(1 -> 0)` | `--dur-base` × 0.65 ≈ 210ms (`--ease-in-out`) | — |

**Ghi chú kỹ thuật rack focus:** không scrub giá trị `blur()` trên 38 phần tử (đắt, dễ rớt frame trên GPU yếu). Blur được **bake tĩnh** trên một layer duy nhất; scrub chỉ đổi `opacity` của layer đó (composite-only). Lựa chọn scrub `filter` trực tiếp chỉ được bật nếu QA Phần 4 đo đạt 60 fps.

**Snippet khung (`components/scenes/pyvulds/pyvulds.motion.ts`)** — chỉ minh hoạ hợp đồng; `gsap`, `ScrollTrigger` lấy từ `runtime.ts` (03a):

```typescript
export function pyvuldsMotion(scope: HTMLElement, mm: gsap.MatchMedia) {
  mm.add(
    '(min-width: 1024px) and (min-height: 720px) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    () => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: scope.querySelector('.pin-frame'),
          start: 'top top',
          end: '+=250%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      // B4.3–B4.13 thêm vào tl bằng label 'pipeline' | 'e1' | 'e2' | 'e3' | 'e4' | 'limits' | 'hold'
      // focus → tua tới label chứa phần tử (xem §8)
      return () => tl.scrollTrigger?.kill(true); // mm.revert() cũng gọi, giữ để rõ ràng
    },
  );
}
```

### 6. Tier B (Mobile & Tablet)
- **Không pin.** Bố cục xếp dọc theo wireframe 390; ≥768 pipeline thành lưới 3×2, evidence lưới 2×2.
- Mỗi khối dùng reveal đơn giản khi vào `top 85%`: `opacity 0 -> 1`, `translateY(16px -> 0)`, `--dur-base` 320ms `--ease-out`, play once (không scrub).
- Pipeline dọc: đường nối vẽ một lần bằng `stroke-dashoffset` 600ms khi khối pipeline vào `top 75%`.
- Rack focus: một lần, khi tile E1 vào `top 70%` — crossfade layer sharp → soft 600ms; 2 chip kept giữ nét.
- Precision bar `scaleX(0.105 -> 1)` 600ms một lần; ô E3 stagger 30ms; dải F1 `clip-path` 400ms.
- Limitations không có animation riêng (luôn hiển thị).

### 7. Tier C (Reduced Motion)
- **Diagram tĩnh:** SVG pipeline vẽ sẵn 100%, node đều sáng, nhánh optional/fallback hiển thị đầy đủ.
- **Bảng kết quả** thay cho 4 tile: `<table>` với `<caption>PyVulDS — scoped results</caption>`, cột `Result | Value | Scope`:
  | Result | Value | Scope |
  |---|---|---|
  | Findings after refined non-SQL sink rules | 38 → 2 (no retraining) | Frozen two-file PyGoat subset |
  | Precision with SQL sink filtering | 0.105 → 1.000 (recall 1.000 preserved) | Labeled VAmPI SQL slice |
  | Expected-path recovery | Local-only 0/9; Deep-AST 9/9 | Nine-case curated benchmark |
  | Final-test F1 | 0.900–0.972 | Seven categories, frozen local models |
- Cơ chế: cả tile và bảng được server render; CSS `html[data-tier="C"] .evidence-tiles { display: none }` và ngược lại cho bảng ở tier A/B → chỉ một biến thể có trong accessibility tree. Khi không có JS (không có `data-tier`), mặc định hiện **tile ở trạng thái cuối**.
- Chip rack focus: hiển thị trạng thái cuối tĩnh (layer soft + 2 chip kept), hoặc ẩn hẳn vì là trang trí.

### 8. Tương tác & Bàn phím
- Section là `<section id="pyvulds" aria-labelledby="pyvulds-title">`; pipeline là `<ol aria-label="PyVulDS pipeline, 6 stages">`, SVG connector `aria-hidden="true"`.
- Mọi visual (chip, bar, ô, dải) `aria-hidden="true"`; số liệu và phạm vi nằm trong text thật, chọn/copy được.
- **Focus trong pin:** handler `focusin` trên scene: nếu phần tử nhận focus thuộc beat chưa chạy (ví dụ Tab tới CTA khi progress = 0.1), tính vị trí cuộn `st.start + labelProgress × (st.end − st.start)` và `getLenis()?.scrollTo(y, { duration: 0.32 })`; thứ tự Tab: badge (nếu là link) → CTA → link trong Limitations (nếu có). Không dùng `element.scrollIntoView` trong pin.
- `scroll-padding-top` (Phần 3) đảm bảo focus ring CTA không nằm dưới HUD/letterbox.
- Click CTA → chuyển trang theo 02a §6; scene này **không** có cặp Flip (Flip dành cho card ở Scene 05).

### 9. Hiệu năng
- Pin chỉ bật khi `min-height: 720px` để khung 100vh chứa đủ pipeline + 4 tile + Limitations không tràn; dưới ngưỡng dùng layout Tier B (vẫn Tier A về cursor/Lenis).
- `will-change: transform, opacity` chỉ gắn vào `.pin-frame` khi `onToggle(isActive)` và gỡ khi rời.
- SVG pipeline inline (RSC), < 6 KB; chip là 38 `<span>` CSS thuần trong 2 layer, không ảnh.
- Gọi `ScrollTrigger.refresh()` sau `document.fonts.ready` (02a §2.3) — Fraunces thay đổi chiều cao title ảnh hưởng `end` của pin.

### 10. Assets
- **A6:** Diagram PyVulDS vẽ lại từ báo cáo (dùng làm tham chiếu để dựng SVG, không nhúng raster) + bảng số liệu gốc để đối chiếu claim review.

---

## SCENE 05: THE REEL (OTHER WORK)
**Mã scene:** `reel` · **Slate:** `SCENE 05 · TAKE 01 · THE REEL` · **Grade:** Mixed (card kỹ thuật teal, card award amber) · **Pin:** **Pin #2** — cuộn ngang, **chỉ Tier A**

### 1. Mục đích trong câu chuyện
Sau cao trào PyVulDS, reel cắt nhanh qua các công việc khác như một showreel: hai hackathon có giải (`Testeria`, `HUST Smart Assistant`) và một award entry với hình ảnh giao diện thực tế (`AnimalShelter`). Nhịp **whip-pan** (02a §1) tạo cảm giác "nhiều cảnh, một người quay". Mỗi card chỉ nói outcome đã được ghi nhận — không số liệu không có bằng chứng.

> **Trạng thái hiển thị thực tế của Reel (3 card):**
> - Reel hiển thị đúng **3 card**: `Testeria` (Card 01), `HUST Smart Assistant` (Card 02), và `AnimalShelter` (Card 03). Bộ đếm counter là **3** (`01 / 03`).
> - **Tạm thời ẩn (không xoá):** SRE (`sre-release-automation`) vẫn được bảo lưu đầy đủ trong source data (`content/work.ts`) và dynamic route (`/work/sre-release-automation`), nhưng tạm thời lọc ẩn khỏi danh sách hiển thị trên reel.
> - **Tạm thời gỡ (không xoá):** Card Archive tạm thời được gỡ khỏi reel track; route `/archive` và toàn bộ dữ liệu retrospective vẫn được duy trì nguyên vẹn.
> - `AnimalShelter` sử dụng hình ảnh capture giao diện thực tế (`/media/work/animalshelter.png`) trong khi vẫn giữ trọn vẹn ngữ cảnh giải thưởng (`Second Prize — Future Blue Innovation 2022`).

### 2. Copy (EN)
- **Slate Tag:** `SCENE 05 · TAKE 01 · THE REEL`
- **Heading:** `The Reel` (hoặc `Things I've shipped`)
- **Sub-label:** `Production work and hackathon builds.`
- **Visible Reel (3 card hiển thị, counter `01 / 03`):**
  - **Card 01 — `testeria`** · `<StatusBadge status="released" />`
    - Title: `Testeria` · Award: `Second Prize — IAI Hackathon 2023`
    - Meta: `Frontend Developer · Phaser · Next.js · WebSockets · GitHub Actions`
    - Body: `RPG-style educational game platform. WebSockets supported 50+ concurrent students; deployment automated with GitHub Actions.`
    - Link: `Open case` → `/work/testeria`
  - **Card 02 — `hust-smart-assistant`** · `<StatusBadge status="released" />`
    - Title: `HUST Smart Assistant` · Award: `Fourth Place, Track — Samsung SOICT Hackathon 2023`
    - Meta: `Frontend Developer · OpenAI API · WebSockets`
    - Body: `Real-time student-services chatbot with personalized recommendations. Reported 90% query accuracy.` (render qua `<Metric>` với `claimStatus: 'reported'` — chữ "Reported" bắt buộc, không odometer)
    - Link: `Open case` → `/work/hust-smart-assistant`
  - **Card 03 — `animalshelter`** · Award entry với production capture
    - Title: `AnimalShelter` · Award: `Second Prize — Future Blue Innovation 2022`
    - Meta: `Award entry · React`
    - Media: Production capture (`/media/work/animalshelter.png`), giữ nguyên award context (`Second Prize — Future Blue Innovation 2022`).
    - Body: `Web project on protecting endangered animals for Vietnamese readers.`
    - Link: `In the archive` → `/archive` (hoặc external link)
- **Tạm thời ẩn khỏi reel (giữ nguyên trong source & routes, đánh dấu tạm thời không xoá):**
  - **`sre-release-automation` (tạm thời ẩn):** Bảo lưu trong `content/work.ts` và route `/work/sre-release-automation` (`FPT Smart Cloud · DevOps/SRE Intern · Jun–Dec 2025`; 70% fewer manual operational steps, ArgoCD notifications, centralized SonarQube, internal AI assistant; footnote: `Outcomes and technologies only. Internal details withheld.`). Tạm thời ẩn trên reel view.
  - **Card Archive (tạm thời gỡ):** Bảo lưu route `/archive` và dữ liệu archive 2020–2022 (`Vietcode · VYA · AnimalShelter · HRFO`). Tạm thời không render card điều hướng archive trong track ngang của reel.
- **Controls:** `Previous project`, `Next project` (aria-label), counter `01 / 03` (mono, `aria-hidden`)

### 3. Wireframe Desktop 1440 (ASCII) — pin active, card 02 vào khung
```text
+----------------------------------------------------------------------------------------------------+
| NM                                      VIETNAM · 21:04 ICT · [REC ●]                   [⌘K] [MENU]|
| [================================= 2.39:1 LETTERBOX (pin active) =================================] |
|    SCENE 05 · TAKE 01 · THE REEL                                          02 / 03  [=====>----]    |
|    The Reel — Production work and hackathon builds.                       [ <- Prev ] [ Next -> ] |
|                                                                                                    |
| --+  +---------------------------------------+  +---------------------------------------+  +-----  |
| 01|  | ⌜                                   ⌝ |  | ⌜                                   ⌝ |  | 03    |
|  ...| [A7 Testeria screenshot]             |  | [A7 HUST Smart Assistant]            |  | ...  |
| ..  | ⌞                                   ⌟ |  | ⌞                                   ⌟ |  |      |
|   | | REEL 01                [● RELEASED]   |  | REEL 02                [● RELEASED]   |  |      |
|   | | Testeria                              |  | HUST Smart Assistant                  |  |      |
|   | | Second Prize — IAI Hackathon 2023     |  | Fourth Place, Track — Samsung SOICT   |  |      |
|   | | Frontend Developer · Phaser · Next.js |  | Hackathon 2023 · Frontend Developer   |  |      |
|   | | WebSockets supported 50+ concurrent   |  | Real-time student-services chatbot.   |  |      |
|   | | students; GitHub Actions deploy.      |  | Reported 90% query accuracy.          |  |      |
|   | | [ Open case -> ]                      |  | [ Open case -> ]                      |  |      |
| --+  +---------------------------------------+  +---------------------------------------+  +-----  |
|                                                                                                    |
|    ← track: [01 Testeria] [02 HUST SA] [03 AnimalShelter] (SRE & Archive tạm thời ẩn khỏi reel)    |
| [=================================== 2.39:1 LETTERBOX (BOTTOM) ===================================] |
|                                                                                SC 05 · 00:02:31:20 |
+----------------------------------------------------------------------------------------------------+
```

### 4. Wireframe Mobile 390 (ASCII) — Tier B, xếp dọc (portrait < 640px)
```text
+-----------------------------------------+
| SCENE 05 · THE REEL                     |
| The Reel                                |
| Production work and hackathon builds.   |
|                                         |
| +-------------------------------------+ |
| | [A7 Testeria]  REEL 01              | |
| | Testeria · 2nd Prize IAI 2023       | |
| | 50+ concurrent students (WebSockets)| |
| |                    [ Open case -> ] | |
| +-------------------------------------+ |
| | [A7 HUST SA]   REEL 02              | |
| | HUST Smart Assistant · 4th, Track   | |
| | Reported 90% query accuracy.        | |
| |                    [ Open case -> ] | |
| +-------------------------------------+ |
| | [Production capture] REEL 03        | |
| | AnimalShelter                       | |
| | 2nd Prize — Future Blue Innov. 2022 | |
| | Web project on protecting           | |
| | endangered animals for VN readers.  | |
| |                  [ In archive -> ]  | |
| +-------------------------------------+ |
| (SRE & Archive tạm thời ẩn khỏi reel)   |
+-----------------------------------------+
```

### 5. Timeline Beats
Pin #2 (Tier A): `trigger: '#reel .pin-frame'`, `start: 'top top'`, `end: () => '+=' + (track.scrollWidth - window.innerWidth)`, `pin: true`, `scrub: 1`, `invalidateOnRefresh: true`, `snap: { snapTo: cardProgress[] , duration: { min: 0.2, max: 0.5 }, delay: 0.08, ease: 'power2.inOut' }` với `cardProgress[i] = clamp(card[i].offsetLeft − gutter, 0, maxX) / maxX`.

| Beat | Trigger / Vị trí cuộn | Đối tượng | Thuộc tính chuyển động | Thời lượng / Ease | Stagger |
|---|---|---|---|---|---|
| **B5.1** | Section `top 80%` (chưa pin) | Slate, heading, sub-label, controls | `opacity 0 -> 1`, `translateY(16px -> 0)`; heading SplitText words | `--dur-slow` 600ms (`--ease-out`) | `80ms` |
| **B5.2** | Pin `0 -> 1` | Track `.reel-track` | `transform: translateX(0 -> -maxX)` | scrub, `ease: 'none'` | — |
| **B5.3** | `containerAnimation` của B5.2, mỗi card `left 85%` | Media card (ảnh A7, trang trí) | `clip-path: inset(0 0 0 100% -> 0)`; `scale(1.04 -> 1)` | scrub theo containerAnimation | — |
| **B5.4** | Card ở giữa khung ± 25% | Viewfinder brackets `⌜⌝⌞⌟` của card active | `opacity 0 -> 1`, `scale(1.1 -> 1)` | `--dur-fast` 200ms (`--ease-standard`), exit 130ms | — |
| **B5.5** | `onUpdate(progress)` | Progress bar (trang trí) + counter `NN / 03` | Bar `scaleX(progress)`; counter đổi text khi index đổi (không tween số) | tức thời | — |
| **B5.6** | Click `Prev/Next` hoặc `ArrowLeft/Right` | Window scroll (qua Lenis) | `getLenis().scrollTo(st.start + cardProgress[i] × (st.end − st.start), { duration: 0.32, easing: easeInOut })` — whip-pan 02a §1 | `--dur-base` 320ms (`--ease-in-out`) | — |
| **B5.7** | Click `Open case` / media card | Media card `[data-flip-id="case-hero-${slug}"]` | Flip `getState` → route → Flip `from` trên hero `/work/[slug]` (02a §6) | Exit ≤ 250ms, enter 500–800ms | — |
| **B5.8** | Pin end | Letterbox | `scaleY(1 -> 0)` | ≈ 210ms (`--ease-in-out`) | — |

### 6. Tier B (Mobile & Tablet) — lựa chọn & lý do
**Chọn:** theo bề rộng, không theo thiết bị:
- **< 640px (phone dọc): stack dọc** như wireframe 390. Lý do: carousel ngang trên phone dọc giấu nội dung ngoài màn hình, người dùng phải đoán là vuốt được, và cử chỉ ngang dễ xung đột với cuộn dọc. Stack dọc đọc được 100% không cần JS, phù hợp pattern Scroll-Triggered Storytelling.
- **≥ 640px (tablet, iPad, phone ngang): hàng ngang native** `overflow-x: auto; scroll-snap-type: x mandatory; overscroll-behavior-x: contain`, card `scroll-snap-align: start`, card rộng `min(72vw, 520px)` để luôn "ló" (peek) card kế tiếp. Lý do: ở bề ngang này stack dọc lãng phí chiều ngang và trên phone ngang (cao ~390px) stack dọc thành một cột rất dài; momentum native mượt, không cần ScrollTrigger, không pin.
- Hàng ngang có nút `Prev/Next` (≥ 44×44px) gọi `track.scrollBy({ left: ±cardWidth, behavior: 'smooth' })`, progress từ `scroll` event (passive) → `scaleX`. Nút bị `disabled` ở hai đầu.
- Reveal card: `opacity 0 -> 1`, `translateY(12px -> 0)`, 320ms, stagger 60ms, play once.
- **Không Flip** khi Tier B ở phone dọc nếu card đã ra khỏi viewport lúc route đổi; vẫn Flip nếu media card còn trong khung (Flip tự xử lý).

### 7. Tier C (Reduced Motion)
- Không pin, không snap animation: ≥ 768px hiển thị **lưới tĩnh** 3 card; < 768px stack dọc 3 card.
- Không clip-path/scale media; viewfinder brackets hiển thị tĩnh khi `:focus-visible` / `:hover` (không tween).
- Nếu người dùng ở Tier C nhưng layout là hàng ngang (không xảy ra theo quy tắc trên) thì `scroll-behavior: auto` cho nút Prev/Next.
- Chuyển trang: crossfade ≤ 200ms, không Flip (02a §6).

### 8. Tương tác & Bàn phím
- Markup: `<section id="reel">` → `<div role="region" aria-label="Selected work, 3 items">` → `<ol class="reel-track">`, mỗi card `<li><article aria-labelledby>`; link `Open case` là `<a>` thật.
- **Focus → cuộn vào khung (Tier A):** `focusin` trên `.reel-track`: (1) đặt `pinFrame.scrollLeft = 0` (chặn trình duyệt tự cuộn container `overflow: hidden` gây lệch transform); (2) tính `y` theo `cardProgress[i]` và `getLenis().scrollTo(y, { duration: 0.32 })`. Không dùng `scrollIntoView`.
- **Phím mũi tên:** khi focus nằm trong region, `ArrowRight/ArrowLeft` chuyển focus sang link của card kế/trước (roving), rồi áp dụng quy tắc trên. Ngoài region không chiếm phím mũi tên. `Home/End` tới card 01/03.
- Nút `Prev/Next` luôn hiển thị (không chỉ khi hover), tap target ≥ 44×44px, `aria-controls` trỏ tới track; counter là `aria-hidden`, trạng thái được thông báo qua focus của card (không dùng `aria-live` để tránh đọc liên tục khi scrub).
- Cursor Tier A: label `VIEW` trên media card (02a §7).

### 9. Hiệu năng
- Tối đa 3 card hiển thị; ảnh A7 qua `next/image` static import, `sizes="(min-width:1024px) 40vw, 90vw"`, `loading="lazy"` (scene dưới fold).
- `maxX` và `cardProgress[]` tính lại trong `onRefresh` (`invalidateOnRefresh`); refresh sau khi ảnh card decode xong (`img.decode()` của card đầu và cuối) để `scrollWidth` đúng.
- Trước khi chuyển trang: `Flip.getState()` **rồi** `ScrollTrigger.getById('reel')?.kill()` để pin-spacer không giật trong 250ms exit.
- `containerAnimation` chỉ dùng cho B5.3; không lồng thêm ScrollTrigger dọc trong track.

### 10. Assets
- **A7:** Screenshot Testeria, HUST Smart Assistant; AnimalShelter sử dụng production capture (`/media/work/animalshelter.png`) trong khi giữ nguyên award context (`Second Prize — Future Blue Innovation 2022`). SRE workflow abstract diagram và case study được bảo lưu nguyên vẹn trong source code và route `/work/sre-release-automation`.
---

## SCENE 06: BEHIND THE LENS (FIELD NOTES)
**Mã scene:** `field-notes` · **Slate:** `SCENE 06 · TAKE 01 · BEHIND THE LENS` · **Grade:** Amber đậm nhất (`--grade-amber`), grain `--grain-opacity: 0.10` + light leak · **Pin:** Không

### 1. Mục đích trong câu chuyện
Cắt sang phía sau ống kính: người kỹ sư cũng là người quay phim — lưu giữ những khoảnh khắc mà trí nhớ chắc chắn sẽ để rơi ("I'm usually holding a camera—saving the moments my memory will definitely misplace."). Dải film negative với frame code, địa điểm cấp thành phố, timecode biến contact sheet thành những thước phim chân thật của các chuyến đi và lab tour. Hành động "develop" (negative → màu) là ẩn dụ của việc nhìn kỹ để thấy thứ thật sự trong khung hình. **KAIST SoC Global Preview Week 2026** là beat bản lề: một chuyến đi thực tế, kết nối trực tiếp với định hướng thạc sĩ nghiên cứu ở Hồi III (Credits và Next Scene).

### 2. Copy (EN)
- **Slate Tag:** `SCENE 06 · TAKE 01 · BEHIND THE LENS`
- **Heading:** `Field Notes` (hoặc `When I'm not at a terminal`)
- **Sub-label (câu sửa đổi camera-memory):** `"I'm usually holding a camera—saving the moments my memory will definitely misplace."`
- **Selected Real Frames (4 frame thực tế được lựa chọn):**
  - **Frame `00A` · DAEJEON, KR:**
    - Title: `KAIST SoC Global Preview Week 2026 — Daejeon`
    - Note / Context: `KAIST main campus gate in Daejeon.`
    - Asset: `/media/films/daejeon-gate.jpg` (tĩnh, hover/tap để develop)
  - **Frame `01A` · HANOI, VN:**
    - Title: `Return to HUST after KAIST Global Preview Week`
    - Note / Context: `Returning to HUST in Hanoi after KAIST Global Preview Week.`
    - Asset: `/media/films/hust-return.jpg` (tĩnh, hover/tap để develop)
  - **Frame `02A` · SOUTH KOREA:**
    - Title: `Korean Barbecue with Friends during KAIST Trip`
    - Note / Context: `Korean barbecue (grilled meat) with friends during the KAIST trip in South Korea.`
    - Asset: `/media/films/korean-barbecue.jpg` (tĩnh, hover/tap để develop)
  - **Frame `03A` · HOI AN, VN:**
    - Title: `Hoi An & Cu Lao Cham Summer Trip`
    - Note / Context: `Summer trip with friends to Hoi An and Cu Lao Cham.`
    - Asset: `/media/films/hoi-an-cu-lao-cham-thumb.jpg` (poster ảnh thực tế từ thumb.jpg)
    - Verified link: `https://youtu.be/G3sJAkj3-Bg` (mở video YouTube chuyến đi)
- **KAIST beat (nhóm frame riêng gồm `00A`, `01A`, `02A`):**
  - Label: `KAIST SoC GLOBAL PREVIEW WEEK 2026 · DAEJEON → SEOUL → HANOI`
  - Caption: `Completed the in-person KAIST School of Computing Global Preview Week 2026 in Daejeon and Seoul before returning to HUST in Hanoi.`
  - Bridge line: `Labs, campus walks, and shared meals with friends — the trip that made the research chapter above feel real.`
  - (Không nêu lab, giáo sư, thư mời, hay kết quả tuyển sinh — chỉ tham gia & hoàn thành.)
- **Hint (Tier B):** `swipe · tap to develop`
- **CTA (primary duy nhất của scene):** `See all films` → `/films`
- **Lightbox:** title `{code} · {CITY, CC}`, nút `Close` (Esc), `Previous frame`, `Next frame`, `Play/Pause`, `Mute/Unmute`, `Captions` (nếu có `.vtt`).
### 3. Wireframe Desktop 1440 (ASCII) — contact sheet 2 dải
```text
+----------------------------------------------------------------------------------------------------+
| NM                                      VIETNAM · 21:04 ICT · [REC ●]                   [⌘K] [MENU]|
|  ░ grain 0.10 ░                                                   ~~ light leak (decor, scrub) ~~  |
|    SCENE 06 · TAKE 01 · BEHIND THE LENS                                                            |
|    When I'm not at a terminal                                                                      |
|    I'm usually holding a camera—saving the moments my memory will definitely misplace.             |
|                                                                                                    |
|    ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮     |
|    +----------------------------------+                                                            |
|    | [03A HOI AN & CU LAO CHAM STILL] |                                                            |
|    |  summer trip with friends        |                                                            |
|    +----------------------------------+                                                            |
|    03A · HOI AN, VN · 00:00:15:00                                                                  |
|    [▶ WATCH ON YOUTUBE (youtu.be/G3sJAkj3-Bg)]                                                     |
|    ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮     |
|                                                                                                    |
|    KAIST SoC GLOBAL PREVIEW WEEK 2026 · DAEJEON → SEOUL → HANOI                                    |
|    ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮                                  |
|    +--------------------+ +--------------------+ +--------------------+   Completed the in-person  |
|    | [00A DAEJEON GATE] | | [01A HUST RETURN]  | | [02A KOREAN BBQ]   |   KAIST School of Computing|
|    |  main campus gate  | |  return to Hanoi   | |  dinner with friends   Global Preview Week 2026 |
|    +--------------------+ +--------------------+ +--------------------+   in Daejeon and Seoul     |
|    00A · DAEJEON, KR      01A · HANOI, VN        02A · SOUTH KOREA        before returning to HUST |
|    [ DEVELOP / STILL ]    [ DEVELOP / STILL ]    [ DEVELOP / STILL ]      in Hanoi.                |
|    ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮      Labs, campus walks, and  |
|                                                                           shared meals with        |
|    [ See all films -> ]                                                   friends — the trip that  |
|                                                                           made the research chapter|
|                                                                           above feel real.         |
|                                                                                SC 06 · 00:03:02:10 |
+----------------------------------------------------------------------------------------------------+
```
> 4 frame trên là các ảnh chụp thực tế đã chọn từ A2/A5: Daejeon main gate, return to HUST in Hanoi, Korean barbecue with friends in South Korea, và Hoi An/Cu Lao Cham YouTube clip.

### 4. Wireframe Mobile 390 (ASCII) — một dải, cuộn ngang native
```text
+-----------------------------------------+
| SCENE 06 · BEHIND THE LENS              |
| When I'm not at a terminal              |
| I'm usually holding a camera—saving     |
| the moments my memory will definitely   |
| misplace.                               |
| swipe · tap to develop                  |
|                                         |
| ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ |
| +-------------------------------------+ |
| | [03A HOI AN & CU LAO CHAM]          | |
| | 03A · HOI AN, VN                    | |
| | [▶ WATCH ON YOUTUBE]                | |
| +-------------------------------------+ |
| ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ |
|                                         |
| KAIST SoC GPW · DAEJEON → SEOUL → HANOI |
| +-------------------------------------+ |
| | [00A DAEJEON GATE]      [DEVELOP]   | |
| | [01A HUST RETURN]       [DEVELOP]   | |
| | [02A KOREAN BBQ]        [DEVELOP]   | |
| +-------------------------------------+ |
| Completed the in-person KAIST School    |
| of Computing Global Preview Week 2026   |
| in Daejeon and Seoul before returning   |
| to HUST in Hanoi.                       |
| Labs, campus walks, and shared meals... |
|                                         |
| [ See all films -> ]                    |

+-----------------------------------------+
```

### 5. Timeline Beats
| Beat | Trigger / Vị trí cuộn | Đối tượng | Thuộc tính chuyển động | Thời lượng / Ease | Stagger |
|---|---|---|---|---|---|
| **B6.1** | Scene active (IntersectionObserver ≥ 0.3, cùng nguồn với TimecodeHUD) | Lớp grain toàn trang (02a §8) | `html[data-active-scene="field-notes"]` → `--grain-opacity: 0.06 -> 0.10`; layer grain `opacity` crossfade | `--dur-slow` 600ms (`--ease-standard`); rời scene 400ms | — |
| **B6.2** | Section `top bottom` → `bottom top` | Light leak (radial gradient, trang trí, `aria-hidden`) | `transform: translateX(-10% -> 10%)`, `opacity 0 -> 0.35 -> 0` | scrub (không loop tự chạy) | — |
| **B6.3** | Slate/heading `top 80%` | Slate, heading SplitText words, sub-label | `opacity 0 -> 1`, `translateY(16px -> 0)` | 600ms (`--ease-out`) | `80ms` |
| **B6.4** | Mỗi dải `top 75%` | Sprocket rail + frame | `clip-path: inset(0 100% 0 0 -> 0)` theo dải; frame `opacity 0 -> 1` | 500ms (`--ease-out`) | frame `60ms` |
| **B6.5** | `:hover`, `:focus-within`, `aria-pressed="true"` | `.frame-media` (img/video, **không** text) | `filter: invert(1) grayscale(1) -> none` | enter `--dur-base` 320ms, exit 200ms (`--ease-standard`) | — |
| **B6.6** | Hover ≥ 250ms (intent), **chỉ Tier A** | Video preview muted trong frame | Gắn source lười (`preload="none"`), `play()`, crossfade poster→video `opacity` | `--dur-fast` 200ms | — |
| **B6.7** | Nhóm KAIST `top 70%` | Label, caption, bridge line | `opacity 0 -> 1`, `translateY(12px -> 0)` | 450ms (`--ease-out`) | `100ms` |
| **B6.8** | Click/Enter `▶ PLAY` | shadcn Dialog: overlay + content | Overlay `opacity 0 -> 1`; content `opacity 0 -> 1`, `scale(0.98 -> 1)` | enter 320ms (`--ease-out`), exit 200ms | — |

### 6. Tier B (Mobile & Tablet)
- Desktop contact sheet 2 dải → **một dải ngang native** `overflow-x: auto; scroll-snap-type: x mandatory`, frame rộng `78vw` (peek frame kế), counter `01A / 07A` + nút `<` `>` ≥ 44px. Nhóm KAIST tách thành dải riêng ngay dưới. ≥ 768px: dải hiển thị 2.3 frame.
- **Không** auto-advance, không carousel tự chạy.
- Develop: tap vào frame (nút develop) → `aria-pressed` toggle; `:focus-within` cũng develop. Không hover preview video (không có hover thật; tránh tải video trên mạng di động).
- Light leak giữ, nhưng chỉ `opacity` cố định 0.25 (không scrub) để giảm composite trên GPU yếu; grain 0.10 giữ.

### 7. Tier C (Reduced Motion)
- Frame hiển thị **đã develop** (màu) ngay từ đầu; nút develop vẫn tồn tại nhưng chuyển trạng thái tức thì (không transition `filter`).
- Không light leak, grain tĩnh (không step animation) theo 02a §8.
- Không hover preview. Lightbox: video **không autoplay**, hiển thị poster + nút Play; overlay crossfade ≤ 200ms, không scale.
- Dải vẫn cuộn ngang native được trên mobile (cuộn do người dùng điều khiển, không phải motion).

### 8. Tương tác & Bàn phím
- Mỗi frame là `<figure>` gồm **hai** control rõ ràng (khớp test 03a §9.3):
  1. `button.frame-develop` (toàn vùng ảnh, `aria-pressed`): hover/focus → develop tạm; click/tap/Enter/Space → develop cố định, lặp lại → về negative.
  2. `button.frame-play` (`▶ PLAY`, ≥ 44×44px) → mở lightbox.
  `<figcaption>` chứa frame code, thành phố, timecode dạng text thật.
- **Lightbox (shadcn Dialog):** `Esc` đóng; focus trap trong dialog; đóng xong focus trả về đúng `button.frame-play` đã mở. Mọi control ≥ 44×44px: Play/Pause (`aria-pressed`), Mute, Captions (`<track kind="captions" srclang="en" label="English" default>` khi clip có lời — 03a §5.4), Prev/Next frame, Close. Prev/Next **chỉ** khi người dùng bấm, không tự chuyển.
- Video trong lightbox: mở do người dùng → được phép play, nhưng bắt đầu **muted**; Tier C bắt đầu paused.
- Cursor Tier A: brackets trên frame, label `PLAY` trên nút play (02a §7).

### 9. Hiệu năng
- Poster/still A5 qua `next/image` (AVIF/WebP), metadata/EXIF/GPS đã xoá (03a §5.4); video preview & lightbox `preload="none"`, gắn source khi cần.
- **Chính sách phát (03a §5.3):** clip Scene 06 không bao giờ tự phát khi vào viewport; chỉ phát khi hover ≥ 250ms (Tier A, B6.6) hoặc người dùng bấm `▶ PLAY` (lightbox, B6.8).
- **Tối đa 1 video** chạy cùng lúc ngoài hero (03a §5.3): mở hover preview mới → pause preview cũ; mở lightbox → pause mọi preview.
- Preview rời viewport hoặc `visibilitychange` → `pause()`.
- `filter` chỉ trên `.frame-media`; không đặt `will-change: filter` thường trực — chỉ bật khi hover/focus.
- `ScrollTrigger.refresh()` sau khi poster của dải đầu decode (chiều cao frame cố định bằng `aspect-ratio` nên CLS = 0, refresh chỉ để chắc chắn vị trí trigger B6.4/B6.7).

### 10. Assets
- **A2/A5:** 4 still frames thực tế đã chọn lưu trong `/media/films/`:
  - `daejeon-gate.jpg` (`00A`, KAIST main campus gate tại Daejeon).
  - `hust-return.jpg` (`01A`, trở về HUST tại Hà Nội sau chuyến đi KAIST).
  - `korean-barbecue.jpg` (`02A`, bữa thịt nướng Hàn Quốc cùng bạn bè tại Hàn Quốc).
  - `hoi-an-cu-lao-cham-thumb.jpg` (`03A`, poster chuyến đi Hội An & Cù Lao Chàm từ thumb.jpg).
- **A3:** Video YouTube Hội An & Cù Lao Chàm với verified link `https://youtu.be/G3sJAkj3-Bg`.
- **A10:** Xác nhận đồng ý xuất hiện trong footage và được phép nhắc tên KAIST GPW 2026.
---

## SCENE 07: CREDITS (EDUCATION & AWARDS)
**Mã scene:** `credits` · **Slate:** `SCENE 07 · TAKE 01 · CREDITS` · **Grade:** Neutral (`--bg-0`, chữ `--ink` / `--ink-2`) · **Pin:** Không

### 1. Mục đích trong câu chuyện
Giáo dục và giải thưởng trình bày như **end credits**: hai cột vai trò / tên, nhịp chậm, khiêm tốn. Thay vì "wall of trophies", credits là một bảng ghi nhận đọc được ngay, đúng giọng "evidence-first". Đặc biệt, 3 giải thưởng hackathon/dự án trọng điểm được tích hợp **preview bằng chứng tương tác nổi (floating evidence preview)**, cho phép người xem kiểm chứng ngay chứng chỉ/ảnh chụp thực tế mà không gây dịch chuyển layout (zero layout shift).

### 2. Copy (EN)
- **Slate Tag:** `SCENE 07 · TAKE 01 · CREDITS`
- **Heading:** `Credits` (hoặc `Achievements`)
- **Sub-label:** `Shiny things, honestly earned.`
- **Rows (cột trái = role, mono `--ink-3`; cột phải = name, sans `--ink`):**

| Role (left) | Name (right) | Evidence Preview (Floating Plate) |
|---|---|---|
| `STUDYING` | `Cyber Security — Hanoi University of Science and Technology (SOICT) · 2023–present` | — (text-only) |
| `ACADEMIC ACHIEVEMENT SCHOLARSHIP` | `HUST · Semester 2024.1` | — (text-only) |
| `ACADEMIC ACHIEVEMENT SCHOLARSHIP` | `HUST · Semester 2024.2` | — (text-only) |
| `ACADEMIC ACHIEVEMENT SCHOLARSHIP` | `HUST · Semester 2025.1` | — (text-only) |
| `THIRD PLACE` | `Student Creative Ideas Challenge 2024` | — (text-only) |
| `FOURTH PLACE, TRACK` | `Samsung SOICT Hackathon 2023 · HUST Smart Assistant` | **Mapped:** `MEDIA.evidence['hust-smart-assistant']` (`/media/evidence/hust-smart-assistant.jpg`) |
| `SECOND PRIZE` | `IAI Hackathon 2023 · Testeria` | **Mapped:** `MEDIA.evidence['iai-hackathon']` (`/media/evidence/iai-hackathon.jpg`) |
| `SECOND PRIZE` | `Future Blue Innovation 2022 · AnimalShelter` | **Mapped:** `MEDIA.evidence['future-blue']` (`/media/evidence/future-blue.jpg`) |
| `COMPLETED IN PERSON` | `KAIST School of Computing Global Preview Week 2026 · Daejeon & Seoul` | — (text-only) |
| `ENGLISH` | `IELTS Academic 7.5` — `claimStatus: 'verified'` (master §7); không ghi ngày thi, "valid until" hay bất kỳ hiệu lực nào | — (text-only) |

- **Không hiển thị:** GPA/CPA (ẩn tới khi có bảng điểm chính thức), tháng tốt nghiệp, MSSV.
- **Proof cues:** Mỗi dòng có evidence plate hiển thị icon camera 14px (`PixelIcon name="cam"`) và gạch chân hairline, kích hoạt mở floating evidence plate.

### 3. Wireframe Desktop 1440 (ASCII)
```text
+----------------------------------------------------------------------------------------------------+
| NM                                      VIETNAM · 21:04 ICT · [REC ●]                   [⌘K] [MENU]|
|                                                                                                    |
|    SCENE 07 · TAKE 01 · CREDITS                                                                    |
|                                                                                                    |
|                                           C R E D I T S                                            |
|                                                                                                    |
|                        STUDYING   Cyber Security — Hanoi University of Science                     |
|                                   and Technology (SOICT) · 2023–present                            |
|                                                                                                    |
|        ACADEMIC ACHIEVEMENT SCHOLARSHIP   HUST · Semester 2024.1                                   |
|        ACADEMIC ACHIEVEMENT SCHOLARSHIP   HUST · Semester 2024.2                                   |
|        ACADEMIC ACHIEVEMENT SCHOLARSHIP   HUST · Semester 2025.1                                   |
|                                                                                                    |
|                         THIRD PLACE   Student Creative Ideas Challenge 2024                        |
|                 FOURTH PLACE, TRACK   Samsung SOICT Hackathon 2023 [📷] · HUST Smart Assistant     |
|                        SECOND PRIZE   IAI Hackathon 2023 [📷] · Testeria                           |
|                                       +-----------------------------------+                        |
|                                       | EVIDENCE · IAI HACKATHON [VERIFIED| (floating plate,       |
|                                       | [Certificate plate image 4:3]     |  position: absolute    |
|                                       +-----------------------------------+  zero CLS)             |
|                        SECOND PRIZE   Future Blue Innovation 2022 [📷] · AnimalShelter             |
|                                                                                                    |
|                 COMPLETED IN PERSON   KAIST School of Computing Global Preview Week 2026           |
|                                       Daejeon & Seoul                                              |
|                             ENGLISH   IELTS Academic 7.5                                           |
|                                                                                                    |
|      ░ decorative film-leader watermark "07" — optional slow drift (Tier A, scroll-linked) ░       |
|                                                                                SC 07 · 00:03:31:04 |
+----------------------------------------------------------------------------------------------------+
```

### 4. Wireframe Mobile 390 (ASCII) — role trên, name dưới
```text
+-----------------------------------------+
| SCENE 07 · CREDITS                      |
|                                         |
|             C R E D I T S               |
|                                         |
| STUDYING                                |
| Cyber Security — HUST (SOICT)           |
| 2023–present                            |
|                                         |
| ACADEMIC ACHIEVEMENT SCHOLARSHIP        |
| HUST · 2024.1 · 2024.2 · 2025.1         |
|                                         |
| THIRD PLACE                             |
| Student Creative Ideas Challenge 2024   |
|                                         |
| FOURTH PLACE, TRACK                     |
| Samsung SOICT Hackathon 2023 [📷]       |
| · HUST Smart Assistant                  |
|                                         |
| SECOND PRIZE                            |
| IAI Hackathon 2023 [📷] · Testeria      |
| +-------------------------------------+ |
| | EVIDENCE · IAI HACKATHON [VERIFIED] | | (floating plate)
| | [Certificate plate image]           | |
| +-------------------------------------+ |
|                                         |
| SECOND PRIZE                            |
| Future Blue Innovation 2022 [📷]        |
| · AnimalShelter                         |
|                                         |
| COMPLETED IN PERSON                     |
| KAIST SoC Global Preview Week 2026      |
| Daejeon & Seoul                         |
|                                         |
| ENGLISH                                 |
| IELTS Academic 7.5                      |
+-----------------------------------------+
```
> Mobile gộp 3 học bổng thành một mục 3 học kỳ để giảm chiều dài; vẫn đủ ba học kỳ. 3 giải thưởng có trigger bằng chứng [📷] mở plate nổi không xô lệch bố cục.

### 5. Timeline Beats
| Beat | Trigger / Vị trí cuộn | Đối tượng | Thuộc tính chuyển động | Thời lượng / Ease | Stagger |
|---|---|---|---|---|---|
| **B7.1** | Section `top 80%` | Slate + heading `Credits` (SplitText chars, letter-spacing tĩnh) | chars `opacity 0 -> 1`, `translateY(40% -> 0)` | 600ms (`--ease-out`) | `40ms` |
| **B7.2** | Mỗi nhóm hàng `top 85%` | Hàng credit (`<div>` trong `<dl>`) | `opacity 0 -> 1`, `translateY(12px -> 0)` | `--dur-base` 320ms (`--ease-out`) | `40ms` mỗi hàng |
| **B7.3** | Section `top bottom` → `bottom top`, **chỉ Tier A, tuỳ chọn** | Watermark `07` / film leader (trang trí, `aria-hidden`) | `transform: translateY(0 -> -8%)` (yPercent trong khoảng 5–15 của master §1.3) | scrub | — |

Không có auto-scroll kiểu credits truyền hình: nội dung **không bao giờ tự di chuyển**; chỉ layer trang trí trôi theo vị trí cuộn của người dùng.

### 6. Tier B (Mobile & Tablet)
- Mobile: role trên / name dưới (wireframe 390). ≥ 768: hai cột như desktop, căn giữa theo trục.
- Chỉ B7.1 (SplitText theo words) và B7.2; bỏ B7.3.
- Floating evidence preview hoạt động đầy đủ qua tap/click (chạm để mở/đóng, chạm ra ngoài để đóng).

### 7. Tier C (Reduced Motion)
- Toàn bộ credits hiển thị tĩnh trạng thái cuối; không drift, không SplitText.
- Floating evidence plate hiển thị tức thì khi hover/focus/tap không animation (`animation: none`).

### 8. Tương tác, Bàn phím & Floating Evidence Previews
- **Ngữ nghĩa:** `<dl>` với cặp `<dt>` (role) / `<dd>` (name); heading `<h2 id="credits-title">`. Dòng tĩnh do server render trực tiếp; 3 dòng có bằng chứng gắn client island `CreditEntry`.
- **Cơ chế Floating Evidence (Zero Layout Shift):**
  - Plate bằng chứng (`.evidencePlate`) được định vị tuyệt đối (`position: absolute; top: calc(100% + 0.5rem); left: 0; width: min(21rem, calc(100vw - 2.5rem)); z-index: 30`).
  - Nổi tự do phía trên danh sách, không nằm trong DOM flow thông thường nên **hoàn toàn không gây layout shift (CLS = 0)** khi bật tắt.
- **Tương tác đa phương thức hỗ trợ tiếp cận (Accessible Multi-modal):**
  - **Hover:** Rê chuột vào dòng entry (`onPointerEnter` / `onPointerLeave`) tự động mở/đóng preview xem trước mượt mà.
  - **Focus:** Phím Tab điều hướng tới nút trigger (`button.evidenceTrigger`) tự động mở preview (`onFocus`); blur ra ngoài vùng entry đóng preview (`onBlur`).
  - **Tap / Click:** Chạm hoặc click chuột vào nút trigger để lật trạng thái (`aria-expanded`, `aria-controls`). Chạm ra ngoài (outside click/pointerdown) tự động đóng plate. Nếu vừa đóng bằng click/tap, cơ chế tự động mở khi hover bị tạm khoá cho đến khi con trỏ rời khỏi entry.
  - **Escape Dismissal:** Bấm phím `Escape` khi plate đang mở sẽ lập tức đóng plate (`setIsOpen(false)`), chặn bubble/scroll (`stopPropagation`, `preventDefault`), và trả focus chính xác về nút trigger (`triggerRef.current?.focus()`).
- **Khả năng tiếp cận & Trợ năng:**
  - Nút trigger có `id`, `aria-expanded={isOpen}`, `aria-controls={previewId}`. Icon camera mang `aria-hidden="true"`.
  - Plate mang thuộc tính `id={previewId}`, `role="region"`, `aria-label="Evidence for {name}"`.
  - Header plate hiển thị label evidence pixel và status badge `VERIFIED`. Khung media hiển thị qua `<MediaFrame>` với viewfinder.
  - Hỗ trợ đầy đủ `@media (prefers-reduced-motion: reduce)`.

### 9. Hiệu năng
- Thuần text + 1 SVG watermark; 3 ảnh evidence tối ưu qua `next/image` với `sizes="(min-width: 768px) 360px, 90vw"`, decode lazy. Mọi hàng render từ `content` đã qua guard (`publishable()`); IELTS là claim `verified` nên luôn có trong HTML production (không kèm ngày/hiệu lực); GPA/CPA không có trong content.

### 10. Assets
- **A7/Evidence Plates (3 mapped assets):**
  - `/media/evidence/hust-smart-assistant.jpg`: Plate giao diện chatbot HUST Smart Assistant cho Samsung SOICT Hackathon 2023.
  - `/media/evidence/iai-hackathon.jpg`: Giấy chứng nhận giải Nhì (Second Prize) tại IAI Hackathon 2023 cho Testeria.
  - `/media/evidence/future-blue.jpg`: Giấy chứng nhận giải Nhì (Second Prize) tại Future Blue Innovation 2022 cho AnimalShelter.
---

## SCENE 08: NEXT SCENE (DIRECTION & CONTACT)
**Mã scene:** `next-scene` · **Slate:** `SCENE 08 · TAKE 01 · NEXT SCENE` · **Grade:** Teal + Amber (hai tông gặp nhau) · **Pin:** Không

### 1. Mục đích trong câu chuyện
Climax của lời mời: phim chưa kết thúc, đây là **cảnh tiếp theo đang ở pre-production**. Hướng nghiên cứu được gắn badge `PRE-PRODUCTION` nên không thể bị đọc nhầm là đã làm xong. Mục tiêu thạc sĩ Fall 2027 nói rõ ràng, rồi một CTA duy nhất mời trao đổi. Kết bằng fade-to-black `END OF RUNTIME`.

### 2. Copy (EN)
- **Slate Tag:** `SCENE 08 · TAKE 01 · NEXT SCENE`
- **Heading:** `Next Scene`
- **Intro:** `Candidate themes for an undergraduate capstone and thesis at the intersection of network security, distributed systems, and agentic AI. Planning directions — not completed projects or publications.`
- **Direction cards (mỗi card `<StatusBadge status="pre-production" />` → `○ PRE-PRODUCTION`):**
  1. `Safe agentic network defense`
  2. `Protocol fuzzing`
  3. `Adversarial robustness of security agents`
  4. `Verification of automated remediation`
  > Card chỉ có tiêu đề + badge. Không thêm mô tả phương pháp/kết quả. Nếu Minh muốn mỗi card một dòng, viết dạng **câu hỏi** và đưa vào buổi claim review.
- **Goal:** `Next: a research-intensive master's in cybersecurity, systems security, or network security — targeting Fall 2027.`
- **Support line:** `Strengthening foundations in networking, distributed systems, and rigorous security experimentation.`
- **CTA (primary — climax của cả site):** `Discuss security systems and research collaboration` → kênh liên hệ **đã duyệt** (mailto công việc hoặc LinkedIn, master §9.5), đọc qua `assertPublishable('contact-primary')` (claim ledger 03a: `contact-primary | confirm-before-publish | fail`).
- **Footer (site-footer, ngay sau scene):**
  - `ENGINEERING` — `GitHub` · `LinkedIn` · `Email` — mỗi mục là placeholder `[pending approval]` cho tới khi A8 được duyệt (không render `href="#"`).
  - `FILM` — `Video channel` — `[pending approval]`.
  - Build info (03a): `Built with Next.js · GSAP · Lenis — build {SHA} · {date}`.
- **Closing card:** `END OF RUNTIME` + nút `Back to top`.

### 3. Wireframe Desktop 1440 (ASCII)
```text
+----------------------------------------------------------------------------------------------------+
| NM                                      VIETNAM · 21:04 ICT · [REC ●]                   [⌘K] [MENU]|
|                                                                                                    |
|    SCENE 08 · TAKE 01 · NEXT SCENE                                                                 |
|    Next Scene                                                                                      |
|    Candidate themes for an undergraduate capstone and thesis at the intersection of network        |
|    security, distributed systems, and agentic AI. Planning directions — not completed projects.    |
|                                                                                                    |
|    +---------------------+ +---------------------+ +---------------------+ +---------------------+ |
|    | ○ PRE-PRODUCTION    | | ○ PRE-PRODUCTION    | | ○ PRE-PRODUCTION    | | ○ PRE-PRODUCTION    | |
|    |                     | |                     | |                     | |                     | |
|    | Safe agentic        | | Protocol fuzzing    | | Adversarial         | | Verification of     | |
|    | network defense     | |                     | | robustness of       | | automated           | |
|    |                     | |                     | | security agents     | | remediation         | |
|    +---------------------+ +---------------------+ +---------------------+ +---------------------+ |
|                                                                                                    |
|    Next: a research-intensive master's in cybersecurity, systems security, or network security    |
|    — targeting Fall 2027.                                                                          |
|    Strengthening foundations in networking, distributed systems, and rigorous security             |
|    experimentation.                                                                                |
|                                                                                                    |
|               [  Discuss security systems and research collaboration  -> ]                        |
|                                                                                                    |
|----------------------------------------------------------------------------------------------------|
|    ENGINEERING                                  FILM                                               |
|    GitHub    [pending approval]                 Video channel  [pending approval]                  |
|    LinkedIn  [pending approval]                                                                    |
|    Email     [pending approval]                 Built with Next.js · GSAP · Lenis — build a1b2c3d  |
|                                                                                                    |
|                                   E N D   O F   R U N T I M E                                      |
|                                         [ Back to top ↑ ]                                          |
|                                                                                SC 08 · 00:04:00:00 |
+----------------------------------------------------------------------------------------------------+
```

### 4. Wireframe Mobile 390 (ASCII)
```text
+-----------------------------------------+
| SCENE 08 · NEXT SCENE                   |
| Next Scene                              |
| Candidate themes for an undergraduate   |
| capstone and thesis ... Planning        |
| directions — not completed projects or  |
| publications.                           |
|                                         |
| +-------------------------------------+ |
| | ○ PRE-PRODUCTION                    | |
| | Safe agentic network defense        | |
| +-------------------------------------+ |
| | ○ PRE-PRODUCTION                    | |
| | Protocol fuzzing                    | |
| +-------------------------------------+ |
| | ○ PRE-PRODUCTION                    | |
| | Adversarial robustness of security  | |
| | agents                              | |
| +-------------------------------------+ |
| | ○ PRE-PRODUCTION                    | |
| | Verification of automated           | |
| | remediation                         | |
| +-------------------------------------+ |
|                                         |
| Next: a research-intensive master's in  |
| cybersecurity, systems security, or     |
| network security — targeting Fall 2027. |
|                                         |
| [ Discuss security systems and        ] |
| [ research collaboration ->           ] |
|-----------------------------------------|
| ENGINEERING                             |
| GitHub · LinkedIn · Email               |
| [pending approval]                      |
| FILM                                    |
| Video channel [pending approval]        |
|                                         |
|          END OF RUNTIME                 |
|         [ Back to top ↑ ]               |
+-----------------------------------------+
```

### 5. Timeline Beats
| Beat | Trigger / Vị trí cuộn | Đối tượng | Thuộc tính chuyển động | Thời lượng / Ease | Stagger |
|---|---|---|---|---|---|
| **B8.1** | Section `top 80%` | Slate + heading `Next Scene` (SplitText chars) + intro | chars `translateY(100% -> 0)`, `opacity 0 -> 1`; intro `opacity 0 -> 1` | 600ms (`--ease-out`) | chars `35ms` |
| **B8.2** | Hàng card `top 80%` | 4 direction card | `clip-path: inset(100% 0 0 0 -> 0)`, `opacity 0 -> 1`; badge `○` viền nét đứt quay `rotate(0 -> 90deg)` một lần (trang trí) | `--dur-slow` 600ms (`--ease-out`) | `90ms` |
| **B8.3** | Goal `top 80%` | Goal + support line | `opacity 0 -> 1`, `translateY(16px -> 0)` | 450ms (`--ease-out`) | `100ms` |
| **B8.4** | CTA `top 85%` | CTA climax | `opacity 0 -> 1`, `scale(0.98 -> 1)`; lớp viền amber (trang trí) `opacity 0 -> 1` | `--dur-scene` 900ms (`--ease-out`) | — |
| **B8.5** | Footer `top bottom` → `bottom bottom` | Lớp grade teal/amber của scene (trang trí) | **Fade-to-black:** `opacity 1 -> 0` → nền còn `--bg-0` (không dùng `#000` cho mặt lớn) | scrub | — |
| **B8.6** | Cuối trang (`bottom bottom`) | `END OF RUNTIME` + REC dot HUD | Text `opacity 0 -> 1` (letter-spacing tĩnh); REC dot `●` crossfade sang `■` (stop) | `--dur-scene` 900ms | — |
| **B8.7** | Click `Back to top` | Window scroll | `getLenis()?.scrollTo(0, { duration: 1.2 })` (Tier A) / `window.scrollTo({ top: 0, behavior: 'smooth' })` (Tier B) / `behavior: 'auto'` (Tier C); sau đó focus `NM` monogram | 1.2s (`--ease-in-out`) | — |

### 6. Tier B (Mobile & Tablet)
- Card xếp 1 cột (390) / 2×2 (768). Bỏ xoay viền badge. B8.5 fade-to-black thay bằng gradient tĩnh về `--bg-0` (không scrub).
- `Back to top` dùng smooth scroll native.

### 7. Tier C (Reduced Motion)
- Mọi khối hiện trạng thái cuối. Nền cuối trang tĩnh `--bg-0`, `END OF RUNTIME` hiển thị sẵn. `Back to top` nhảy tức thì và chuyển focus.

### 8. Tương tác & Bàn phím
- Direction cards là `<ul>` các `<li>` tĩnh (không phải link — không có trang chi tiết cho kế hoạch chưa làm).
- CTA climax là `<a>` thật tới kênh đã duyệt (`mailto:` hoặc LinkedIn, `rel="noopener"` khi ngoài site), lấy từ `assertPublishable('contact-primary')`. **Nếu chưa có kênh duyệt:** build preview hiển thị CTA dạng nút `disabled` có nhãn `Contact channel pending approval`; build production **fail** (ledger `contact-primary` có `onUnconfirmed: 'fail'`, guard 03b) — không bao giờ ship `href="#"`.
- Footer là landmark `<footer>`; hai nhóm `<nav aria-label="Engineering links">` / `<nav aria-label="Film links">`. Link Email/kênh liên hệ trong footer cũng đọc `assertPublishable('contact-primary')`. Placeholder `[pending approval]` là text, không phải link, và bị guard xoá ở production.
- `Back to top`: sau khi cuộn xong, `focus()` vào monogram `NM` (hoặc skip link) để người dùng bàn phím không bị kẹt ở cuối trang.
- `⌘K` → `Copy email` chỉ có khi email đã duyệt (master §4.2) — palette đọc cùng `assertPublishable('contact-primary')`.

### 9. Hiệu năng
- Không media. Lớp grade là 2 radial gradient trên một pseudo-element, chỉ scrub `opacity`.
- B8.5 dùng `end: 'bottom bottom'` — trên trang ngắn hơn dự kiến (Tier C/B), trigger vẫn hợp lệ; `ScrollTrigger.refresh()` sau khi ảnh ở scene trên load (Phần 4) để `bottom bottom` không lệch.

### 10. Assets
- **A8:** link công khai (GitHub, LinkedIn, email công việc, kênh video) — cần Minh duyệt. Không có asset hình.

---

# PHẦN 2: MA TRẬN RESPONSIVE (9 SCENE × 6 VIEWPORT)

Quy ước cột:
- **390** — phone dọc (390×844), `pointer: coarse` → **Tier B**.
- **768** — tablet dọc (768×1024) → **Tier B**.
- **1024** — laptop nhỏ (1024×768, `pointer: fine`) → **Tier A**, nhưng chiều cao khả dụng thường < 720px nên Pin #1 **rơi về layout xếp dọc** (guard `min-height: 720px`). iPad ngang 1024 (`pointer: coarse`) → **Tier B**.
- **1440** — desktop chuẩn (1440×900) → **Tier A** đầy đủ.
- **1920** — desktop lớn (1920×1080) → **Tier A**; khung nội dung tối đa 1440px + margin "frame" (master §5.4), media có thể full-bleed.
- **Land.** — phone ngang (844×390 / 915×412), `pointer: coarse` → **Tier B**. **Luôn hỗ trợ, không bao giờ chặn xoay** (khác curtisdesignr). HUD rút gọn như mobile; TimecodeHUD ẩn khi `max-height: 500px` để không che nội dung.

Mọi ô áp dụng thêm: Tier C ghi đè motion (Phần 3), layout giữ như cột tương ứng.

| Scene | 390 | 768 | 1024 | 1440 | 1920 | Land. (844×390) |
|---|---|---|---|---|---|---|
| `cold-open` | Tier B: 4 dòng log, ≤ 1.6s, Skip ≥ 44px (02a) | Như 390, chữ mono lớn hơn | Tier A: 6 dòng + slate clap, ≤ 2.4s | Như 1024 | Như 1024, khối log căn giữa, tối đa 72ch | 4 dòng, ≤ 1.6s; log + slate xếp ngang 2 cột để vừa chiều cao 390 |
| `opening` | Video 720p/poster, letterbox, tên + tagline + 2 CTA xếp dọc (02a wireframe 390); SplitText words | Như 390, 2 CTA cùng hàng | Video 1080p, SplitText chars, dolly scale 1.00→1.06 (02a B1.6) | Như 1024 (02a wireframe 1440) | Video full-bleed, text vẫn trong khung 1440 | Letterbox **tắt** (chiều cao quá thấp); poster/video `object-fit: cover`, tên + tagline; subheadline cắt sau 2 dòng + CTA vẫn trong DOM, cuộn tới được |
| `origin` | Linear stack: portrait trên, bio dưới; bio reveal một lần dạng khối (`opacity 0 -> 1`, `translateY(16px -> 0)`, 450ms), không split/dim từng từ | Như 390, portrait 2/3 bề rộng | 2 cột, portrait sticky CSS `top: 120px`, bio reveal một lần dạng khối (450ms, chạy một lần; không scrub từng từ) | Như 1024 | Như 1024, measure bio 60–72ch | 2 cột (portrait 40% / bio 60%), **không sticky** (chiều cao < 500px) |
| `log` | Single vertical spine, card commit; odometer 70% & 3 (02a Tier B) | Như 390, card rộng hơn | Git-graph 5 lane SVG, odometer (02a B3.1–B3.5) | Như 1024 (02a wireframe 1440) | Như 1024, cột hash/metric giãn | Single spine; card 2 cột để giảm chiều dài |
| `pyvulds` | Không pin; xếp dọc pipeline → E1–E4 → Limitations → CTA; reveal đơn giản (§Scene 04.6) | Không pin; pipeline 3×2, evidence 2×2, Limitations full width | Tier A, **không pin nếu `innerHeight < 720`** → layout 768 với reveal Tier A; pin khi đủ cao | **Pin #1** scrub, `+=250%`, letterbox (wireframe 1440) | Pin #1; khung 1440, tile E1–E4 lớn hơn, letterbox giữ tỉ lệ | Không pin; pipeline ngang 6 node (đủ bề rộng), evidence 2×2, Limitations ngay sau |
| `reel` | Stack dọc 3 card (Testeria, HUST SA, AnimalShelter; SRE & Archive tạm thời ẩn khỏi reel, §Scene 05.6) | Hàng ngang native scroll-snap + Prev/Next, peek card (3 card) | Tier A ≥ 1024 & fine: **Pin #2** nếu `innerHeight ≥ 600`, ngược lại hàng ngang native; iPad (coarse): hàng ngang native | **Pin #2** ngang, snap, progress, Prev/Next (3 card, wireframe 1440) | Pin #2; card `min(36vw, 640px)`, track canh theo khung 1440 | Hàng ngang native, card `min(60vw, 420px)`, media 16:9 thu nhỏ để card ≤ 330px cao |
| `field-notes` | 1 dải ngang native + counter + `< >`; nhóm KAIST bên dưới; tap develop (4 frame thật đã chọn) | 1 dải; KAIST dải riêng | Contact sheet 2 dải (Hoi An trip + 3 frame KAIST), hover preview Tier A | Như 1024 (wireframe 1440) | Như 1024, frame lớn hơn, tối đa 4 frame/dải | 1 dải ngang, frame cao ≤ 55vh; lightbox: video fit chiều cao, control bar overlay đáy ≥ 44px |
| `credits` | Role trên / name dưới; 3 bằng chứng floating preview (hover/focus/tap/Esc); 3 học bổng gộp 1 mục | 2 cột căn giữa, floating evidence preview | 2 cột, floating evidence preview, drift watermark (tuỳ chọn) | Như 1024 (wireframe 1440) | Như 1024, cỡ chữ display tăng theo clamp | 2 cột (đủ ngang), không drift |
| `next-scene` | Card 1 cột, CTA full width, footer 1 cột, END OF RUNTIME | Card 2×2, footer 2 cột | Card 4 cột, fade-to-black scrub | Như 1024 (wireframe 1440) | Như 1024, card trong khung 1440 | Card 2×2, footer 2 cột, CTA không full width |

---

# PHẦN 3: CHECKLIST REDUCED-MOTION & A11Y CHO MOTION

### 3.1 Tier C & tôn trọng lựa chọn của người dùng
- [ ] `prefers-reduced-motion: reduce` → `html[data-tier="C"]` (boot script 03a): không Lenis, không pin (`.pin-spacer` count = 0), không scrub/parallax, không SplitText, cold open bỏ qua; chỉ crossfade ≤ 200ms.
- [ ] Toggle "Motion off" trong `⌘K` **và** trong Menu (có thể tìm thấy không cần phím tắt) ép tier → C, lưu `localStorage`, áp dụng ngay không reload (`mm.revert()` + `ScrollTrigger.killAll()` + `lenis.destroy()`).
- [ ] REC dot của HUD không nhấp nháy trong Tier C (thay `animate-pulse` bằng chấm tĩnh); grain không step-animate (02a §8).
- [ ] Không có chuyển động tự chạy > 5 giây song song với nội dung mà thiếu cơ chế dừng (WCAG 2.2.2): light leak chỉ scrub theo cuộn; grain dừng được qua toggle Motion; credits **không** auto-scroll.

### 3.2 Nội dung không phụ thuộc JS
- [ ] Tắt JS: cả 9 scene đọc được đầy đủ ở trạng thái cuối (text opacity 1, SVG vẽ đủ, Limitations hiện, placeholder theo guard). Cold open không hiện (03a `data-boot`).
- [ ] Không phần tử nội dung nào có `opacity: 0` / `clip-path` ẩn trong CSS tĩnh; trạng thái đầu chỉ do `gsap.set` trong `matchMedia`.
- [ ] Runtime nạp khi scene đã trong viewport → không đặt trạng thái đầu cho scene đó (không "nháy ngược").
- [ ] Chunk motion lỗi/timeout → trang vẫn ở trạng thái cuối (test chặn `runtime.ts` bằng Playwright route abort).
- [ ] Biến thể Tier C (bảng PyVulDS, lưới Reel) và biến thể A/B không cùng hiện trong accessibility tree (biến thể ẩn dùng `display: none`).

### 3.3 Focus không bị che (WCAG 2.4.11 Focus Not Obscured)
- [ ] `html { scroll-padding-top: calc(var(--spacing-hud) + 16px); scroll-padding-bottom: calc(var(--spacing-timecode) + 24px); }` — `--spacing-hud` (HUD top) và `--spacing-timecode` (TimecodeHUD) là token của `01-design-system.md` §4.3; `--spacing-timecode` = 0px mặc định, 44px khi `(min-width: 48rem) and (min-height: 501px)` (TimecodeHUD ẩn `< 768` hoặc `max-height: 500px` → 0px).
- [ ] Tab qua toàn trang ở 390, 1440 và phone ngang: không focus ring nào nằm dưới HUD, timecode, letterbox bar, hay grain (grain `pointer-events: none`, z 70 nhưng trong suốt; letterbox bar z thấp hơn HUD và không che vùng focus của CTA).
- [ ] Trong pin (Scene 04/05): focus một phần tử ở beat chưa chạy → scene tua tới beat đó; focus ring hiện đầy đủ trong khung pin.
- [ ] Focus ring `outline: 2px solid var(--grade-amber); outline-offset: 2px` trên mọi control; custom cursor ẩn khi dùng bàn phím (02a §7).

### 3.4 Media & video
- [ ] Mọi video tự chạy (hero, hover preview) có nút Pause/Play hiển thị, `aria-pressed`, nhãn rõ (03a §5.3); Tier C/Save-Data/mạng chậm → poster + Play.
- [ ] Hover preview Scene 06 chỉ Tier A, muted, dừng khi rời hover/viewport; không bao giờ tự chạy trên touch.
- [ ] Lightbox: focus trap, `Esc` đóng, focus trả về trigger, control ≥ 44×44px, captions `.vtt` khi clip có lời, không auto-advance.
- [ ] Không chuyển động nhấp nháy > 3 lần/giây (light leak, grain step 8–12 fps có biên độ opacity ≤ 0.10 — kiểm bằng mắt + PEAT nếu nghi ngờ).

### 3.5 SplitText & ngữ nghĩa
- [ ] SplitText chỉ cho headline < 8 từ: `PyVulDS`, `The Reel`, `Field Notes`, `Credits`, `Next Scene` (02a §4.1). Không split body, logline, Limitations, CTA.
- [ ] Phần tử cha giữ `aria-label` nguyên văn; span con `aria-hidden="true"` (hoặc `aria: true` của SplitText); `.revert()` trong cleanup và khi resize đổi tier.
- [ ] Screen reader (VoiceOver + NVDA) đọc Scene 04 theo thứ tự: tiêu đề → badge → logline → 6 stage → 4 kết quả kèm phạm vi → Limitations → CTA. Chip/bar/ô/dải không được đọc.
- [ ] StatusBadge có text thật (`In production`, `Released`, `Pre-production`), không chỉ dựa vào màu/biểu tượng.
- [ ] Mọi số liệu ở Scene 04–08 là text chọn được; không có số chỉ nằm trong SVG/canvas.

---

# PHẦN 4: CHECKLIST MOTION QA

### 4.1 Hiệu năng khung hình
- [ ] **60 fps trên Android tầm trung** (tham chiếu: Pixel 6a / Galaxy A54, Chrome, profile "Performance" có CPU 4× throttle trên desktop làm proxy): cuộn qua Scene 04 (Tier B), Scene 05 hàng ngang, Scene 06 dải film — không frame > 16.7ms kéo dài > 3 frame liên tiếp (DevTools Performance → Frames).
- [ ] Tier A ở laptop 1440 (iGPU): pin #1 và #2 không có long task > 50ms khi scrub; rack focus chỉ composite (không "Paint" mỗi frame trong Layers panel).
- [ ] Chỉ animate `transform`, `opacity`, `clip-path`, `filter` (filter chỉ trên layer trang trí/media) — kiểm bằng grep `gsap.(to|from|fromTo|set)` trong `*.motion.ts` không có `width|height|top|left|margin|padding`.
- [ ] `will-change` chỉ gắn trong lúc scene active và gỡ khi rời; tổng số layer composite đồng thời ≤ 30 (Layers panel).

### 4.2 Layout ổn định
- [ ] **CLS từ animation = 0**: mọi media có `aspect-ratio`/`width`+`height`; pin-spacer được tính trước khi người dùng tới (refresh sau fonts + media); CLS tổng < 0.05 (03a).
- [ ] Pin-spacer không làm nhảy nội dung khi resize; `invalidateOnRefresh` cho cả 2 pin; resize debounce 200ms và bỏ qua thay đổi chỉ chiều cao do thanh địa chỉ iOS (02a §2.3).
- [ ] **Refresh sau khi media load:** `ScrollTrigger.refresh()` sau `document.fonts.ready`, sau poster hero, sau ảnh A7 đầu/cuối của reel decode, sau poster dải field-notes đầu tiên. Gộp các lời gọi trong 1 rAF (không refresh liên tục).

### 4.3 Nhịp & khả năng ngắt
- [ ] **Interruptible:** mọi tween reveal có thể bị đảo khi người dùng cuộn ngược; tween click (Prev/Next, Back to top, focus-seek) gọi `lenis.scrollTo` mới sẽ huỷ cái cũ; wheel/touch trong lúc `scrollTo` thì người dùng thắng (Lenis `lock: false`).
- [ ] **Exit nhanh hơn enter:** exit = 60–70% enter (master §5.3) — develop 320/200ms, lightbox 320/200ms, letterbox mở/đóng 320/210ms, chuyển trang exit ≤ 250ms / enter 500–800ms (02a §6).
- [ ] Không beat nào chặn tương tác: không `pointer-events: none` trên nội dung trong khi animate; CTA bấm được ngay cả khi đang ở `opacity` < 1.
- [ ] Snap của Pin #2 không "giành" cuộn: `delay: 0.08`, `duration ≤ 0.5`; cuộn trackpad liên tục không bị kéo ngược.

### 4.4 Vòng đời & dọn dẹp
- [ ] **Chuyển route:** rời `/` → `useGSAP` scope revert (kill mọi ScrollTrigger, timeline, SplitText `.revert()`), `lenis.destroy()` nếu layout không còn cần; không còn `.pin-spacer` trên `/work/*` (Playwright count = 0).
- [ ] Quay lại `/` (Back): scroll restoration (02a §6) → `ScrollTrigger.refresh()` **trước**, rồi `lenis.scrollTo(saved, { immediate: true })`; pin #2 ở đúng card đã rời.
- [ ] Flip (Scene 05): `getState` trước khi kill ScrollTrigger reel; không có "bóng ma" card kẹt trên trang đích.
- [ ] Đổi tier khi đang xem (xoay iPad, bật reduced-motion, kéo cửa sổ qua 1024px) → `gsap.matchMedia` revert sạch, nội dung về trạng thái cuối, không double-init (kiểm `ScrollTrigger.getAll().length` trước/sau).
- [ ] Không rò bộ nhớ: lặp `/` → `/work/pyvulds` → back 10 lần, heap snapshot không tăng tuyến tính; số listener `scroll`/`resize` ổn định.

### 4.5 Media
- [ ] **Pause video offscreen:** mọi video (hero, preview, lightbox khi đóng) `paused === true` khi rời viewport / tab ẩn (`visibilitychange`); tối đa 1 video ngoài hero chạy cùng lúc (03a).
- [ ] Video dưới fold `preload="none"`; mở Scene 06 trên 4G không tải video nào cho tới khi hover (Tier A) hoặc bấm Play.
- [ ] Đóng lightbox → video `pause()` + gỡ `src` nếu là clip tự host dài, giải phóng decoder trên mobile.

### 4.6 Ma trận kiểm tra tối thiểu trước mỗi mốc P2/P3
| Thiết bị / chế độ | Scene trọng điểm | Tiêu chí pass |
|---|---|---|
| Chrome desktop 1440×900, Tier A | 04, 05 | 2 pin chạy, focus-seek đúng, 60 fps, Limitations luôn trong khung khi có số liệu |
| Safari macOS 1440, Tier A | 04, 06 | Rack focus không flicker; `filter` develop mượt; Lenis không giật khi pin |
| iPhone Safari 390 + xoay ngang | 04, 05, 06 | Không pin, scroll native, lightbox control ≥ 44px, xoay không chặn và không vỡ layout |
| Android tầm trung Chrome 390 | 04, 06 | 60 fps, không video tự tải, develop bằng tap |
| iPad 1024 ngang (coarse) | 05 | Tier B: hàng ngang native + Prev/Next, không Pin #2 |
| Bất kỳ + reduced-motion | Tất cả | Tier C: bảng PyVulDS, lưới Reel, frame đã develop, không pin/Lenis |
| Tắt JS | Tất cả | Đọc được đầy đủ trạng thái cuối |

---

## Ghi chú cho orchestrator

1. Đã xử lý: master chốt slate `SCENE 04 · TAKE 01 · FEATURE PRESENTATION`, title `PyVulDS` tách riêng.
2. Đã xử lý: master chốt guard chiều cao — Pin #1 (`pyvulds`) chỉ khi `min-height: 720px`, Pin #2 (`reel`) chỉ khi `min-height: 600px`.
3. Đã xử lý: master §5.3 chốt TimecodeHUD ẩn khi `max-height: 500px`.
4. Đã xử lý: master §5.3 chốt timecode cập nhật theo scroll (rAF-throttled), REC không nhấp nháy ở Tier C, `html[data-active-scene]` là nguồn chung cho grain/grade/timecode.
5. Đã xử lý: 03a §9.3 cập nhật test bàn phím theo 2 control riêng (`Develop` + `Play`).
6. **Odometer:** Scene 05 hiển thị `70%` **tĩnh** (đã odometer ở Scene 03, tránh lặp). PyVulDS không dùng odometer vì 03b giới hạn `<OdometerMetric>` cho `70%` và `3`; precision 0.105→1.000 chỉ animate bar trang trí, số là text tĩnh.
7. Đã xử lý: 03b đưa kênh liên hệ công khai đã duyệt (master câu 1) và xác nhận Selfomy "present" vào DoD làm launch blocker.
8. **AnimalShelter & The Reel omissions:** AnimalShelter sử dụng production capture (`/media/work/animalshelter.png`) trong khi giữ trọn vẹn ngữ cảnh giải thưởng (`Second Prize — Future Blue Innovation 2022`). Reel hiển thị đúng 3 card (`Testeria`, `HUST Smart Assistant`, `AnimalShelter`, counter `01 / 03`). Card SRE (`sre-release-automation`) và Card Archive được tạm thời ẩn khỏi reel view nhưng được bảo lưu đầy đủ trong source code và routes (`/work/sre-release-automation`, `/archive`).
9. **KAIST copy:** chỉ nói "completed in person, Daejeon and Seoul" + câu bắc cầu "preparing for a research-intensive master's" (profile §2 mục 4, §9). Không nêu lab/giáo sư/kết quả. Tên KAIST GPW chỉ publish sau xác nhận A10.
10. **Direction cards:** chỉ tiêu đề + badge, không mô tả. Nếu thêm dòng mô tả, phải qua buổi claim review (master §7: kế hoạch, không được trình bày như đã làm).
