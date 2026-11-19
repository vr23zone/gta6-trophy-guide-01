// Leonida Platinum Guide — entry program for make.fun's gta6-trophy-guide-01 bounty (Node 22, standard library only).
//
// What this program does: it hands in the guide that lives in app/ beside this file. app/ is a plain static web
// app (index.html, ES modules, one stylesheet, data/trophies.json) that runs fully offline. The program copies
// app/ and screenshots/ into the output directory and writes dossier.json there with buildDossier from the
// vendored make.fun library, exactly as the bounty requires. vendor/makefun-frontend.ts is the kit's file,
// copied unchanged — the scorer rebuilds the dossier with its own copy and compares byte for byte, so the
// limits passed below mirror the gate's caps.
//
// Run it locally the same way the grader does, with MAKEFUN_OUTPUT_DIR standing in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The guide itself: static files, copied as they are.
mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });

// The screenshots the judge sees first: 3 or 4 real renders of the app, first by name is the cover.
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The dossier: gate caps from the bounty rules (text cap 160 KiB, at most 4 screenshots of 256 KiB,
// at most 993 files and 48 MiB under app/).
const dossierBytes = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(outputDir, 'dossier.json'), dossierBytes);
