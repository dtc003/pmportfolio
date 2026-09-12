# Design System — Dallin Christensen Portfolio (pmportfolio)

## Product Context
- **What this is:** A personal portfolio site — landing page, portfolio (experience/skills/projects), and essays (blog, retitled).
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
- **Approach:** Grid-disciplined content columns inside full-bleed cinematic section blocks. Landing hero specifically uses a SpaceX-style split layout: left-aligned text column (headline/subhead/single CTA), hero visual (Earth) on the right.
- **Grid:** Single-column content, max-width container, sections stack full-height/full-bleed on the landing hero.
- **Max content width:** 1080px (unchanged); hero text column capped at `min(430px, 42vw)` on desktop so it never runs into the Earth, but reverts to full width below 640px (the Earth relocates to a corner there and no longer needs the clearance). Flex items need explicit `min-width: 0` here — the default `min-width: auto` on a flex child otherwise refuses to shrink below the widest word and overflows the viewport.
- **Border radius:** Sharp/precise — buttons 4px (exact SpaceX match), cards/panels 8–12px max, no fully-rounded pill shapes anywhere. This is a deliberate departure from the site's previous fully-rounded (999px) buttons.

## Motion
- **Approach:** Minimal-functional. The interactive starfield (twinkling stars, shooting stars, mouse parallax) stays — it's the one place expressive motion is earned. Stars are kept small and sparse (not a dense field) so they read as ambient texture, not noise. Everything else (buttons, nav, links) uses short, crisp, purely functional transitions.
- **Easing:** enter `ease-out`, exit `ease-in`, move `ease-in-out`.
- **Duration:** micro 100ms, short 200ms, medium 300ms. No bounce/spring easing anywhere.

## Hero Visual — Earth
- Single large sphere, built from three real NASA public-domain textures at 2048px source resolution (crisp even at the current larger render size), not a flat gradient circle: day (Blue Marble land_shallow_topo), night city lights (Black Marble / Earth at Night 2012), and a cloud-fraction composite. Rendered via arcsine-column spherical projection (not a flat pasted rectangle) so the limb genuinely foreshortens.
- Size: `EARTH_SCALE = 1.6` multiplier on top of the base responsive formula (desktop base `min(width*0.3, height*0.55)`, clamped 280–640px diameter). Desktop diameter is further capped by the actual measured width of `.hero-content` (see Layout) so it can grow large on wide screens without ever colliding with the text at medium widths.
- Positioned fully on-screen on the right side of the landing hero, vertically centered in the hero's viewport height (desktop) — not cropped off-frame, per explicit user preference (differs from SpaceX's own edge-cropped Mars). On narrow viewports (<640px) it moves to the bottom-right corner, its top edge pinned below the measured bottom of `.hero-actions` (the Explore button) so it can be large without covering interactive elements.
- Continuous rotation (~0.88°/220ms, full rotation ~90s — same effective speed as an earlier 0.18°/45ms tuning, just recomputed less often; see Performance) + subtle mouse-parallax drift, soft atmospheric rim-light glow (positioned left, matching the vertical terminator below).
- Day/night terminator: a **vertical** axis (light left, dark right — not diagonal), matching how the real spacex.com Mars phase reads, with a **gradual** fade across a wide band (`size*0.2` to `size*0.8`, multi-stop gradient) — not a hard binary edge. An earlier version narrowed this band down to ~8% of the width for a "sharper" look per an earlier request, which then read as an abrupt cliff rather than the soft graduated shadow the real Mars phase actually has; widened back out to fix that. All three layers (day darkening, night-light mask, cloud fade) share one `verticalAxisGradient` helper so the boundary lines up exactly across layers.
- Night lights: the Black Marble texture with `contrast(2.4) saturate(1.4) brightness(1.05)` — high contrast with no brightness lift, so the ocean's faint blue tint crushes to true black while city lights still pop. (An earlier brightness-led filter left the night ocean a washed-out blue instead of black — contrast-led crushing was the fix.) Composited with 'screen', **after** the terminator darkening — compositing lights before darkening lets the darkening overlay crush them back down; darken first, then screen the lights on top.
- Clouds: the grayscale cloud-fraction composite, 'screen' blended, faded to near-zero opacity (0.04) on the night side — the night hemisphere should read as "just the lights," not lit cloud haze.
- Only rendered on pages with a `.hero` element (landing page) — the canvas is `position: fixed`, so drawing it site-wide previously caused it to overlap scrolled content on the Portfolio page. Do not re-enable it globally without also solving that overlap.
- All other planets (the two smaller ones + moon) are removed — one hero body only.
- Texture assets live in `public/assets/img/` (`earth.jpg`, `earth-night.jpg`, `earth-clouds.jpg`) with sources noted in `earth-attribution.txt`.

## Performance
- The Earth is a *live* per-frame canvas composite (three-layer projection + gradients), not a video — real spacex.com was inspected directly and its "Mars" is a pre-rendered `.mp4` with a poster image, which is why it costs nothing at runtime. We can't pre-render video, so the equivalent principle applied here: do the expensive part (the per-column projection) at a fixed, capped internal resolution (`sphereSize`, capped at 480px regardless of display size or DPR) and let `drawImage` upscale that to the actual display diameter — cheap GPU bitmap scaling — rather than compositing at full display resolution every tick.
- The rotation recompute (the actual cost driver, not the 60fps draw loop) runs on its own throttled interval, not every animation frame: every 220ms in 0.88° steps. A prior tuning pass had this at every 45ms in 0.18° steps (same effective speed) to fix visible stepping in the rotation — that made it smooth but was also the direct cause of a later "the site keeps freezing" report, since it meant ~22 full three-layer recomputes per second. If rotation ever needs to look smoother again, prefer widening the internal frame budget (e.g. precomputing a fixed set of rotation frames once, ahead of time) over shortening this interval — shortening it is what caused the regression.
- Verified via `PerformanceObserver({entryTypes:['longtask']})`: zero long tasks (>50ms) over a 5s sample after this fix, versus the prior setup which was heavy enough to visibly lag.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-09-11 | Replaced Space Grotesk + Inter with Overpass + Overpass Mono | Prior pairing is on gstack's overused-font list; Overpass shares D-DIN's engineering-signage lineage (SpaceX reference) and is free. |
| 2026-09-11 | Removed purple/blue gradient accent and pill-shaped buttons | Both are flagged AI-slop anti-patterns; replaced with monochrome UI + sharp 4px corners to match SpaceX exactly. |
| 2026-09-11 | Cut 3 planets down to 1 large Earth hero visual | User request, modeled on SpaceX's single large Mars hero image; concentrates visual weight into one high-fidelity element instead of three small ones. |
| 2026-09-11 | Kept dark-only palette, no light mode | Matches SpaceX reference and the starfield concept; site has no functional need for a light mode. |
| 2026-09-11 | Landing hero rebuilt left-aligned (headline/subhead/single "Explore" CTA), Earth moved fully on-screen to the right | User request to mirror the actual SpaceX homepage split layout more closely; dropped the eyebrow line and second CTA button, and the hero social-icon row (LinkedIn/X remain reachable via nav + footer). |
| 2026-09-11 | Earth gated to `.hero`-bearing pages only, with scroll-relative vertical offset | Fixed a real bug: the fixed-position canvas kept the Earth pinned on-screen while scrolling the Portfolio page, overlapping project/experience cards. |
| 2026-09-11 | Sphere rotation updates every 45ms in 0.18° steps (was every 1800ms in 2.2° jumps) | Prior interval produced visibly jerky, discrete jumps; frequent small increments read as smooth continuous rotation. |
| 2026-09-11 | Star field made smaller and sparser (radius ~0.35–1.7px, ~1 star per 4500px²; was ~0.5–2.6px, 1 per 2600px²) | User request — stars were too large/dense relative to the more restrained, precise SpaceX-inspired mood. |
| 2026-09-11 | Renamed "Blog" to "Essays" sitewide, including the URL (`/blog` → `/essays`) | User request to retitle the section; changed both the label and the route for consistency rather than leaving them mismatched. |
| 2026-09-11 | Added realistic day/night terminator, NASA night-lights, and cloud layer to the Earth hero | User request to make the Earth "look more realistic" like SpaceX's Mars. Required reordering the compositing pipeline (darken before adding lights, not after) to avoid the darkening overlay crushing the lights back to black. |
| 2026-09-11 | Moved LinkedIn/X/Email into the nav (all three), removed the footer social row entirely | User request — same links were duplicated in both header and footer; now they live only in the header. |
| 2026-09-11 | Hero text column narrowed and made responsive (`min(430px, 42vw)` on desktop, full width below 640px) with explicit `min-width: 0` | Fixed two bugs found via testing: text overlapping the Earth on desktop, and "CHRISTENSEN" overflowing off-screen on mobile from the flexbox min-width-auto trap. |
| 2026-09-11 | Hero breaks out of the shared centered `.container` (1080px max-width) — now full-width with left padding `clamp(24px, 8vw, 140px)`, text column widened to a flat 600px | Side-by-side comparison with the real SpaceX homepage showed the name sitting too close to center on wide screens (the shared centered container was the cause) and "CHRISTENSEN" wrapping mid-word (430px was too narrow at the max 4rem font size). Only the hero opts out of the shared container; every other section keeps it. |
| 2026-09-11 | Terminator shadow sharpened to a hard-edged line (transition band ~4% of the diagonal, full opacity black) | Side-by-side with SpaceX's Mars showed their shadow as a crisp line, not a soft fade; night-lights/cloud fade masks tightened to match the same boundary. |
| 2026-09-11 | Terminator changed from diagonal to a straight vertical line; night side made much darker (near-pure-black, only lights show) via contrast-led night filter; Earth scaled 1.6x with size/position now measured against the real DOM (`.hero-content` on desktop, `.hero-actions` on mobile) instead of fixed formulas; source textures upgraded from 1024px to 2048px | User feedback after a live side-by-side: SpaceX's terminator reads as vertical not diagonal, their night side shows "basically just the lights," and the Earth should be bigger. Fixed-formula sizing broke down at 1.6x at common laptop widths (e.g. 1200×800) where the text and a fully-on-screen Earth mathematically couldn't both fit — measuring the actual rendered elements at runtime resolves this at any viewport/font combination instead of hand-tuning more magic numbers. |
| 2026-09-11 | Shooting stars: frequency halved (delay 3.5–8s → 7–16s), spawn-origin and trajectory-angle spread doubled | User request for a calmer, more varied ambient effect. |
| 2026-09-11 | Terminator widened back out to a gradual multi-stop fade (`size*0.2`–`size*0.8`) after the previous hard-edge pass | The prior "sharpen it" request had overshot into a near-binary cliff; a live comparison against spacex.com showed their Mars shadow is actually a soft gradual fade, just along a vertical (not diagonal) axis — kept the vertical axis, restored the gradualness. |
| 2026-09-11 | Earth internal render resolution (`sphereSize`) capped at 480px regardless of display size/DPR, upscaled via `drawImage`; rotation recompute interval widened from 45ms to 220ms (angle increment scaled up to match, same effective rotation speed) | Root-caused a "site keeps freezing" report: inspecting spacex.com directly showed their Mars is a pre-rendered video, not a live render, so it costs nothing at runtime — our three-layer per-column projection recomputing ~22 times/sec at up to 1280px internal resolution was the actual cost driver. Capping internal resolution and throttling the recompute (same principle as SpaceX's "compute once, play back cheaply," adapted for a canvas we can't pre-render as video) brought long-task count from a noticeable amount down to zero over a 5s sample. |
| 2026-09-11 | Favicon changed from a sparkle emoji data-URI to a hand-built pixel-art rocket, saved as a real static file (`public/assets/img/favicon-rocket.svg`) referenced identically from all four pages | User request for a "pixelated rocketship." Built as a grid of `<rect>` elements (not an emoji or photo) so it's genuinely blocky/retro at any size, and moved to a shared static file instead of a duplicated inline data URI per page for cacheability. |
| 2026-09-12 | `frame()` draw order changed to stars → Earth → shooting stars (was Earth → stars → shooting stars) | Bug: stars were drawing on top of the opaque Earth sphere, showing through it. Canvas has no z-index — later draws always paint over earlier ones — so the Earth (meant to occlude stars behind it) has to draw after them, not before. |
