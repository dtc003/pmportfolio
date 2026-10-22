# Website To-Do

What's left to finish the site. Check items off as they ship.

## 1. Homepage career storyline (in progress)

Scroll down from the Earth hero and, still over the starfield, move through a visual story of each role.

Decided so far:
- [x] Chapters (8): AI Foundry, Innosight, Sandbox, Ballard Center, Creamies, BYU Mock Trial, Brazil mission, Presidential Scholar
- [x] Order: newest → oldest (AI Foundry first)
- [x] Visual color: monochrome logos and grayscale photos that warm to full color as each chapter scrolls into focus
- [x] Client work (Innosight FFRDC, AI Foundry data center client): stylized recreations with no client names

- [x] Visuals for each chapter:
  - **AI Foundry:** AI Foundry/BYU mark beside the Claude/Anthropic mark ("first university in the Claude partner network"); animated automation flow diagram (trigger → AI step → output) for an unnamed data center cooling provider
  - **Innosight:** Innosight logo, Clayton Christensen photo, mini interactive org-chart tool (placeholder names)
  - **Sandbox:** line chart of average student satisfaction rising from 70% to 79%, with the factors behind it called out: tech news segment card, student interviews, speaker wall (20+ guests, 50+ hours)
  - **Ballard Center:** visual of consulting with startups (the startup advisor side of the role); funding counter to $50,000+; attendance chart with the showcase 57% above the previous record
  - **Creamies:** browser-frame mockup of the website you built; store finder map concept; mini Gantt chart of the 5-intern team; AI content pipeline before/after (~80% less time)
  - **Mock Trial:** product obsession and iterative design loop, with a callout that success depends on feedback (hundreds of rounds of it); team photo; zero-to-program milestone track (approval → $40K → 3-credit course → top 10% of 700+)
  - **Brazil mission:** monochrome map of Brazil with Goiânia pinned and transfer routes; your photos; leadership structure (~120 volunteers, 30+ leaders, reports refocused on replicable innovations); a line in Portuguese
  - **Presidential Scholar (origin):** Presidential Scholars medallion ("top 161 of the 2021 class"); Eagle Scout badge ("VFW Eagle Scout of the Year, Utah")
- [x] Assets: source as much as possible publicly (logos, Clayton Christensen photo, medallion, badge); labeled placeholders for anything that can't be sourced (team, mission photos)

- [x] Spec written (`.claude/specs/career-storyline/`) and first version built
- [x] Sourced: Clayton Christensen photo, Claude symbol, BYU Y, Eagle Scout medal (see `storyline-attribution.txt`)

Still to do:
- [ ] Drop in photos at these paths in `public/assets/img/storyline/` (placeholders show until then):
  - `mock-trial-team.jpg`, `brazil-photo-1.jpg`, `brazil-photo-2.jpg`
  - `creamies-site.jpg` (screenshot of the site, ~16:9)
  - `origin-medallion.jpg` (Presidential Scholars medallion; no clearly licensed public image found)
- [ ] Logos for Innosight, Sandbox, Ballard Center, Creamies, AI Foundry (text wordmarks for now)
- [ ] Review copy and illustrative bits: speaker monograms, interview quotes, Portuguese line, Brazil route cities, "Flight Log" title
- [ ] Commit the branch and deploy

## 2. Skills & experience dashboard / data viz

- [ ] Dashboard or set of charts showing skills and experience (e.g. skill proficiency, experience timeline, tools by category, impact metrics from each role)
- [ ] Decide where it lives: its own page, a section of Portfolio, or part of the homepage storyline
- [ ] Keep it monochrome per DESIGN.md (Overpass Mono "telemetry readout" style)

## 3. "Ask about Dallin" chatbot

- [ ] Interactive chatbot so interviewers can ask questions about me
- [ ] Ground it in my resume, portfolio, and essays so it only answers from real info
- [ ] Needs a serverless function on Vercel (the site is static) and an API key stored as an env var, never in the client
- [ ] Add guardrails: stay on-topic, say "I don't know, email Dallin" when unsure, rate-limit to control cost
- [ ] Design the UI: floating launcher or a dedicated section, with suggested starter questions

## 4. Cleanup and existing content

- [ ] Portfolio: replace the "Your next project goes here" placeholder card with real projects
- [ ] Portfolio: rewrite the generic "Interactive Learning Platform" project description
- [ ] Essays: replace `lorem-ipsum-post.html` with real essays (or hide Essays until there's one)
- [ ] Remove the unused `.scroll-hint` CSS now that the homepage scroll hint is gone
- [ ] Update DESIGN.md with any new visual rules from the storyline, dashboard, and chatbot
