# Sun Power Website — CMS-Enabled Build

This is the same Sun Power site, restructured so text and images live in editable
files under `/content/` instead of being hardcoded. A content editor
(**Decap CMS**, free and open-source) is wired up at `/admin` so someone
non-technical can log in and edit pages, FAQs, equipment, and — most
importantly — **upload real project photos and brand logos**, without
touching code.

No backend server is required. It deploys as a static site.

---

## What's editable vs. what isn't

**Editable via `/admin`:**
- Contact details (WhatsApp number, phone, email, address)
- Hero headline & subheading
- "Why Sun Power" cards
- Brand partner logos (upload once confirmed — shows a "pending" placeholder until then)
- All 8 Solution pages (problem, application, approach steps, FAQ, etc.)
- All 7 Services (description, included bullets)
- All 8 Equipment categories (description, use cases, detail text)
- Projects (title, category, **photo**, description) — add new ones anytime

**Not editable via the CMS (intentionally — these are structural):**
- Page layout, design, navigation structure
- The 6-step "How Sun Power Works" process
- The 4 audience cards on the homepage (Home/Business/Agriculture/Institution)
- The consultation funnel questions

Changing those requires editing `index.html` directly (ask your developer,
or bring it back here).

---

## Deploy it (about 10–15 minutes, no coding)

### 1. Put this folder in a GitHub repository
- Create a free account at [github.com](https://github.com) if you don't have one.
- Create a new repository (e.g. `sunpower-website`).
- Upload this entire folder's contents to it — either:
  - Drag-and-drop all files/folders into GitHub's web uploader ("Add file → Upload files"), or
  - If you're comfortable with git: `git init`, `git add .`, `git commit -m "Initial site"`, `git push`.

### 2. Connect it to Netlify
- Create a free account at [netlify.com](https://netlify.com).
- **Add new site → Import an existing project → connect to GitHub** → select your new repo.
- Build settings: leave the **build command blank** and set **publish directory** to `/` (this site has no build step).
- Click **Deploy site**. You'll get a live URL like `random-name-123.netlify.app` within a minute.
- Optional: under **Domain settings**, add Sun Power's real domain once you have one.

### 3. Turn on the content editor
- In your new Netlify site: **Site configuration → Identity → Enable Identity**.
- Then **Identity → Services → Git Gateway → Enable Git Gateway**.
- Then **Identity → Invite users** — enter the email address(es) of whoever
  will be editing content (yourself, and/or someone at Sun Power).

### 4. Start editing
- The invited person gets an email, clicks the link, sets a password.
- They land at `your-site.netlify.app/admin` — logged straight into the editor.
- From then on, go to `your-site.netlify.app/admin` anytime to make changes.
  Every save creates a commit in GitHub and the live site updates automatically
  within about a minute.

---

## Before you invite anyone to edit

Open `/admin` yourself first and update **Site Settings** with the real:
- WhatsApp number (currently a placeholder of all zeros)
- Phone, email, address

Everything else can be filled in over time — the site works fine with
placeholders in the meantime (that's by design, per the original brief).

---

## Local preview (optional, before deploying)

Since the site now loads content via `fetch()`, opening `index.html` by
double-clicking it **will not work** (browsers block local file fetches).
Instead, serve it locally:

```
cd sunpower-website
python3 -m http.server 8080
```

Then visit `http://localhost:8080` in your browser. This is only for preview —
the `/admin` editor itself only works once deployed on Netlify (it needs
Identity + Git Gateway, which are Netlify services).
