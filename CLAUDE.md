# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, dependency-free rebuild of https://bellagioexpresscarwash.com — a single-page marketing site for a 5-location LA car wash chain (unlimited monthly wash passes, single washes, one location with an oil-change add-on). Three files total:

- `index.html` — the entire page, one `<section>` per feature (hero, passes, benefits, how-it-works, locations, reel, about/reviews, FAQ, contact form, careers form, footer)
- `styles.css` — all styling, organized as one comment-delimited block per section, in the same order as the HTML sections
- `app.js` — all behavior, vanilla JS, no framework, no build step, no dependencies

## Running it

No build/install/test tooling exists. Open `index.html` directly in a browser, or serve the directory statically, e.g.:

```bash
python3 -m http.server 8000
```

There is no linter, formatter, package.json, or test suite configured — don't invent one unless asked.

## Architecture notes

**Images, fonts, and video are hotlinked from the live WordPress site** (`bellagioexpresscarwash.com/wp-content/uploads/...` and Google Fonts). There are no local asset files. When editing content, keep this in mind — adding a new image means either linking another live asset from the source site or the user supplying a new file.

**Several links intentionally point back to the original WordPress site** (`Manage my wash pass`, `Pause my wash pass`, privacy policy, terms of service) — this rebuild only replaces the marketing page, not the pass-management backend.

**CSS and HTML sections are kept in lockstep by order and naming.** Each `<section id="…">` in `index.html` has a matching `/* ===... SectionName ... === */` block in `styles.css` in the same top-to-bottom order (Top bar, Hero, Passes, Benefits, How it works, Go unlimited band, Locations, Reel, About + reviews, FAQ, Forms, Footer). When adding or reordering a section, keep both files in sync and preserve the ordering.

**BEM-ish class naming**: block classes like `.hero`, `.tier`, `.loc`, with `__element` and `--modifier` suffixes (`.hero__title`, `.btn--jet`, `.tier--vip`). Follow this convention for new markup rather than introducing utility classes.

**app.js is organized as independent, self-contained feature blocks** (`--- Comment ---` dividers), each wiring up one piece of DOM behavior: mobile nav toggle, open-now hours chip + video mute, pricing single/monthly toggle, nearest-location finder (geolocation + haversine distance, sorts location cards in place), form submit handlers (client-side validation only, no backend — see below), and scroll-spy nav highlighting via `IntersectionObserver`. There's no module system or shared state between blocks; each queries its own DOM elements independently.

**Forms have no backend.** Both `#contactForm` and `#careersForm` just call `reportValidity()`, show a static "thanks, call us" message, and reset — nothing is actually submitted anywhere. If wiring up real submission, this is the seam to change (`app.js`, the `--- Forms ---` block).

**Location data lives entirely in HTML data attributes** on `.loc` elements (`data-lat`, `data-lng`, `data-close`), not in a JS array — the nearest-location finder in `app.js` reads directly from the DOM. Add/edit locations by editing the `.locs` markup in `index.html`; no other file needs to change.

**Store hours**: the hero's "open now" chip uses a single hardcoded group window (7:00–19:30 America/Los_Angeles, in `app.js`), while each location card has its own `data-close` and displayed hours in `index.html` — Eagle Rock and Lawndale close at 19:00, others at 19:30. These aren't currently cross-checked against each other; keep both in mind when changing hours.
