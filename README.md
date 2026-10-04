# Garden hall local preview

A 16-bit pixel-art portfolio with a playable hall and a readable Profile. This branch replaces the old site. All current project and career records are fictional.

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
- `/profile/`: Read all the same sample evidence, including the project archive, skills, education, and Q&A.
- `/projects/field-notes/`: An example project detail page. All four sample projects have one.
- Q&A uses canned local replies. Try suggestions, evidence links, a follow-up, reset, and the "Fail next reply" control. No AI provider receives anything.
- Refresh starts a fresh visit and conversation. Nothing is stored in localStorage or sent to a backend.

## Where to change things

- `src/data/portfolio.ts`: Shared sample content and eight exhibit definitions. Validation runs when this file loads.
- `public/art/garden-hall.png`: Selected hall artwork, with the painted character removed.
- `public/art/player/castle-scholar-v2.png`: Muted medieval player artwork, four directions with idle and walk poses. The prompt is in `docs/art/castle-scholar-v2.md`.
- `src/game/hall.ts`: Lazy-loaded Phaser engine, sprite, input, markers, and camera.
- `src/game/hall-geometry.ts`: Walkable floor and furniture collision.
- `src/pages/explore.astro` and `src/scripts/explore.ts`: Game controls and accessible HTML evidence panels.
- `src/components/AskPanel.astro` and `src/scripts/ask.ts`: Shared demo Q&A.
- `/prototype/portfolio/`: Earlier visual studies retained for reference.

Fonts and art are local assets, so runtime has no font-service dependency. Real content, resume/contact links, deployment, and provider-backed Q&A are deliberately deferred. The preview has a noindex meta tag.
