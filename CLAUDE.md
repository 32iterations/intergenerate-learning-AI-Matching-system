You are Claude working *inside* a hackathon repo for:

> 「隔代共學 AI 媒合系統」@ 新竹市赤土崎多功能館

The goal is to win a local civic / gov hackathon by showing:
- A visually strong, story-driven demo page
- Clear value for families, elders, and the city government
- Real working AI (Gemini 3 Pro) and image search

## Project layout

- `frontend/`
  - Static HTML/CSS/JS landing page
  - Integrates:
    - Puter.js + Gemini 3 Pro (`puter.ai.chat`) for a "Pitch Coach" section
    - Optional Spline 3D embed for the 赤土崎館 building
    - Optional Rive / lightweight CSS animation for value-flow
    - A contextual image gallery fed by `/api/images`
- `server/`
  - Node + TypeScript project
  - Exposes:
    - `/api/images` — HTTP JSON endpoint that calls the Pexels API
    - `/mcp` — MCP HTTP endpoint exposing `search_images` for Claude
- `skills/tw-frontend-intergen/`
  - A Claude Skill (SKILL.md) with localized frontend design guidance
  - Focuses on Taiwanese typography, color, and layout patterns suitable
    for social welfare / civic-tech projects

## How you should behave in this repo

### General

- Assume this is a live competition setting: prioritize **clarity, robustness, and demoability** over over-abstracted architecture.
- Prefer **small, composable components** and simple file structures rather than heavy frameworks.
- Keep comments bilingual when helpful (`zh-Hant` primary, short English gloss).

### Frontend (`frontend/`)

- Keep HTML semantic and minimal: clear sections for Hero, Value Flow, Gallery, and Pitch Coach.
- Use the CSS variables and tokens defined in `styles.css` instead of hardcoding new colors.
- Typography:
  - Default body font should be a Traditional Chinese–friendly family (e.g. Noto Sans TC).
  - Avoid generic "AI UI" patterns (purple gradient, Inter everywhere, huge rounded cards) unless they truly fit.
- Layout:
  - Maintain a max-width content column and generous spacing; avoid overly cramped layouts.
  - Make sure the layout is responsive for:
    - Phone (~360–480px width)
    - Tablet (~768px)
    - Desktop (≥ 1024px)
- Localization:
  - Main copy in Traditional Chinese; keep key CTAs short and action-oriented.
  - When inserting dummy text, prefer realistic Taiwanese context (families, caregiving, Hsinchu, 赤土崎館).

### Image integration

- Do **not** hardcode long lists of stock-image URLs directly in the HTML.
- Instead:
  - Rely on the `/api/images` endpoint in `server/` (see `main.js`).
  - When adjusting JS image handling, preserve attribution text like:
    - `Photo: {photographer} / Pexels`
- When you need new imagery behavior, update `server/src/server.ts` so both:
  - The HTTP API (`/api/images`)
  - The MCP tool (`search_images`)
  share a single implementation.

### Server (`server/`)

- Use TypeScript and follow the existing setup:
  - `@modelcontextprotocol/sdk` + `express` + `zod`
- Keep all image provider logic in a small helper inside `server.ts` (or a separate util file if you create one).
- Never hardcode secrets:
  - Read `PEXELS_API_KEY` from environment variables.
  - If the key is missing, fail with a clear, human-readable error message.
- MCP:
  - The MCP server is available via HTTP at `/mcp` using `StreamableHTTPServerTransport`.
  - It exposes a `search_images` tool that returns structured JSON with a list of images.
  - When you extend tools, keep input/output schemas explicit and documented.

### Claude Skills

- When the user is asking for UI / layout / CSS help:
  - Prefer to activate or follow the guidance in the `tw-frontend-intergen` Skill.
  - That Skill contains:
    - A color palette inspired by Hsinchu seaside + community space
    - Typography guidance for TW audiences
    - Rules of thumb for motion, spacing, and accessibility
- Avoid duplicating full design systems inside `CLAUDE.md`; keep detailed design rules in the Skill.

### Hackathon storytelling

When generating copy, code comments, or diagrams, emphasize:

- **Who is helped**:
  - Working parents needing reliable care
  - Independent elders wanting purpose and companionship
  - City government and 赤土崎多功能館 staff balancing limited manpower
- **What AI does**:
  - Matches needs & availability across generations and services
  - Helps planners understand real usage patterns (not just one-off bookings)
- **Why 赤土崎館**:
  - A physical hub where digital matching becomes real-world encounters.

Keep the code clean enough that judges can skim the repo and immediately see:
- clear structure,
- sensible naming,
- and how each file maps to a part of the user journey.
