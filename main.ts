// NationScope hand-in (Node 22, standard library only). The site lives in
// app/ as plain static files — no build step, no network at run time — and
// the screenshots in screenshots/ are real renders of it. This program is
// the entry's hand-in: it assembles /output from the repository beside it
// (app/ and screenshots/ copied over, plus a dossier.json the judge reads),
// using the vendored make.fun library, which must stay byte-identical to
// the kit's copy or the scorer refuses the dossier.
//
// Run it outside the grader with MAKEFUN_OUTPUT_DIR set:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });

const shotsOut = join(outputDir, 'screenshots');
mkdirSync(shotsOut, { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), shotsOut, { recursive: true });
}

// The caps match the gate in the competition rules: at most 4 screenshots,
// each at most 256 KiB; app/ at most 993 files and directories and 16 MiB;
// the dossier text at most 160 KiB.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);
