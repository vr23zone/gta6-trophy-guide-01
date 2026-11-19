// Leonida Platinum Atlas — the program that hands the guide in (Node 22, standard library only).
//
// The guide itself is app/: plain static files (index.html, style.css, app.js and
// data/trophies.json) that open in a browser with the network off. This program
// copies app/ and screenshots/ into the output directory and writes
// dossier.json there with the vendored make.fun library — the file the judge
// reads. vendor/makefun-frontend.ts stays exactly as the kit shipped it: the
// scorer rebuilds the dossier with its own copy and compares byte for byte.
//
// Before copying, the program sanity-checks the trophy data it is about to
// hand in: the JSON must parse and carry 55 trophies, each with a guide,
// because the gate refuses a list that names a trophy without one.
//
// Run it locally with:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// (MAKEFUN_OUTPUT_DIR stands in for /output outside the grader.)

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoDir = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const trophyData = JSON.parse(readFileSync(join(repoDir, 'app', 'data', 'trophies.json'), 'utf8'));
const trophyList = Array.isArray(trophyData) ? trophyData : trophyData.trophies;
if (!Array.isArray(trophyList) || trophyList.length !== 55) {
  throw new Error(`trophies.json should list 55 trophies, found ${Array.isArray(trophyList) ? trophyList.length : 'none'}`);
}
const guideless = trophyList.filter((t) => typeof t.guide !== 'string' || t.guide.trim() === '');
if (guideless.length > 0) {
  throw new Error(`trophies without a guide: ${guideless.map((t) => t.name).join(', ')}`);
}

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoDir, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoDir, 'screenshots'))) {
  cpSync(join(repoDir, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The caps below are the scorer's own (reference/gate.json): at most 4
// screenshots of 256 KiB each, at most 993 files and 48 MiB under app/, and a
// dossier text capped at 163,840 bytes.
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);

console.log(`handed in: ${trophyList.length} trophies, dossier written to ${join(outputDir, 'dossier.json')}`);
