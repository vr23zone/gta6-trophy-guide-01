# Leonida Ledger — GTA VI Trophy Guide & Tracker

[![make.fun competition](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/vr23zone/gta6-trophy-guide-01/rank.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/vr23zone/gta6-trophy-guide-01/reward.svg)](https://make.fun/c/gta6-trophy-guide-01)

A free, open-source, **offline** guide and tracker for all **55 PlayStation 5 trophies of Grand Theft Auto VI**, built for the make.fun bounty [“Build the best GTA 6 trophy guide”](https://make.fun/c/gta6-trophy-guide-01). Open `app/index.html` in a desktop browser — no network, no build step, no account.

## What it does

- **The full official list** — every one of the 55 trophies (1 platinum, 2 gold, 6 silver, 46 bronze, 28 hidden on PSN) with its official name, description and grade, shown exactly as PlayStation publishes them.
- **A tracker that remembers** — tick trophies off and the checklist saves itself in the browser (localStorage); per-trophy **progress counters** for the targets PlayStation tracks (42 Shooting Range golds, 250 stunts, 100 WAiNK locations, 500 choices, $250,000 laundered…); **export and import** your progress as a JSON file.
- **Filters and search** — by kind (story, missable, collectibles, activities, online), by grade, by earned status, and by text.
- **A spoiler setting** — hide the names and descriptions of story trophies until you earn them.
- **A roadmap to the platinum** — six stages built from the official descriptions: the story in chapter order, the stranger strands parked *before* the final mission (the point-of-no-return precaution), then the free-roam sweep, the collections and counters, and the 100% audit — with the guide's own hour estimates (roughly 80–110 hours).
- **Missable flags with their reasoning shown** — three trophies flagged missable-risk (choices, a fail-then-succeed event, a one-time partnership beat), each flag built from — and honestly labelled as — our reading of its official description.
- **A guide to every trophy, in our own words, with sources named beside it** — what to do, where the official description pins it down, and a plain admission where it does not.

## Data and sources — the honest note

Names, descriptions and grades are the official PS5 list as published by PlayStation and listed, in agreement on all 55, by [Exophase](https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/) and [PSNProfiles](https://psnprofiles.com/trophies/43531-grand-theft-auto-vi); PSNProfiles also carries the progress targets PlayStation tracks, which are the targets of this tracker's counters. The `hidden` flags mark the 28 trophies PlayStation hides until earned, as listed by those sources. Everything else — every guide, the roadmap, the hour estimates, the missable flags and the point-of-no-return precaution — is this guide's own work, written for this entry from the official descriptions; where a description does not pin a fact down, the guide says so rather than inventing one. No Rockstar Games logo, artwork or game screenshot is used anywhere; the look is our own.

## Run it

```sh
node serve.ts            # serves app/ at http://localhost:8080
```

or serve the `app/` folder with any static file server. It works with the network off.

## Hand it in (how the entry is built)

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored `vendor/makefun-frontend.ts` library, exactly as the competition's gate rebuilds it.

## Layout

- `app/index.html` — the page shell: masthead score, the four views (Tracker, Roadmap, Missables, Save & settings)
- `app/js/data.js` — data loading, grade/kind constants, tallies
- `app/js/store.js` — progress state: earned ticks, counters, spoiler setting, export/import
- `app/js/filters.js` — kind/grade/status/search filtering and the spoiler-masking rule
- `app/js/roadmap.js` — the six roadmap stages and their progress
- `app/js/render.js` — every view's rendering
- `app/js/main.js` — boot, hash routing, toolbar wiring
- `app/data/trophies.json` — the 55 trophies: official fields plus kind, hidden flag, PSN target, roadmap stage, missable flag and the guide with its sources
- `screenshots/` — four real renders of the app (cover: tracker with a guide open; roadmap; missables; silver filter)

## License

MIT — see `LICENSE`.
