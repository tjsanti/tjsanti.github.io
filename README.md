# Garden hall local preview

A 16-bit pixel-art Portfolio with a playable hall and a readable Profile. This branch replaces the old site. The shared content contains Trevor's reviewed experience, projects, education, skills, certifications, and recognition.

## Run locally

Use Node 22.18+ or Node 24+ and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Astro, normally `http://localhost:4321`. If another preview is using that port, Astro chooses the next one. No `.env` file, Groq key, Vercel account, or external content is needed.

```sh
npm test
npm run build
npm run preview
```

## Try the flow

- `/`: Garden hall landing. Click Enter, scroll down, press S or Down, or swipe up to enter.
- Entry stays in the same document. The hall boots behind the landing artwork, then the artwork moves into the game camera framing and the character appears. Reduced-motion mode skips the camera move. The engine still loads only after entry.
- `/explore/`: Walk with WASD or arrows. Press E by an exhibit, or click its marker to walk there. Touch controls appear on narrow screens and touch devices.
- Evidence opens in a scroll panel and pauses movement. Escape, Return to the hall, or browser Back closes it. The Exhibits directory opens the same panels without walking.
- `/profile/`: Read the complete professional evidence, including the project archive, skills, education, certifications, recognition, and Q&A preview.
- `/projects/normflow/`: A project detail page. All six project records have one. NormFlow, AI-assisted PCD editing, and Repair Trends are featured in the hall; Known Fixes, Mets outfield-alignment modeling, and the retired Find a Fix pipeline appear in the archive.
- Q&A uses canned local replies. Try suggestions, evidence links, a follow-up, reset, and the "Fail next reply" control. No AI provider receives anything.
- Refresh starts a fresh visit and conversation. Nothing is stored in localStorage or sent to a backend.

## Where to change things

- `src/data/portfolio.ts`: Approved Portfolio content and eight exhibit definitions. Validation runs when this file loads. Edit the records here to update the Profile, project pages, Game evidence, and canned Q&A together. Exactly three projects must be featured.
- `content-drafts/`: Gitignored local staging for unreviewed material. The site never imports this directory or reads the job-search workspace. Promote approved content into `src/data/portfolio.ts` manually.
- `public/art/garden-hall.png`: Selected hall artwork, with the painted character removed.
- `public/art/player/castle-scholar-v2.png`: Muted medieval player artwork, four directions with idle and walk poses. The prompt is in `docs/art/castle-scholar-v2.md`.
- `src/game/hall.ts`: Lazy-loaded Phaser engine, sprite, input, markers, and camera.
- `src/game/hall-geometry.ts`: Walkable floor and furniture collision.
- `src/pages/explore.astro` and `src/scripts/explore.ts`: Game controls and accessible HTML evidence panels.
- `src/components/AskPanel.astro` and `src/scripts/ask.ts`: Shared demo Q&A.
- `/prototype/portfolio/`: Earlier visual studies retained for reference.

Fonts and art are local assets, so runtime has no font-service dependency. GitHub, LinkedIn, and email links use reviewed contact details. Resume controls request a resume by email until a current public PDF is selected and `portfolio.links.resume` is set. Provider-backed Q&A and job-fit analysis remain deferred; the local demo uses canned responses and clearly identifies itself. The preview retains its noindex meta tag.
