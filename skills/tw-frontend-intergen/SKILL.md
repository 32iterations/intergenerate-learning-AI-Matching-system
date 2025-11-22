name tw-frontend-intergen
description Tailored frontend design for the Hsinchu 赤土崎多功能館 “intergenerational AI matching” demo page.
license MIT

---

## When this skill should be used

Use this skill whenever the user asks you to:

- 改善 / 重構 `frontend/` 裡的 HTML、CSS 或 JS
- 設計新的區塊（例如 FAQ、儀表板、活動牆）給隔代共學系統
- 美化 Demo 頁給評審或市府簡報使用

The goal is to create a **distinctive, production-ready landing page** for:

> 「隔代共學 AI 媒合系統」@ 新竹市赤土崎多功能館

Avoid generic “AI slop” UI (Inter +紫色漸層 + 無聊卡片)。產出的程式碼應該像是人類前端工程師為一個在地社福專案量身打造的介面。

---

## Brand & context

- Location: **新竹市東區・赤土崎多功能館**（海邊、科技城、在地社福）
- Users:
  - 工作中、需要托育與陪伴支援的父母
  - 有能力主動參與的長者（不只是被照顧者）
  - 館方 / 社工 / 市府單位
- Product: AI 媒合平台 → 真實在館內發生的 **隔代共學活動**

Tone:

- 溫暖、穩重、專業，而不是炫技或過度科技感
- 讓人覺得「這是可以真的導入市府 / 館舍的系統」

---

## Typography

When authoring HTML/CSS:

- Use a Chinese-friendly sans-serif stack:

  ```css
  font-family: "Noto Sans TC", system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", sans-serif;
  ```

- Headings:
  - H1/H2: slightly tighter letter-spacing, strong but not huge
  - Use sentence-case in English; avoid ALL CAPS except small labels
- Body:
  - Aim for line-height ~1.7–1.9 for paragraphs in Chinese
  - Prefer shorter paragraphs and bullets over dense walls of text

Avoid:

- Default “Inter + purple gradient” combo
- Arial / Times / overly generic system fonts as main brand font

---

## Color & theme

Use the color tokens already defined in `frontend/styles.css`:

- `--color-bg` / `--color-surface` / `--color-surface-soft`
- `--color-primary` (暖橘、夕陽)
- `--color-accent` (藍綠、海風 + 科技)
- `--color-text` / `--color-text-muted`

Guidelines:

- Background: deep navy / night-sky gradient with subtle radial glow
- Primary actions (CTA buttons):
  - Use the warm orange → teal gradient (`btn-primary` style)
  - Keep text dark on light button for readability
- Accent:
  - Use teal sparingly to highlight “AI 媒合”或重要數字
- Borders:
  - Use semi-transparent white/blue borders to give a glassy, civic-tech feel

Never introduce an entirely new wild color palette unless explicitly requested.
If you must add a color, define a new CSS variable and document it.

---

## Layout & composition

- Use a **single-column max-width layout** (`max-width: 1120px`) centered on desktop.
- Sections you should preserve / build around:
  - Hero：一句話講清楚 + 右側 3D / 圖示卡片
  - Flow：4 個步驟，從「需求」到「在赤土崎館落地」
  - Gallery：依據目前頁面內容自動配圖的區塊
  - Pitch Coach：Gemini 3 Pro 協助整理 Pitch 的區塊
- Spacing:
  - Section vertical padding: ~48–72px
  - Use consistent gaps (8/12/16/24px) rather than random values
- Cards:
  - Rounded corners (`18–24px`)
  - Subtle inner padding
  - One-line labels + short descriptions
  - Do not overload a single card with multiple nested lists

On mobile:

- Stack columns into a single column
- Ensure buttons are at least 44px tall, easy to tap
- Hero text should not exceed 2–3 lines on narrow screens

---

## Motion & interaction

Use motion sparingly and purposefully:

- Prefer small transitions:
  - `transform: translateY(-1px)` on hover
  - `box-shadow` intensity changes for important cards
- Duration: 150–240ms, ease-out
- Avoid:
  - Full-page parallax scroll
  - Flashy animations that distract from story

If using 3D / animation:

- `spline-viewer`:
  - Treat as a window into the 赤土崎館場景
  - Keep surrounding card clean, avoid competing gradients
- Rive / CSS animation:
  - Ideal for a small “家庭 → AI 雲 → 館舍 → 長者 & 孩子” flow icon
  - Loop should be calm and slow, not bouncing aggressively

---

## Imagery & the image search API

The frontend uses:

- `GET /api/images?q=...` → returns `{ images: [...] }`
- Each image has: `id`, `url`, `alt`, `photographer`, `photographer_url`

When writing or modifying code that displays images:

- Always show attribution, e.g. `Photo: {photographer} / Pexels`
- Prefer alt text in zh-Hant, describing what a **screen reader** would need:
  - Example: `「一位長者在社區空間陪伴兩個小學生畫圖」`
- Try to bias queries toward East Asian / Taiwanese context with keywords like:
  - `Taiwan`, `Hsinchu`, `Asian grandparents`, `community center`, `family`

Do **not** hardcode real photos directly into the HTML; instead, rely on JS to
pull results from the API and render cards.

---

## Accessibility & i18n

When editing `frontend/index.html` or creating new components:

- Keep `lang="zh-Hant-TW"` on `<html>` unless the entire page is English.
- Ensure text contrast is sufficient (light text on dark surface).
- Use semantic elements (`<section>`, `<nav>`, `<main>`, `<footer>`) and headings.
- Keep important information in text, not only in images or 3D scenes.
- When adding English copy, keep it simple enough for non-native speakers.

---

## File-specific guidance

### `frontend/index.html`

- Keep sections in this order unless the user explicitly wants changes:
  1. Hero
  2. Flow
  3. Gallery
  4. Pitch Coach
- Hero:
  - Single, strong H1 that explains **who is helped and where**.
  - One short paragraph for emotional framing.
  - 2–4 chips (`.pill`) summarizing key concepts.
  - Right side should remain a visual focus area (3D / map / stat card).
- Flow:
  - Use exactly four steps unless requirements change.
  - Each step = short title + 2–3 lines body; avoid long paragraphs.
- Gallery:
  - Keep `#image-grid` as the only place images are rendered.
- Pitch Coach:
  - Do not remove the textarea and output card; styling can change, but layout
    should clearly show “輸入 → AI 整理過的輸出”。

### `frontend/styles.css`

- When adding new components, reuse these concepts:
  - `container` for max-width alignment
  - `section` for vertical rhythm
  - `btn`, `btn-primary`, `btn-secondary`, `btn-ghost` for buttons
- If defining new utilities, keep names descriptive and short (e.g. `.chips-row`,
  `.stat-pill`, `.timeline`).

---

## How Claude should think when using this skill

1. 先問自己：「這個介面是否能在黑客松現場說服評審？」
2. 檢查：
    - Hero 是否一眼看出**服務對象＋場域**？
    - Flow 是否用四個步驟清楚說明？（不要再多）
    - 是否有足夠的留白與層次，讓人願意多看兩眼？
3. 調整：
    - 如果介面看起來像 generic SaaS landing page，就替換配色與字體，靠近本 Skill 的風格。
    - 如果文本太抽象，改成更貼近「家庭、長者、社工」的語句。
4. 最後檢查：
    - 截圖此頁時，是否能在 3 秒內說出：「這是在做什麼？為誰？」  
      如果不行，優先調整 Hero 文案與佈局，而不是先微調細節。

遵守這些原則，讓這個 DEMO 看起來像一個真正可以進赤土崎多功能館上線的產品。
