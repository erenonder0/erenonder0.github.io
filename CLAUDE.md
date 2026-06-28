# CLAUDE.md

Guidance for working in this repository.

## Project

Personal portfolio for **Eren ÖNDER** (Digital Forensic Engineering student). Built with **Hugo** using the vendored `adritian-free-hugo-theme` (`_vendor/`), redesigned with a dark cyber aesthetic. Forced dark theme; English + Turkish (`/tr/`).

## Build / run

- Dev server: `hugo server` (http://localhost:1313). Editing `hugo.toml` may need a server restart to reload.
- Verify build: `hugo --quiet --renderToMemory` (exit 0 = ok).

## Layout / styling conventions

- The homepage renders the section partials listed in `hugo.toml` → `[params].sections`, in order. Removing a name from that array removes the section from the page.
- Local partials in `layouts/partials/` override the theme's vendored ones (`_vendor/.../layouts/partials/`).
- Design system + all custom section styles live in `assets/css/custom.css` (CSS variables at the top: `--accent-blue` `#00d4ff`, `--accent-green` `#39ff14`, `--bg-surface`, etc.).
- Section labels use the green code-style eyebrow: `<span class="cyber-section__eyebrow">{{ i18n "X_eyebrow" }}</span>` above `<h2 class="cyber-section__title">`.
- User-facing strings are in `i18n/en.yaml` and `i18n/tr.yaml` (keyed by `id`). Add new strings to **both**.

## Sections

- **Experience** (`layouts/partials/experience.html`): full-width single-column cards (Option C), one per entry, no right-hand column. Each card: logo (44×44, white bg, rounded; image with initials fallback) + date/role/company/location, a "Current" badge with pulsing green dot for the active position (detected via `duration` containing "now"), then a collapsible block holding the description and skill-tag pills (mapped per company in the template's `$tagMap`). Cards are **collapsed by default** with a blue "Show more ▾"/"Show less ▴" toggle (`.exp-card__toggle`); clicking the toggle flips `.is-expanded` on the card (`.exp-card__collapse` animates max-height + opacity, 300ms; multiple cards may stay open). The active card renders with `.is-expanded` on page load. Toggle logic lives in `initExpanders()` in `assets/js/portfolio-animations.js`. Active card gets a 3px blue left border and a faint blue tint (`.exp-card--active`). Entries come from `content/experience/*.md`.

## Notes

- `_vendor/` is the upstream theme — don't edit; override via local `layouts/`.
- `public/` is generated output — never edit by hand.
