# Bellagio Express Car Wash — site redo

Static rebuild of https://bellagioexpresscarwash.com for a client. Three files: `index.html`, `styles.css`, `app.js`. No build step, no dependencies.

## Still needs

- **Form backend.** `#contactForm` and `#careersForm` currently just validate, show a fake "thanks" message, and reset — nothing is submitted anywhere (`app.js`, `--- Forms ---` block). Needs a real endpoint (e.g. a Cloudflare Pages Function) before going live for real.
- **Hosted assets dependency.** All images, fonts, and the reel video are hotlinked from `bellagioexpresscarwash.com/wp-content/uploads/...` and Google Fonts — nothing is local. If the original WordPress site goes down or assets move, this site breaks.

## Deploy

Cloudflare Pages (direct upload or git-connected), since the domain's already on Cloudflare. No build command needed.
