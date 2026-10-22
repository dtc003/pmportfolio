# Requirements Document

## Introduction

The homepage currently ends at the Earth hero. This feature adds a scrolling career storyline below it: as a visitor scrolls, the Earth drifts up and away (existing parallax) while the starfield stays in place, and a sequence of eight chapters tells the story of Dallin's work and leadership experience, newest first. Each chapter pairs a short narrative with visuals chosen for that role: logos, photos, small charts, diagrams, and one interactive tool recreation.

The storyline must fit the existing design system (DESIGN.md): near-black, monochrome UI, Overpass / Overpass Mono, sharp corners, minimal functional motion. Logos and photos are monochrome by default and warm to full color only while their chapter is in focus. Client work under confidentiality is shown only as stylized recreations with no client names.

Chapters, in order:
1. AI Foundry @ BYU — Forward Deployed Engineer (Sep 2026 – Present)
2. Innosight, Huron Consulting — Management Consulting Summer Analyst (Jun 2026 – Aug 2026)
3. Sandbox Accelerator — Product Manager, Operations (Sep 2025 – May 2026)
4. Ballard Center: Startups for Good — Startup Advisor (Apr 2024 – Sep 2025)
5. Creamies Premium Ice Cream — Project Manager & Intern (Jan 2025 – Apr 2025)
6. BYU Mock Trial Program — Founder & Instructor (Jan 2025 – Present)
7. Church of Jesus Christ of Latter-day Saints, Goiânia, Brazil — Volunteer Representative (Jan 2023 – Dec 2024)
8. U.S. Presidential Scholar & Eagle Scout (2021) — origin chapter

Out of scope: the skills dashboard, the chatbot, and changes to the Portfolio and Essays pages (tracked separately in TODO.md).

## Requirements

### Requirement 1: Storyline placement over the starfield

**User Story:** As a visitor on the homepage, I want to keep scrolling past the Earth into a story of Dallin's career, so that I learn who he is without leaving the page.

#### Acceptance Criteria
1. WHEN the homepage loads THEN the system SHALL render the existing Earth hero unchanged as the first screen.
2. WHEN the visitor scrolls below the hero THEN the system SHALL display the storyline chapters over the existing starfield background.
3. WHILE the visitor scrolls through the storyline THEN the starfield SHALL remain visible behind all chapter content.
4. WHEN the visitor scrolls past the hero THEN the Earth SHALL continue to move off-screen using its existing parallax behavior and SHALL NOT overlap chapter content.
5. WHEN the visitor reaches the end of the storyline THEN the system SHALL show a link to the full Portfolio page.
6. IF chapter content is placed on a panel THEN the panel SHALL use the design system's glass panel treatment so stars stay faintly visible through it.

### Requirement 2: Chapter structure and order

**User Story:** As a recruiter, I want each role presented as its own clear chapter, newest first, so that I see the most current work immediately and can follow the story backward.

#### Acceptance Criteria
1. WHEN the storyline renders THEN the system SHALL show the eight chapters in the order listed in the Introduction (newest to oldest).
2. WHEN a chapter renders THEN the system SHALL show the organization, role title, and dates (dates in Overpass Mono).
3. WHEN a chapter renders THEN the system SHALL show a short narrative (no more than ~3 sentences or bullets) drawn from the finalized resume content.
4. WHEN a chapter renders THEN the system SHALL show the visuals defined for that chapter in Requirements 5–12.
5. IF the resume figures in a chapter differ from the Portfolio page THEN the system SHALL use the same figures as the Portfolio page, so the site never contradicts itself.

### Requirement 3: Monochrome-to-color focus treatment

**User Story:** As a visitor, I want logos and photos to come alive as I reach each chapter, so that scrolling feels rewarding while the site keeps its restrained look.

#### Acceptance Criteria
1. WHEN a chapter is not the chapter in focus THEN the system SHALL render its logos as monochrome (white/gray) and its photos in grayscale.
2. WHEN a chapter scrolls into the center of the viewport THEN the system SHALL transition that chapter's logos and photos to full color.
3. WHEN the chapter leaves the center of the viewport THEN the system SHALL transition its logos and photos back to monochrome.
4. WHEN the color transition runs THEN it SHALL use the design system's motion rules (ease-out on enter, ease-in on exit, no bounce).
5. IF only one chapter can be in focus at a time THEN the system SHALL apply full color to at most one chapter at once.
6. Charts, diagrams, and UI elements SHALL stay monochrome at all times; only logos and photos change color.

### Requirement 4: Scroll-triggered animation and reduced motion

**User Story:** As a visitor, I want visuals to animate when I reach them, so that each chart and diagram reads as part of the story rather than a static image.

#### Acceptance Criteria
1. WHEN an animated visual (counter, line chart, flow diagram, Gantt chart, milestone track) first enters the viewport THEN the system SHALL play its animation once.
2. WHEN an animated visual has not yet entered the viewport THEN the system SHALL NOT run its animation.
3. IF the visitor's system has `prefers-reduced-motion: reduce` THEN the system SHALL show every visual in its final state with no animation and SHALL switch colors without a transition.
4. WHEN JavaScript is unavailable THEN the system SHALL still show all chapter text and visuals in their final state.

### Requirement 5: AI Foundry @ BYU chapter visuals

**User Story:** As a recruiter, I want to see that Dallin is doing hands-on AI work today, so that I understand his current technical edge.

#### Acceptance Criteria
1. WHEN the chapter renders THEN the system SHALL show the AI Foundry / BYU mark beside the Claude (Anthropic) mark, captioned to note BYU is the first university in the Claude partner network.
2. WHEN the chapter renders THEN the system SHALL show an animated automation flow diagram (trigger → AI step → output) representing customer automations for a data center infrastructure and cooling provider.
3. The flow diagram SHALL NOT name the client.

### Requirement 6: Innosight chapter visuals

**User Story:** As a recruiter, I want to see the Innosight connection and the tool Dallin built there, so that I understand both the pedigree and the output of the internship.

#### Acceptance Criteria
1. WHEN the chapter renders THEN the system SHALL show the Innosight logo.
2. WHEN the chapter renders THEN the system SHALL show a photo of Clayton Christensen, Innosight's co-founder, with a caption identifying him.
3. WHEN the chapter renders THEN the system SHALL show an interactive miniature recreation of the decision-architecture org chart tool.
4. WHEN the visitor hovers, focuses, or taps a node in the org chart THEN the system SHALL highlight that node and its reporting/decision connections.
5. The org chart SHALL use placeholder names and titles and SHALL NOT identify the FFRDC client or any real person in it.
6. The org chart SHALL be operable by keyboard as well as mouse and touch.

### Requirement 7: Sandbox Accelerator chapter visuals

**User Story:** As a recruiter, I want to see a measurable result and what produced it, so that I understand how Dallin drives outcomes as a PM.

#### Acceptance Criteria
1. WHEN the chapter renders THEN the system SHALL show a line chart of average student satisfaction rising from 70% to 79%.
2. The chart SHALL label the start and end values directly (70% and 79%) rather than relying on a percent-change label.
3. WHEN the chapter renders THEN the system SHALL show the contributing factors next to the chart: the tech news segment, student interviews, and the speaker wall.
4. WHEN the chapter renders THEN the tech news segment SHALL appear as a mock "episode" card.
5. WHEN the chapter renders THEN the speaker wall SHALL show a grid of hosted guests with the figures "20+ guests" and "50+ hours".
6. WHEN the line chart renders THEN it MAY show illustrative intermediate data points between 70% and 79%, and the chart SHALL be labeled as illustrative (for example "Illustrative trend").

### Requirement 8: Ballard Center chapter visuals

**User Story:** As a recruiter, I want to see Dallin's startup advising and its results, so that I understand his consulting instincts with early-stage founders.

#### Acceptance Criteria
1. WHEN the chapter renders THEN the system SHALL show a visual of consulting with startups (advisor working through business model and social impact with founders).
2. WHEN the chapter renders THEN the system SHALL show a funding counter that counts up to "$50,000+" awarded.
3. WHEN the chapter renders THEN the system SHALL show a showcase attendance chart with Dallin's showcase marked 57% above the previous all-time record.
4. WHEN the attendance chart renders THEN it MAY show illustrative attendance for prior years, provided the previous record and the new result stay 57% apart, and the chart SHALL be labeled as illustrative.

### Requirement 9: Creamies chapter visuals

**User Story:** As a recruiter, I want to see the range of what Dallin delivered at a small company, so that I understand he can manage, build, and find product opportunities.

#### Acceptance Criteria
1. WHEN the chapter renders THEN the system SHALL show a browser-frame mockup of the Creamies website Dallin built.
2. WHEN the chapter renders THEN the system SHALL show a store finder concept as a small map with location pins, labeled as a proposed tool from analyzing 300+ customer complaints.
3. WHEN the chapter renders THEN the system SHALL show a mini Gantt chart of work divided across the 5-intern team.
4. WHEN the chapter renders THEN the system SHALL show an AI content pipeline before/after comparison with content creation time cut ~80%.
5. The Gantt chart and store finder map SHALL be illustrative and SHALL NOT expose real store addresses or intern names.

### Requirement 10: BYU Mock Trial chapter visuals

**User Story:** As a recruiter, I want to see how Dallin built a program from zero through iteration, so that I understand how he thinks about product and feedback.

#### Acceptance Criteria
1. WHEN the chapter renders THEN the system SHALL show a visual of product obsession and iterative design (a build → test → feedback → refine loop).
2. WHEN the chapter renders THEN the system SHALL show a callout explaining that mock trial success depends on feedback and that the team gets hundreds of rounds of it.
3. WHEN the chapter renders THEN the system SHALL show a team photo, or a labeled placeholder until one is provided.
4. WHEN the chapter renders THEN the system SHALL show a zero-to-program milestone track: approval → $40,000+ funding → 3-credit course for 18 students → top 10% of 700+ teams nationally.

### Requirement 11: Brazil mission chapter visuals

**User Story:** As a recruiter, I want to see Dallin's leadership at scale abroad, so that I understand his people leadership and language skills.

#### Acceptance Criteria
1. WHEN the chapter renders THEN the system SHALL show a monochrome map of Brazil with Goiânia pinned and transfer routes across states.
2. WHEN the chapter renders THEN the system SHALL show personal photos, or labeled placeholders until they are provided.
3. WHEN the chapter renders THEN the system SHALL show a leadership structure diagram of ~120 volunteers and 30+ leaders, noting the shift of weekly reports toward replicable innovations.
4. WHEN the chapter renders THEN the system SHALL include a short line in Portuguese with an English translation available.
5. The map and diagram SHALL NOT show names or identifying details of any individual volunteer.

### Requirement 12: Presidential Scholar origin chapter visuals

**User Story:** As a recruiter, I want to see where the story started, so that I understand Dallin's long track record.

#### Acceptance Criteria
1. WHEN the chapter renders THEN the system SHALL show the U.S. Presidential Scholars medallion with the caption "Top 161 of the 2021 national graduating class".
2. WHEN the chapter renders THEN the system SHALL show the Eagle Scout badge with the caption "VFW Eagle Scout of the Year, Utah, 2021".
3. WHEN the storyline ends on this chapter THEN the system SHALL present it as the origin of the story (for example "Where it started").

### Requirement 13: Asset sourcing, attribution, and placeholders

**User Story:** As the site owner, I want every image to be legitimately sourced and easy to replace, so that the site is safe to publish and I can drop in my own photos later.

#### Acceptance Criteria
1. WHEN an asset (logo, Clayton Christensen photo, medallion, badge, map) can be sourced from a public source with terms that allow this use THEN the system SHALL use it and record its source and license in an attribution file alongside the existing `earth-attribution.txt`.
2. IF an asset cannot be sourced with acceptable terms THEN the system SHALL show a labeled placeholder in the same size and position.
3. WHEN a placeholder is shown THEN it SHALL state what belongs there (for example "Mock trial team photo") and match the monochrome design.
4. WHEN Dallin provides a replacement photo THEN replacing it SHALL require only adding the image file and changing a single path.
5. All assets SHALL be stored locally under `public/assets/img/` rather than hot-linked from other sites.

### Requirement 14: Responsive layout

**User Story:** As a visitor on a phone, I want the storyline to read cleanly, so that the experience works wherever I open it.

#### Acceptance Criteria
1. WHEN the viewport is 640px or wider THEN the system SHALL lay out each chapter with narrative and visuals side by side within the 1080px content width.
2. WHEN the viewport is narrower than 640px THEN the system SHALL stack narrative above visuals in a single column with at least 16px side gutters.
3. WHEN any viewport width from 320px upward is used THEN the page SHALL NOT scroll horizontally.
4. WHEN a visual has interactive elements on a touch device THEN tap targets SHALL be at least 44×44px.

### Requirement 15: Accessibility

**User Story:** As a visitor using assistive technology, I want the storyline's content available to me, so that I get the same story.

#### Acceptance Criteria
1. WHEN an image renders THEN it SHALL have alt text describing its content, or empty alt text if purely decorative.
2. WHEN a chart or diagram renders THEN the system SHALL provide a text equivalent of its key data (for example "Satisfaction rose from 70% to 79%").
3. WHEN the storyline renders THEN each chapter SHALL use a heading in the correct order under the page's heading structure.
4. WHEN text renders over the starfield THEN it SHALL meet WCAG AA contrast against its background.
5. WHEN the visitor navigates by keyboard THEN every interactive element SHALL be reachable and show a visible focus state.

### Requirement 16: Performance and design-system fit

**User Story:** As the site owner, I want the storyline to keep the site fast and on-brand, so that it doesn't undo the Earth hero's performance work.

#### Acceptance Criteria
1. WHEN the homepage loads THEN images below the hero SHALL be lazy-loaded.
2. WHILE the visitor scrolls the storyline THEN the page SHALL produce no long tasks over 50ms, measured the same way as the Earth hero (PerformanceObserver, longtask).
3. WHEN the storyline is built THEN it SHALL NOT change the Earth rotation architecture described in DESIGN.md.
4. WHEN the storyline is built THEN it SHALL remain a static site with no build step and no new framework, using plain HTML, CSS, and JavaScript plus inline SVG for charts and diagrams.
5. WHEN the storyline is built THEN all fonts, colors, spacing, radii, and motion SHALL follow DESIGN.md, and DESIGN.md SHALL be updated with any new rules the storyline introduces.
