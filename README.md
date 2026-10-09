# Garden hall Portfolio

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
- `/profile/`: Read the complete professional evidence, including the project archive, skills, education, certifications, recognition, and Q&A status.
- `/projects/normflow/`: A project detail page. All six project records have one. NormFlow, AI-assisted PCD editing, and Repair Trends are featured in the hall; Known Fixes, Mets outfield-alignment modeling, and the retired Find a Fix pipeline appear in the archive.
- Q&A shows an under-construction notice in both the Profile and Game, with links to projects and contact information.
- To test the retained canned demo locally, run `QA_DEMO=1 npm run dev`. For a non-production preview build, use `QA_DEMO=1 npm run build`. Try suggestions, evidence links, a follow-up, reset, and the "Fail next reply" control. No AI provider receives anything. Leave `QA_DEMO` unset for public builds; Vercel Production ignores the demo opt-in.
- Refresh starts a fresh visit and conversation. Nothing is stored in localStorage or sent to a backend.

## Where to change things

- `src/data/portfolio.ts`: Approved Portfolio content and eight exhibit definitions. Validation runs when this file loads. Edit the records here to update the Profile, project pages, Game evidence, and canned Q&A together. Exactly three projects must be featured.
- `content-drafts/`: Gitignored local staging for unreviewed material. The site never imports this directory or reads the job-search workspace. Promote approved content into `src/data/portfolio.ts` manually.
- `public/art/garden-hall.png`: Selected hall artwork, with the painted character removed.
- `public/art/player/castle-scholar-v2.png`: Muted medieval player artwork, four directions with idle and walk poses. The prompt is in `docs/art/castle-scholar-v2.md`.
- `src/game/hall.ts`: Lazy-loaded Phaser engine, sprite, input, markers, and camera.
- `src/game/hall-geometry.ts`: Walkable floor and furniture collision.
- `src/pages/explore.astro` and `src/scripts/explore.ts`: Game controls and accessible HTML evidence panels.
- `src/components/AskPanel.astro`: Shared public Q&A under-construction state. `src/components/AskDemo.astro` and `src/scripts/ask.ts` retain the opt-in canned preview.
- `/prototype/portfolio/`: Earlier visual studies retained for reference.

Fonts and art are local assets, so runtime has no font-service dependency. GitHub, LinkedIn, and email links use reviewed contact details. Resume controls request a resume by email until a current public PDF is selected and `portfolio.links.resume` is set. The content-complete Portfolio may launch with Q&A under construction. Provider-backed Q&A and job-fit analysis remain deferred until a separate, access-protected Preview evaluation passes the Q&A release gate in `docs/specs/portfolio-rebuild.md`. The opt-in local demo uses canned responses and clearly identifies itself.

## Deployment and discovery

Trevor already has a Vercel project connected to this GitHub repository through Vercel's dashboard. This does not require a repo-local Vercel configuration or `.vercel` directory. The repository also retains its GitHub Pages workflow; its presence does not describe the Vercel project's settings.

The Portfolio intentionally keeps `noindex,nofollow` in Production and Preview. Trevor shares it through direct links, such as a resume or LinkedIn profile, and does not want search indexing. This is a discovery preference, not access protection; anyone with the URL can open and share it. Do not remove the tag as routine launch cleanup.
