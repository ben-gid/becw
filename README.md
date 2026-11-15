# Bellagio Express Car Wash — site redo

Static rebuild of https://bellagioexpresscarwash.com for a client. Three files: `index.html`, `styles.css`, `app.js`. No build step, no dependencies.

## Still needs

- **Form backend.** `#contactForm` and `#careersForm` currently just validate, then tell the visitor nothing was sent and to call — nothing is submitted anywhere (`app.js`, `--- Forms ---` block). Needs a real endpoint (e.g. a route in the Cloudflare Worker) before going live for real.
- **Hosted assets dependency.** All images, fonts, and the reel video are hotlinked from `bellagioexpresscarwash.com/wp-content/uploads/...` and Google Fonts — nothing is local. If the original WordPress site goes down or assets move, this site breaks.

## Deploy

Cloudflare Workers (static assets, configured in `wrangler.jsonc`) is connected to the GitHub repo and deploys automatically on every push to `master`. Live at https://becw.bengid.dev. No build command needed.
