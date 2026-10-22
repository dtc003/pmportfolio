# Implementation Plan

- [x] 1. Pure helpers and unit tests
- [x] 1.1 Write failing `node --test` tests for `pickFocused`, `formatCount`, `tween`, `linkedIds`, `describeNode`, `pctIncrease`, and the Sandbox/Ballard data guards
  - _Requirements: 3.5, 6.4, 7.1, 8.2, 8.4_
- [x] 1.2 Implement the helpers in `public/assets/js/storyline.js` (Node-exportable block) until tests pass
  - _Requirements: 3.5, 6.4, 8.2_

- [x] 2. Assets
- [x] 2.1 Download licensed assets to `public/assets/img/storyline/` using the naming contract; record each in `storyline-attribution.txt`
  - _Requirements: 13.1, 13.5_
- [x] 2.2 Placeholder and logo-wordmark fallback for missing files
  - _Requirements: 13.2, 13.3, 13.4_

- [x] 3. Storyline markup in `index.html`
- [x] 3.1 Container, heading, `html.js` bootstrap, end CTA
  - _Requirements: 1.1, 1.2, 1.5, 15.3_
- [x] 3.2 Chapters 1–4 (AI Foundry, Innosight with org chart, Sandbox, Ballard) with SVG visuals and text equivalents
  - _Requirements: 2.1–2.5, 5, 6, 7, 8, 15.1, 15.2_
- [x] 3.3 Chapters 5–8 (Creamies, Mock Trial, Brazil, Origin) with SVG visuals and text equivalents
  - _Requirements: 2.1–2.5, 9, 10, 11, 12, 15.1, 15.2_

- [x] 4. Styles in `public/assets/css/storyline.css`
- [x] 4.1 Chapter grid, responsive breakpoints, panels, typography
  - _Requirements: 1.6, 14.1–14.3, 16.5_
- [x] 4.2 Focus color filters, reveal pre-states, reduced-motion overrides
  - _Requirements: 3.1–3.6, 4.1–4.3_

- [x] 5. Behavior in `storyline.js`
- [x] 5.1 Focus observer and reveal observer (play once), counters, static fallback
  - _Requirements: 3.2, 3.3, 4.1–4.4_
- [x] 5.2 Org chart interaction (hover, focus, click, keyboard, live region)
  - _Requirements: 6.3–6.6, 15.5_
- [x] 5.3 Image error → placeholder wiring
  - _Requirements: 13.2_

- [x] 6. Browser checks
- [x] 6.1 Write `tests/storyline.browser-check.js` and run it at 320–1280px widths, with reduced motion, and with a longtask observer during scroll
  - _Requirements: 1.4, 3.5, 4.3, 14.3, 14.4, 15.1–15.5, 16.2_
