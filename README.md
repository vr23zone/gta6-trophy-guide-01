# Leonida Platinum Atlas — GTA VI Trophy Guide & Tracker

**A [make.fun](https://make.fun) bounty entry: [Build the best GTA 6 trophy guide](https://make.fun/c/gta6-trophy-guide-01)**

An offline web app that guides and tracks all **55 PlayStation 5 trophies of Grand Theft Auto VI**: the official list with a guide to every trophy that names its sources, a five-stage roadmap to the platinum, the one potentially missable trophy flagged in red, and a tracker whose progress saves in the browser. No build step, no network, no account — open it and play.

## What is inside

- **The full official list** — every trophy with its official name, description and grade (1 platinum, 2 gold, 6 silver, 46 bronze), grouped by roadmap stage.
- **A guide to each trophy, in our own words**, with its sources named beside it. Where the launch guides have not pinned a method down yet, the guide says so instead of inventing steps.
- **A tracker** — tick trophies off, keep running counters for the 20 trophies PlayStation tracks by number (250 stunts, 42 range golds, 100 WAiNK locations, $250,000 laundered…), and watch the header count down the trophies left to the platinum. Progress persists in `localStorage` and can be **exported to and imported from a JSON file**.
- **Filters** — by kind (Story, Side strands, Collectibles, Activities, Missable), by grade, by earned status, plus full-text search (`/` focuses it).
- **A spoiler setting** — story trophies stay blurred, names and descriptions alike, until you earn them.
- **A roadmap to the platinum** — five stages with per-stage progress: the story with the counters running, the strand cleanup, and the 100% checklist last.
- **A missables page** — the single potentially missable trophy (Positive Mental Attitude, and its Chapter 1 meditation) plus the short list of habits that protect a run.

## Run it

Serve `app/` with any static file server, or use the bundled one:

```sh
node serve.ts            # then open http://localhost:8080
```

Opening `app/index.html` in a desktop browser works too. Everything the app loads lives under `app/`; it makes no network requests and works fully offline.

Hand the entry in (copies `app/` and `screenshots/` out and writes the dossier the judges read):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Data and sources — the honest note

Trophy names, descriptions and grades are the official ones, as listed identically by **Exophase** and **PSNProfiles** before the bounty opened; PSNProfiles also carries the counts PlayStation tracks. Roadmap totals (about 200 hours, difficulty 4/10, the five-chapter story) and the Chapter 1 meditation warning come from **PowerPyx's** launch guide and roadmap, and the meditation flag is corroborated by **GTABase**. Every other method note is our own work from the official descriptions, and the app says which is which beside each trophy. Nothing here copies another guide's text.

## License

MIT — see [LICENSE](LICENSE).
