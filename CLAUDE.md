# CLAUDE.md

Single reference for how this site works. Keep rationale here instead of long comments in code.

## Working rules

- **Never `git push` (or commit) without the user's explicit approval.** A push to `main` deploys erenonder.com immediately. Leave changes in the working tree for review.
- User-facing strings live in `i18n/en.yaml` and `i18n/tr.yaml` (keyed by `id`). Add new strings to **both**.
- Every content file has an English `name.md` and a Turkish `name.tr.md`.

## Project

Personal portfolio for **Eren ONDER** (Junior Cyber Security Specialist): https://erenonder.com, English at `/`, Turkish at `/tr/`.
Hugo site on the `adritian-free-hugo-theme` theme (Hugo module **v1.12.1**, see `go.mod`), with a custom dark "cyber" design. Forced dark theme, no theme switcher.

## Build / run

- `npm ci`, then `hugo server` (http://localhost:1313). Editing `hugo.toml` may need a server restart.
- Check the build: `hugo --quiet --renderToMemory` (exit 0 = ok). Unused templates: `hugo --renderToMemory --printUnusedTemplates`.
- Needs Hugo **extended ≥ 0.163** (theme minimum; config uses `locale`/`label`). CI pins `HUGO_VERSION` in `.github/workflows/hugo.yaml`.
- npm only provides Bootstrap sources (`bootstrap`, `bootstrap-print-css`), mounted in `hugo.toml`. There is no PostCSS step.

## Deploy (GitHub Actions → GitHub Pages)

- `.github/workflows/hugo.yaml`: on push to `main`, manual dispatch, or after a successful Medium sync. It checks Hugo's SHA-256, runs `npm ci` and `hugo --gc --minify`, then uploads `public/`. `include-hidden-files: true` keeps `/.well-known/security.txt`.
- `.github/workflows/medium-sync.yml`: runs daily at 06:00 UTC. `scripts/sync_medium.py` pulls the Medium RSS into `content/blog/` and commits it. Commits made with `GITHUB_TOKEN` do not trigger `push`, which is why `hugo.yaml` listens for `workflow_run`.
- Actions are pinned to commit SHAs (version noted in a comment). Dependabot (`.github/dependabot.yml`) proposes updates monthly.
- `static/CNAME` = custom domain, `static/googled5d18778e8c91596.html` = Search Console verification, `static/.well-known/security.txt` (renew `Expires` before 2027-07-01).
- `public/` is generated. It is git-ignored and never edited by hand.

## Theme source

- The theme is **not vendored**. Hugo reads it from the module cache (`hugo config mounts` prints the path, e.g. `%LOCALAPPDATA%\hugo_cache\modules\filecache\modules\pkg\mod\github.com\zetxek\adritian-free-hugo-theme@v1.12.1`). Upgrade with `hugo mod get github.com/zetxek/adritian-free-hugo-theme@vX.Y.Z`, then compare build output and screenshots before/after. Read theme templates there, and change behaviour only through local overrides in `layouts/`, `assets/`, `i18n/`.
- `hugo.toml` re-declares the theme's mounts (incl. `data/` for `colorSchemes.yaml`) so that only the static files we use get published: `fonts/adritian-icons.*`, `lozad`, `smooth-scroll`, `rad-animations.js`, `sticky-header.js`, `copy-code.js` (loaded by our `head.html` and the theme's `base-foot.html`). If a theme file starts 404ing, add it to `files` there.
- Theme templates still in use: `_default/baseof.html`, `home.html`, `single.html`, `404.html`, partials `footer.html`, `base-foot.html`, `breadcrumb.html` (+ `breadcrumb-label.html`), `selector-language.html`, `skip-to-content.html`, and the `*-section` shortcodes that only call our partials.
- Theme features switched off in `hugo.toml`: view transitions (`viewTransitions`), image lightbox (`lightbox`), blog reading bar (`blog.readingProgress`; the site has its own scroll bar). The theme SCSS still compiles with libsass, which Hugo has deprecated; that is a theme-side issue.

## How the homepage is built

The theme renders the homepage from the page of `type = "home"`: `content/home/home.md` (`home.tr.md` for TR). That file is a list of shortcodes, in page order:
`showcase-section → education-list → skills-section → experience-section → volunteer-work → certifications-section → activity-list → client-and-work-section → contact-section`.
To add, remove or reorder a section, edit that file (both languages). The `*-section` shortcodes call the partial of the same name in `layouts/partials/`.

## Unpublished content

`hugo.toml` `[[cascade]]` sets `build.render = "never"` for `/home`, `/experience`, `/activity`, `/volunteer-work`, `/education` (sections and pages). These pages only feed homepage sections, so they stay in `.Site.RegularPages` but get no URL, no sitemap entry and no RSS. The `/home` section page also has `list = "never"`, so the theme's home loop only sees `home.md`.
Published: `/`, `/blog/…`, `/projects/…` (the project list page is the back-link target of project pages). Taxonomy pages are disabled (`disableKinds`), so tags remain front-matter data (`.Params.tags`). `disableHugoGeneratorInject` hides the Hugo version, and `pagination.disableAliases` drops `/page/1/` redirects. `layouts/sitemap.xml` lists only pages with a permalink.

## Layout / styling

- Design system and all custom styles: `assets/css/custom.css`. CSS variables at the top (`--accent-blue` `#00d4ff`, `--accent-green` `#39ff14`, `--bg-surface`, …). It is bundled with `adritian-icons.css` and `bootstrap-print.css` via `params.plugins.css`. The theme's `scss/adritian.scss` still loads after it.
- `assets/css/critical.css` overrides the theme's placeholder and is inlined into every page.
- `custom.css` pins the paragraph rhythm the design was built on (`p` 28px line-height, 1rem bottom margin, `p + p` −12px) and the dark dropdown colours. It also restyles the theme breadcrumb (flat, mono, single `/`).
- Section header pattern: `<span class="cyber-section__eyebrow">{{ i18n "X_eyebrow" }}</span>` above `<h2 class="cyber-section__title">`.
- JS: `assets/js/portfolio-animations.js` (loaded from `head_custom.html`, minified and fingerprinted in production). `boot()` runs `initReveal`, `initHeader`, `initTimelineItems/Progress`, `initSkills`, `initTypewriter`, `initActiveNav`, `initFilters`, `initExpanders`, `initParticles`, `initHeroVisibility`, `initScrollProgress`, `initTilt`, `initTerminal`.
- `initParticles()` runs on the homepage only (`body.home`; EN + TR) and draws at ~30 fps; speeds are scaled by frame time.
  - **Desktop:** one `canvas.site-particles` fixed to the viewport at `z-index:-1`, behind every section. Sections and the hero background are transparent so it shows through. Depth parallax: near dots are bigger/brighter and move with 10% of the page scroll, far dots with 5%. It was kept slow and narrow because a larger, wider parallax caused motion sickness; dots wrap top/bottom. Cursor: dots within 125px link to it with faint cyan lines and drift slightly away.
  - **Phones** (`max-width: 767px` or `hover: none`): the canvas sits inside the hero only (as before the redesign), with no parallax. An IntersectionObserver stops drawing once the hero leaves the screen.
  - Styles are inline, so the canvas is sized correctly before the async CSS bundle loads; it is refit by `ResizeObserver`. Skipped with `prefers-reduced-motion`.
- **Performance notes** (measured with Chrome traces; see git history for numbers): the hero grid pans via `transform` on `.cyber-hero__gridbg::before`, not `background-position`, which repainted the masked hero every frame and was the single biggest cost. `initHeroVisibility()` adds `.is-offscreen` to pause it off screen. The hero glows are radial gradients rather than `filter: blur(120px)`. On phones the sticky header uses a near-opaque background instead of `backdrop-filter`. Keep new effects to `transform`/`opacity` animations.
- `initTilt()` (cursor glow + 3D tilt) covers cert, project, blog, volunteer, skill, education, activity and experience cards. Perspective scales with card width (≥800px), so wide cards do not warp. Closed cards tilt at most 2° each way. While a card is open for reading (`isOpen()`: `.is-expanded`, an `aria-expanded="true"` toggle inside, or an open `.ct-item`) it drops to ~0.6°. Disabled on touch devices and with reduced motion. `static/js/smooth-scroll-init.js` overrides the theme's copy (fixed-duration scrolling).
- **Terminal** (`initTerminal()`, `>_` button or the `` ` `` key). The window is sized in monospace `ch` (`.terminal-overlay`: `58ch + 50px`), so help lines never wrap on desktop. On phones the output font drops to .72rem, so the 47-char help lines still fit. Its strings come from `terminal_*` i18n keys and are passed in as the `#terminal-data` JSON from `head_custom.html`. Commands: `help`, `whoami`, `skills`, `experience`, `certifications`/`certs`, `contact`, `cv`, `snake`, `surprise-me`/`surprise`, `sudo hire-me`, `clear`, `exit`.
  - `cv` and the hero "Download CV" button both use i18n `experience_button2_url`. EN → `static/img/general/ErenOnder_SOC_CV_EN.pdf`, TR → `…_TR.pdf`. Replace both PDFs when the CV changes.
  - `surprise-me` (alias `surprise`) runs the **popup prank** (`surpriseTroll()`; `.troll*` styles at the end of the terminal block in `custom.css`):
    - Fake retro Windows error popups (`terminal_troll_msgs`) flood the page faster and faster, cascading. Closing one (× or OK) opens two more. 60 popups in ~3.5 s, kept short so the crash lands inside the browser's ~5 s user-activation window that fullscreen needs.
    - Then the page shakes and goes **real fullscreen** (Fullscreen API, like F11; skipped silently where it is not allowed, e.g. iPhone Safari). A ":(" crash screen counts to 100%, the screen switches off like a CRT and stays black for 3 s, "Rebooting…" shows, fullscreen is exited, and the site comes back with a recap in the terminal (`terminal_troll_done`).
    - Esc skips at any point. In fullscreen the browser takes Esc, so leaving fullscreen early also ends the prank. The terminal stays open, and page scroll is locked meanwhile.
    - It is all page DOM; no real windows or tabs are opened. With reduced motion there are fewer popups and no shake/CRT animation.
    - **Sound** (`makeSfx()`): all synthesised with Web Audio, no audio files (real OS error sounds are copyrighted). Each popup plays a harsh "critical stop"-style square-wave note dropping a tritone, at random pitch and throttled to ≤ ~14/s, so a flood becomes a dissonant cluster. Under the flood, a rising alarm swells over 3.5 s: two detuned low saws beating, plus a siren that wails faster. The crash cuts the alarm and loops a 45 ms noise/buzz grain like a frozen PC's stuck audio for the shake, then dead silence on the blue screen. The CRT switch-off is a click with a falling whine, and a startup chime plays when the site returns. The output goes through master gain .38 and a 4.2 kHz lowpass; peaks measure ~0.26, with no clipping.
      The AudioContext is created inside the Enter keypress so browsers allow playback. It is closed at the end; Esc or leaving fullscreen early cuts the sound with no chime. Without Web Audio the prank runs silent.

## `<head>`

`layouts/partials/head.html` is a trimmed copy of the theme's (v1.12.1). It covers charset/viewport, `theme-color` (`params.themeColor`), `<title>` (`Page | ` + i18n `head_title`), the meta description (`.Description` → page summary → `params.description`), the section RSS link, critical CSS, the CSS bundle, the theme SCSS (compiled with the `default` colour scheme), lozad and OpenGraph. It deliberately leaves out the theme's favicons, canonical, hreflang, Twitter cards and JSON-LD, because `head_custom.html` emits those (the theme's canonical ignores `canonical_url`). Re-diff it against the theme's `head.html` when upgrading.

`layouts/partials/head_custom.html` adds: a `js` class on `<html>` before paint (reveal states only hide when JS can show them again), GA4, Google Fonts (Inter, Space Grotesk, JetBrains Mono), favicons (`?v=2` busts cache), Twitter cards, hreflang + `og:locale:alternate`, JSON-LD (Person + WebSite on home, BlogPosting on posts), the terminal easter-egg JSON payload, canonical URL (`canonical_url` front matter wins, so Medium mirrors point to Medium), and the portfolio script.
- **Analytics:** emitted only in production builds (`hugo server` stays out of the stats). The theme's `head.html` emits `gtag('config', '<id> ')` with a trailing space, which breaks collection. So `params.analytics.googleAnalytics.enabled = false`, and `head_custom.html` emits the tag from `.code`.

## Sections

- **Experience** (`partials/experience.html`, `content/experience/*.md`): full-width cards, newest first, at most `params.homepageExperienceCount`. Logo tile 44×44 from `companyLogo` (an asset path), with an initials fallback. `logoStyle`: `fill` (default; the mark carries its own background and covers the tile) or `plate` (dark-ink transparent logo on white). The active role (`duration` contains "now") gets a "Current" badge with a pulsing dot, a 3px blue left border and a blue tint (`.exp-card--active`), and renders expanded. Cards are otherwise collapsed with a "Show more ▾ / Show less ▴" toggle (`.exp-card__toggle`, `initExpanders()`); `.exp-card__collapse` animates max-height and opacity over 300ms, and several cards may stay open. The body holds the description plus skill pills from `tags`. Like the grid cards it gets the cursor glow and 3D tilt from `initTilt()`.
- **Volunteer work** (`shortcodes/volunteer-work.html`, `content/volunteer-work/`): ordered by weight. `highlight` shows as a stat pill. The body expands via the shared `.expand-toggle`. The logo resolves from assets, then the page bundle, then static.
- **Certifications** (`partials/certifications.html`, `data/certifications.yaml`): sorted by `sort_date`. `logo_style` is `plate` (default; dark ink on a light backing), `badge` (round colourful seals, no backing) or `fill` (artwork with its own background). `courses` turns a multi-course track into one expandable card. `credential_url` adds a Verify button. `date_tr` is the Turkish date.
- **Activity** (`shortcodes/activity-list.html`, `content/activity/`): a filterable timeline. `category` front matter (`ctf`, `ctf-organizer`, `training`, `research`, `conference`, `hackathon`, `other`) picks the badge. Without it, the category is guessed from the title.
- **Projects** (`partials/project-cards.html`, used by the homepage section `partials/client-and-work.html` and by `/projects/` via `layouts/projects/list.html`; content in `content/projects/`): grid cards. `params.image.src` gives a 640×400 webp, otherwise a monospace plate (`params.glyph`). `params.warning` adds a badge. `params.button.URL` links out to the repo. Without it the card links to the on-site write-up (`layouts/projects/single.html`, which reuses the blog-post styles).
- **Skills** (`data/skills.yaml`): categories with `name`/`name_tr` and a 1–5 `level` shown as dots.
- **Blog** (`layouts/blog/`): Medium mirrors carry `source: medium`, `medium_url` and `canonical_url`. `draft: true` set by hand is never overwritten by the sync. New posts get an English stub with `needs_translation: true`. The sync strips scripts, `on*` handlers and `javascript:` URLs, because Goldmark `unsafe = true` prints the HTML as is. Medium sends code blocks (ASCII/IOC tables) as `<pre>` with `<br>` line breaks, and the theme's `br { content: ""; display: block }` rule swallows those, so the sync turns them into real newlines. Blank lines inside a block get U+00A0, because a blank line would end Hugo's raw-HTML block. Medium also auto-links bare domains written in the text (e.g. the fake `apple.com` / `shopeko.com` examples). The sync turns any link whose visible text is just a domain into `<span class="blog-domain">` (link colour, not clickable), except hosts in `KEEP_LINK_HOSTS` (`erenonder.com`). Descriptive links such as References are kept. Translated English files are not re-synced, so apply both conversions to them by hand.
