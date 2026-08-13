# RayGrid Website — CMS-Enabled, SEO-Ready Static Build

This site is generated from editable content files under `/content/` into
real, independent, pre-rendered HTML pages — one per URL — by `build.js`.
A content editor (**Decap CMS**) is wired up at `/admin` so someone
non-technical can log in and edit pages, FAQs, equipment, and upload real
project photos and brand logos, without touching code.

Netlify runs `node build.js` automatically on every deploy (configured in
`netlify.toml`) and publishes the result. No manual build step required.

---

## Why this is structured as a build step

Earlier versions of this site were a single-page app using hash-based
routes (`/#/solutions/residential`). That's invisible to search engines —
everything after `#` is treated as the same URL, so only the homepage
could ever be indexed. `build.js` now generates a genuine separate HTML
file for every page (`/solutions/residential/index.html`, etc.), each with
its own title, meta description, and content already present in the raw
HTML — no JavaScript execution required for search engines to see it.
It also generates `sitemap.xml`, `robots.txt`, and structured data
(LocalBusiness, FAQPage, BreadcrumbList) automatically from the same
content.

---

## What's editable vs. what isn't

**Editable via `/admin`:** exactly as before — contact details, hero copy,
all 8 Solution pages, all 7 Services, all 8 Equipment categories, and
Projects (including photos).

**Not editable via the CMS:** page layout, navigation structure, the
6-step process, the funnel questions — same as before, these live in
`build.js`'s template functions.

Every content edit still triggers a Netlify redeploy exactly as before —
the only difference is Netlify now runs `node build.js` first.

---

## Deploy it

Push to GitHub, connect to Netlify, enable Identity + Git Gateway. Netlify
reads `netlify.toml` automatically and runs the build — no manual "leave
build command blank" step needed this time, since the build command is
defined in the repo.

**Before going live with a real domain:** update the `SITE_URL` constant
near the top of `build.js` to your real domain (used for the sitemap and
canonical URLs), then let it redeploy.

**After going live:** submit `yourdomain.com/sitemap.xml` to Google
Search Console — that's what tells Google these pages exist to crawl in
the first place. Ranking after that depends on backlinks, a claimed
Google Business Profile, and content freshness over time, not just the
code.

---

## Local preview

```
cd sunpower-website
node build.js
cd dist
python3 -m http.server 8080
```

Then visit `http://localhost:8080`. The `/admin` editor itself only works
once deployed on Netlify (it needs Identity + Git Gateway).
