# Design System — Dallin Christensen Portfolio (pmportfolio)

## Product Context
- **What this is:** A personal portfolio site — landing page, portfolio (experience/skills/projects), and blog.
- **Who it's for:** Recruiters, hiring managers, and professional network viewing Dallin's work.
- **Space/industry:** Product management / early-career tech & business professional.
- **Project type:** Marketing/personal site (static, multi-page).
- **Memorable thing:** Ambitious, big-vision thinker — the SpaceX-style ambition itself is the message.

## Aesthetic Direction
- **Direction:** Industrial/Utilitarian, SpaceX-inspired — engineering precision over startup polish.
- **Decoration level:** Minimal — typography, negative space, and one hero visual (Earth) do all the work.
- **Mood:** Serious, precise, ambitious. Cold and confident rather than warm and friendly. The visual register of an aerospace engineering brief, not a SaaS landing page.
- **Reference sites:** https://www.spacex.com/ (studied directly — headline typography, button treatment, spacing, full-bleed cinematic imagery, near-black palette).

## Typography
- **Display/Hero:** Overpass, weight 800 (ExtraBold)/900 (Black), uppercase, letter-spacing +0.02em to +0.04em — derived from Highway Gothic (US road-sign engineering type), the same design lineage as SpaceX's proprietary D-DIN. Free, open-source, and not on the overused-fonts list (unlike the site's previous Space Grotesk).
- **Body:** Overpass, weight 400/500, sentence case — same family as display for a single coherent voice (mirrors SpaceX's one-font-family system), legible at paragraph length unlike more condensed alternatives.
- **UI/Labels/Nav:** Overpass, weight 600, uppercase, tracked +0.08em — small nav links, section eyebrows, tags.
- **Data/Dates/Tags:** Overpass Mono — dates ("Jan 2025 – Apr 2025"), tag pills, footer meta. Adds a "telemetry readout" technical texture.
- **Code:** Not applicable (no code samples on this site).
- **Loading:** Google Fonts — `Overpass:wght@400;500;600;700;800;900` + `Overpass+Mono:wght@400;600`.
- **Scale:** Hero h1 clamp(2.8rem, 6vw, 5rem) / Page h1 clamp(2.2rem, 4.5vw, 3rem) / Section h2 1.5–2rem / Body 1rem–1.1rem / Small/labels 0.75–0.85rem, tracked.

## Color
- **Approach:** Restrained — one hero visual carries all color; UI stays monochrome.
- **Background:** `#030304` (near-black, not pure #000 to keep the starfield canvas subtly alive).
- **Surface/panel:** `rgba(255,255,255,0.045)` fill, `rgba(255,255,255,0.10)` border — unchanged glass-panel approach, still coherent with a darker base.
- **Text primary:** `#F4F5FA`
- **Text dim:** `#9AA0B4`
- **Text faint:** `#5B6078`
- **Accent:** None as a UI color. The Earth hero visual (blues/whites/greens of real Blue Marble imagery) is the only color on the page. Buttons and links are monochrome (white/gray), inverting to filled-white-on-black on hover/focus.
- **Semantic (used sparingly, e.g. form/link states only):** success `#3DD68C`, warning `#E8B339`, error `#E85D4A`, info `#6FA8E8` — desaturated, used only if a functional need arises (currently none on this static site).
- **Dark mode:** This is a dark-only system by design (matches SpaceX, matches the starfield concept) — no light mode variant.

## Spacing
- **Base unit:** 8px.
- **Density:** Comfortable-to-spacious — full-bleed cinematic section blocks with generous vertical rhythm, echoing SpaceX's full-viewport sections.
- **Scale:** 2xs(2) xs(4) sm(8) md(16) lg(24) xl(32) 2xl(48) 3xl(64) 4xl(96).

## Layout
- **Approach:** Grid-disciplined content columns inside full-bleed cinematic section blocks.
- **Grid:** Single-column content, max-width container, sections stack full-height/full-bleed on the landing hero.
- **Max content width:** 1080px (unchanged).
- **Border radius:** Sharp/precise — buttons 4px (exact SpaceX match), cards/panels 8–12px max, no fully-rounded pill shapes anywhere. This is a deliberate departure from the site's previous fully-rounded (999px) buttons.

## Motion
- **Approach:** Minimal-functional. The interactive starfield (twinkling stars, shooting stars, mouse parallax) stays — it's the one place expressive motion is earned. Everything else (buttons, nav, links) uses short, crisp, purely functional transitions.
- **Easing:** enter `ease-out`, exit `ease-in`, move `ease-in-out`.
- **Duration:** micro 100ms, short 200ms, medium 300ms. No bounce/spring easing anywhere.

## Hero Visual — Earth
- Single large sphere, real NASA Blue Marble-derived texture (public domain), not a flat gradient circle.
- Positioned large and cropped off-frame (top-right on desktop), mirroring SpaceX's Mars treatment — scale communicates ambition.
- Slow autonomous rotation + subtle mouse-parallax drift, soft atmospheric rim-light glow.
- All other planets (the two smaller ones + moon) are removed — one hero body only.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-09-11 | Replaced Space Grotesk + Inter with Overpass + Overpass Mono | Prior pairing is on gstack's overused-font list; Overpass shares D-DIN's engineering-signage lineage (SpaceX reference) and is free. |
| 2026-09-11 | Removed purple/blue gradient accent and pill-shaped buttons | Both are flagged AI-slop anti-patterns; replaced with monochrome UI + sharp 4px corners to match SpaceX exactly. |
| 2026-09-11 | Cut 3 planets down to 1 large Earth hero visual | User request, modeled on SpaceX's single large Mars hero image; concentrates visual weight into one high-fidelity element instead of three small ones. |
| 2026-09-11 | Kept dark-only palette, no light mode | Matches SpaceX reference and the starfield concept; site has no functional need for a light mode. |
