# Leonida Platinum Guide — the GTA VI trophy guide & tracker

[![gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![gta6-trophy-guide-01 · vr23zone/gta6-trophy-guide-01 rank](https://make.fun/badge/gta6-trophy-guide-01/vr23zone/gta6-trophy-guide-01/rank.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![gta6-trophy-guide-01 · vr23zone/gta6-trophy-guide-01 reward](https://make.fun/badge/gta6-trophy-guide-01/vr23zone/gta6-trophy-guide-01/reward.svg)](https://make.fun/c/gta6-trophy-guide-01)

An offline trophy guide and progress tracker for **Grand Theft Auto VI on PlayStation 5**: all **55 trophies** of the published PSN list — 1 platinum, 2 gold, 6 silver, 46 bronze, 28 of them hidden — each with a short guide written for this app, plus the tracked target PlayStation counts where the list has one (250 stunts, 42 shooting-range golds, 100% completion, and 17 more).

Built for the make.fun competition [gta6-trophy-guide-01](https://make.fun/c/gta6-trophy-guide-01) ("Build the best GTA 6 trophy guide"). The app is plain static HTML/CSS/JS with no build step and no network calls: open it, and it works.

## What it does

- **Checklist & guides** — every trophy with its official name, description and grade, a per-trophy guide, a source line, an earned checkbox, and a counter for the 20 tracked trophies (reaching the target marks the trophy earned).
- **Progress that means something** — the header always shows earned/total, how many trophies stand between you and the platinum, and the per-grade counts.
- **Roadmap to platinum** — a six-stage route (story → strangers → skills → collectibles → money → the 100% push) with hour estimates per stage and live per-stage progress, built around one rule: the story is the only part with an order, so it goes first.
- **Missables, honestly labelled** — the published list names no hard missable; the app flags the three trophies whose official descriptions describe one-off moments, permanent choices, or a second attempt, explains the reasoning for each flag, and gives the three-save rule that insures against all of them.
- **Spoiler mode** — on by default: unearned story trophies are blurred until you earn them or switch the mode off.
- **Filters & search** — by kind (story / missable / collectibles / activities / online), by grade, by earned state, and by text across names, descriptions and guides.
- **Your save lives in your browser** — progress persists in `localStorage`; export it to a JSON file and import it on another machine from the "Save & sources" tab. Nothing is uploaded anywhere.
- **Fully offline** — every script, style and data file is local to `app/`. No trackers, no fonts, no CDN.

## Run it

- Just open `app/index.html` in a browser, or
- serve the folder: `node serve.ts` (port 8080), then visit `http://localhost:8080/`.

## Build the submission dossier

`node main.ts` copies `app/` and `screenshots/` into the output directory (`MAKEFUN_OUTPUT_DIR`, default `/output`) and writes `dossier.json` using `vendor/makefun-frontend.ts`.

## Data & sources

- **Official names, descriptions and grades** — Exophase's GTA VI (PSN) trophy list: <https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/> (the list also ships in the competition starter's `app/data/trophies.json`; this app's data was checked item by item against it — all 55 names and descriptions match exactly).
- **Tracked targets** (the "0 / X" numbers) — PSNProfiles' GTA VI trophy list: <https://psnprofiles.com/trophies/43531-grand-theft-auto-vi>.
- **Guides, roadmap and missable analysis** — written for this app, in its own words, from the official descriptions. Where a description is a joke or deliberately cryptic, the guide says so instead of inventing locations or steps. The list describes no online trophies; the "with your partner" trophies are single-player, written for the game's two protagonists.

GTA VI and Grand Theft Auto are trademarks of Rockstar Games / Take-Two Interactive. This is an unofficial fan guide; it uses no Rockstar logos or artwork.

## License

MIT — see `LICENSE`.
