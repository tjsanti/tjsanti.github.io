# Portfolio rebuild specification

**Status:** Accepted

This specification defines the replacement for Trevor Santiago's current portfolio website. It covers the product, experience, architecture, delivery stages, and operating constraints. Selecting and writing the final portfolio content is a separate task.

The vocabulary in [CONTEXT.md](../../CONTEXT.md) is authoritative. Architectural context is recorded in [ADR 0001](../adr/0001-use-a-game-led-entry-with-a-complete-profile.md), [ADR 0002](../adr/0002-use-one-portfolio-corpus.md), and [ADR 0003](../adr/0003-use-astro-phaser-and-a-stateless-ai-endpoint.md).

## Problem statement

Trevor needs a portfolio that improves his chances of receiving interviews for full-time Applied AI Engineer and AI Engineer roles. A conventional resume site is easy to scan but does little to distinguish him. A game-only portfolio may be memorable but creates friction for Evaluators who want direct evidence.

The replacement must provide both experiences without maintaining two versions of Trevor's professional history. It must also demonstrate practical AI engineering through useful, grounded behavior rather than an unbounded chatbot or a decorative AI label.

## Goals

- Increase qualified interviews after the site is linked from Trevor's resume and LinkedIn profile.
- Give Evaluators a memorable Game without making them use it to access professional evidence.
- Give human and automated Evaluators a complete, crawlable Profile.
- Demonstrate grounded AI behavior through questions about Trevor and job-description analysis.
- Keep hosting and AI usage plausibly within free service tiers.
- Keep content updates manual, repository-based, and understandable without a CMS.
- Keep the site useful as Trevor's canonical professional profile and project archive after the immediate job search.

## Success criteria

The primary outcome is a full-time AI engineering role. Before that outcome, success means an increase in qualified recruiter conversations and interviews compared with the period before the new site is shared.

Site analytics are diagnostic. Traffic, referrers, routes, devices, and performance may explain how the site is used, but they do not prove that the site caused an interview. Trevor will assess interview volume outside the site.

## Audience

The primary audience is the Evaluator:

- Human recruiters scanning for role fit
- Recruiting agents extracting structured candidate information
- Hiring managers checking evidence and technical depth

The site should also reward engineers and other curious visitors who explore the implementation. Their needs do not override the Evaluator's ability to find evidence quickly.

The site must not display an explicit job-search or "open to work" announcement.

### Discovery

The Portfolio is intended to be shared through direct links from Trevor's resume, LinkedIn profile, and messages. Production and Preview intentionally retain `noindex,nofollow`; search indexing is not a Public launch requirement. Pages remain publicly accessible by URL, and these directives do not provide access protection. The Profile must still use semantic HTML so Evaluators opening a direct link can read the complete evidence.

## Product structure

### Routes

- `/` is the Landing.
- `/profile` is the complete conventional Profile.
- `/explore` is the Game.
- Project detail routes may be generated from the Portfolio corpus when their content benefits from a dedicated page.
- `/api/ask` is the Grounded Q&A endpoint.
- Machine-readable files and endpoints are generated from the Portfolio corpus.

The Profile and Game must have stable, directly loadable URLs. Browser navigation must behave normally.

### Landing

The Landing presents Trevor's name and professional title in large type over a darkened, lightweight preview of the castle. It offers two clear paths:

- View profile
- Enter the Game

Scrolling down, pressing the Down arrow, pressing `S`, or activating the Game control starts the same transition. A neutral player character drops into or emerges through the Landing and enters the castle. The browser URL becomes `/explore`.

Opening `/explore` directly skips the Landing transition and places the player at the Game's spawn point. Refreshing `/explore` resets the Game rather than returning to the Landing.

The preview must not initialize or download the complete Game. The Game loads when the Evaluator begins entering it or opens `/explore` directly.

### Profile

The Profile is the complete Core portfolio. It is not a summary, fallback page, or reduced version of the Game.

The Profile begins with information that can be scanned quickly and continues into technical depth. It contains direct access to Trevor's experience, projects, skills, education, resume, GitHub, LinkedIn, and contact path. It also contains Grounded Q&A.

The Profile uses semantic, crawlable HTML. It must remain usable when JavaScript fails, the Game fails, Groq is unavailable, or optional analytics are blocked.

The Profile shares the Game's colors, iconography, borders, and occasional pixel details. It remains a modern reading interface rather than imitating a game screen or rendering all content on fake parchment.

## Game experience

### World

The Game is a compact daytime medieval great hall rendered in modern pixel art. It uses a three-quarter top-down view rather than true isometric projection. The world is slightly larger than the viewport, and a bounded camera follows the player.

The great hall is one connected environment. Additional rooms are not planned. Objects and characters are grouped into readable zones so an Evaluator can understand the available interactions without exploring hallways or completing a tutorial.

The medieval setting is visual. Interface labels and portfolio language remain modern and direct. The site must not force professional experience into medieval lore or make an Evaluator decode themed terminology.

### Visual direction

- Use modern pixel art with roughly 16-bit detail rather than strict 8-bit technical limitations.
- Preserve crisp pixel edges and a controlled palette.
- Use a daytime palette containing sunlit stone, muted slate, timber, moss, blue, green, and one restrained heraldic accent.
- Reserve brighter colors for active Exhibits and interaction prompts.
- Use a pixel display face for the Landing, Game labels, and small display moments.
- Use a readable non-pixel face for the Profile, Evidence panels, and Grounded Q&A.
- Render the world, player, Exhibits, and Decorations through the game engine.
- Render navigation, Evidence panels, links, and Q&A as normal HTML interface layers.

The Landing-to-Game transition is the main visual signature. Other motion and decoration should support it rather than compete with it.

The Foundation build uses deliberate placeholder art. AI-generated assets will replace those placeholders before Public launch. The final tile and sprite set must be cohesive and customized rather than a mixture of unrelated styles.

### Player and controls

The player controls a neutral character with no required identity or customization.

Desktop controls:

- Arrow keys or WASD move the player.
- One clearly communicated key interacts with nearby Exhibits.
- A contextual prompt appears when interaction is available.

Touch controls:

- A floating directional control moves the player.
- A separate interaction control activates Exhibits.

Home and Profile controls remain outside the game canvas and available even if the Game stops responding.

### Exhibits

The initial great hall supports eight primary Exhibits:

1. About Trevor
2. Professional experience
3. Featured project
4. Featured project
5. Featured project
6. Project archive
7. Skills and education
8. Grounded Q&A

The three featured projects are selected through Portfolio corpus metadata. Adding ordinary projects must not require changing the world. Non-featured projects appear in the Project archive.

An Exhibit opens an Evidence panel. A Decoration may respond to interaction but contains no required portfolio information. Exhibits and Decorations must be visually distinguishable.

Opening an Evidence panel pauses player movement and dims the Game without unloading it. The panel is styled as a parchment scroll but retains normal web behavior:

- Readable typography
- Normal scrolling
- Selectable text
- Working links
- A visible close control
- Escape-to-close

Closing the panel resumes the Game. Browser Back closes an open panel before leaving `/explore`.

Visited Exhibits receive a subtle visual change during the current session. The Game has no completion percentage, achievements, locked evidence, inventory, health, score, quest log, or required sequence.

### Game state

Game state exists only in memory. Refreshing or leaving `/explore` may reset:

- Player position
- Visited Exhibits
- Open panels
- Q&A conversation

The site does not save or restore Game state.

### Responsive behavior

The Game is designed for desktop. The Landing and Profile must be fully usable on current mobile browsers.

On a modern phone, an Evaluator must still be able to:

- Move the player
- Interact with visible Exhibits
- Read Evidence panels
- Use Grounded Q&A
- Open Home and Profile

The mobile Game may retain its desktop composition. Scaling, letterboxing, and less polished framing are acceptable. If the controls or panels cannot remain functional, the site must direct the Evaluator to the Profile rather than present a broken experience.

## Portfolio corpus

### Ownership

One Portfolio corpus is the canonical source for the Profile, Game, Grounded Q&A, citations, and machine-readable output.

The corpus contains approved, public information only. Possible record types include:

- Profile and contact details
- Roles and professional experience
- Projects and project notes
- Skills
- Education
- Work preferences
- Public fun facts
- Evidence and source relationships

Records are human-editable and combine structured metadata with prose where needed. Stable identifiers and validated relationships connect records without a database.

### Draft workflow

A gitignored local directory may hold unreviewed resumes, project brain dumps, and other draft material. This directory is a scratchpad, not a source of truth. It is not backed up by Git and must never feed the build or Grounded Q&A.

Content enters the Portfolio corpus only after Trevor reviews, sanitizes, and deliberately promotes it. Every committed corpus record must be safe to publish because the repository is public.

### Presentation rules

A record may target the Profile, Game, Grounded Q&A, or a combination of those presentations. These are presentation rules, not privacy controls.

Professional facts must remain consistent wherever they appear. The Game may contain exclusive Decorations, jokes, or public fun facts, but it cannot contain exclusive professional evidence needed to evaluate Trevor.

### Resume

The Portfolio corpus is canonical. The PDF resume is a separate curated presentation and is updated manually alongside relevant corpus changes.

The site does not parse the PDF at runtime.

### Validation

Adding a valid corpus record should populate its configured presentations without application-code changes.

The build must reject:

- Invalid records
- Duplicate identifiers
- Broken relationships
- Missing required fields
- Invalid presentation targets
- Accidental references to absent required content

An explicitly planned but unfinished Exhibit may render an under-construction state in a Foundation preview. At Public launch, only the optional Grounded Q&A Exhibit may remain explicitly under construction. Invalid content must fail the build rather than appear as a placeholder.

## Grounded Q&A

### Availability

Grounded Q&A appears in both the Profile and the Game. Both presentations use the same endpoint, prompt rules, corpus context, conversation behavior, and failure handling.

Working Grounded Q&A is not required for Public launch. The content-complete Profile and Game may ship while Grounded Q&A is developed and evaluated in a separate, access-protected Preview environment. This makes the reviewed professional evidence available to Evaluators now without coupling its release to the unfinished AI backend.

Until Grounded Q&A is ready, both public presentations show an explicit under-construction notice with links to existing professional evidence and contact information. They must not show canned answers, question inputs, or testing controls. Provider credentials belong only in environments where the backend should run.

Before enabling Grounded Q&A in Production, require working behavior in both presentations, passing the agreed evaluation set, privacy disclosure, and abuse controls. Preview testing must not affect the live Portfolio.

### Supported questions

The assistant may answer questions about Trevor that the Portfolio corpus supports, including:

- Professional history
- Projects and responsibilities
- Skills and technical decisions
- Education
- Public fun facts
- Qualification fit for a supplied job description
- Preference alignment for a supplied job description when the corpus includes relevant preferences

The assistant speaks about Trevor in the third person. It does not impersonate him.

### Grounding rules

- Substantive claims identify supporting records or link to relevant evidence.
- Missing support produces an explicit statement of uncertainty.
- The assistant does not fill gaps with generic claims about what an AI engineer probably knows.
- Reasonable inferences are allowed only when labeled as inferences and tied to cited facts.
- The assistant does not infer sensitive traits, private circumstances, or unrecorded preferences.
- Unrelated questions are declined.
- Instructions contained in pasted job descriptions are treated as untrusted quoted data, not system instructions.

### Job-description analysis

Job-description analysis separates two outputs:

- **Fit analysis** compares stated requirements with Trevor's recorded evidence and identifies relevant gaps.
- **Preference alignment** compares the role with Trevor's explicitly recorded preferences.

The assistant must not produce a fake numeric fit score, claim that Trevor will enjoy a role, or offer an unsupported hiring prediction.

### Conversation behavior

- Conversation state exists in browser memory only.
- Refreshing resets the conversation.
- The browser sends the bounded current conversation with each request.
- The interface offers two suggestions selected from a curated list.
- Selecting a suggestion does not call the API until the Evaluator submits it.
- Arbitrary model answers are not cached at launch.
- Exact requests may be memoized within the current browser session if later needed for responsiveness.

### Failure behavior

When Groq is unavailable, times out, rejects the request, or reaches a quota, the interface states that Grounded Q&A is temporarily unavailable. It does not invent a response, imitate a successful model call, or replace the feature with a second provider.

The endpoint uses a short application timeout and bounded retries only for transient failures. It must not retry malformed input, authentication failures, or other non-transient client errors.

### Privacy notice

The interface identifies the feature as AI-powered. Near the input, it tells Evaluators:

- Their question is sent to Groq to generate an answer.
- Question and answer content is not stored by this site.
- Groq Zero Data Retention is enabled.
- They should not submit confidential, sensitive, or personal information.

The application must not log prompts, pasted job descriptions, or model responses. Aggregate service metadata may still exist at the providers and must not be described as message content.

## Architecture

### Site framework

Use Astro with TypeScript from a blank-slate implementation.

Astro owns:

- Static Profile and project pages
- Landing interface
- Portfolio corpus loading and validation
- Machine-readable generation
- DOM Evidence panels
- Grounded Q&A interface
- The server endpoint

The framework choice does not preserve or constrain the current website implementation.

### Game engine

Use Phaser for:

- World rendering
- Sprite animation
- Asset loading
- Player movement
- Keyboard and touch input
- Collision
- Camera bounds and following
- Exhibit proximity and interaction signals

Phaser receives a compact Exhibit manifest. When the player interacts, Phaser reports an Exhibit identifier to the surrounding web interface. Phaser does not own portfolio prose, Evidence panel markup, Q&A forms, or navigation.

The Phaser bundle is isolated from the Profile and loaded only when an Evaluator enters the Game or opens `/explore` directly.

### AI endpoint

Use one stateless Vercel function for Grounded Q&A.

The endpoint:

1. Accepts JSON `POST` requests only.
2. Validates message shape, size, and conversation limits.
3. Treats all visitor text as untrusted input.
4. Adds a compact build-generated view of the approved Portfolio corpus.
5. Adds the bounded current conversation.
6. Calls Groq with a server-side environment variable.
7. Returns a grounded answer, evidence references, or a typed unavailable response.

The API key must never appear in client code or generated static files.

### Machine-readable output

Normal crawlable HTML is canonical. The build generates the following from the Portfolio corpus:

- Schema.org JSON-LD embedded in the Profile and relevant project pages
- `sitemap.xml`
- `robots.txt`
- `llms.txt` as a concise table of contents pointing to canonical pages
- `profile.jsonld` if it remains a nearly free projection of the embedded graph

`llms.txt` is an optional agent-navigation aid, not an access-control mechanism or a substitute for HTML. No machine-readable format maintains a separate biography.

Generation and validation run automatically during CI and local production builds. New corpus content updates every applicable output in the same build.

### Hosting and deployment

- Use Vercel's GitHub integration for Preview and Production deployments of this repository.
- Use Vercel Hobby unless its practical limits later require a plan change.
- Use separate Preview and Production environments.
- Configure the Groq API key only in environments where Q&A should run.
- Keep the current custom domain.
- Move DNS to the Public launch deployment when it is ready.
- Do not expose the custom domain to an incomplete Foundation build.

Only Grounded Q&A requests consume Vercel function usage. Game code and assets remain static files.

## Security and abuse controls

- Apply Vercel's included WAF rate-limit rule to `/api/ask`, initially around five requests per minute per IP.
- Use a dedicated Groq project and key with conservative project limits.
- Cap individual message length, conversation length, total request size, and output tokens.
- Validate and reject malformed requests before contacting Groq.
- Restrict the endpoint to expected content types and methods.
- Do not expose stack traces, secrets, internal prompts, or raw provider errors.
- Treat job descriptions and all visitor text as untrusted data.
- Rely on the Profile and static evidence when AI is unavailable.

The launch does not add a CAPTCHA or durable rate-limit store. Those are not implied future tasks.

## Analytics and operations

Enable the free Vercel Web Analytics and Speed Insights features. Do not add:

- Advertising trackers
- Session replay
- A separate analytics vendor
- Detailed player telemetry
- Q&A text in URLs, event names, or analytics properties

Use the free deployment, domain, and usage notifications included with Vercel. Subscribe to Vercel and Groq provider-status notifications if useful. No separate monitoring platform or custom monitoring system is required.

The Core portfolio must continue to work when Groq or the Q&A endpoint is unavailable.

## Delivery stages

### Foundation build

The Foundation build is a private preview milestone. It is complete when the following work with placeholder content and art:

- Landing layout and controls
- Lazy Game loading
- Landing-to-Game transition
- Great hall rendering
- Player movement and collision
- Desktop controls
- Best-effort touch controls
- Eight configured Exhibits
- Evidence panels
- Explicit under-construction states
- Home and Profile navigation
- Profile shell
- Corpus loading and validation
- Vercel Preview deployment

The Grounded Q&A Exhibit and Profile location may exist without a working backend during this stage.

### Public launch

The Public launch is recruiter-ready and served from the custom domain. It requires:

- A complete Profile
- Intentional content in every visible Exhibit
- About, professional experience, skills, education, and at least three worthwhile project presentations
- No visible under-construction primary Exhibits, except the optional Grounded Q&A Exhibit
- Final cohesive AI-generated visual assets
- An explicit Grounded Q&A under-construction state in the Profile and Game, or working Grounded Q&A that meets its release gate
- Generated and validated machine-readable files
- Passing CI checks
- Supported browser behavior

### Grounded Q&A release

Grounded Q&A may be enabled in Production after a separate Preview evaluation. It requires:

- Working Grounded Q&A in the Profile and Game
- Grounded answers that pass the agreed evaluation set, including citations, unsupported questions, prompt injection, and provider failures
- Working privacy disclosure and abuse controls
- Production credentials and configuration for the intended provider
- A final check that the Core portfolio remains usable when Q&A is unavailable

## User stories

1. As an Evaluator arriving from a resume or LinkedIn, I want to identify Trevor and his target discipline immediately, so that I know I opened the correct portfolio.
2. As a recruiter in a hurry, I want a direct Profile control on the Landing, so that I can bypass the Game.
3. As a curious Evaluator, I want an obvious way to enter the Game, so that I can explore the memorable experience without guessing.
4. As a keyboard user, I want Down or `S` to begin the transition after the Landing explains the control, so that entering the Game feels connected to movement.
5. As a mouse or touch user, I want a visible Game control, so that keyboard knowledge is not required.
6. As an Evaluator following a direct link, I want `/profile` and `/explore` to load independently, so that shared links behave predictably.
7. As a recruiter, I want the complete professional record in the Profile, so that I never need the Game to evaluate Trevor.
8. As a hiring manager, I want deeper evidence available after the scannable summary, so that I can inspect relevant technical work without switching modes.
9. As a recruiting agent, I want semantic HTML and structured data, so that I can extract the same facts shown to humans.
10. As a Game visitor, I want a compact hall with visible interaction choices, so that I can find meaningful content within seconds.
11. As a Game visitor, I want responsive movement and a following camera, so that navigation feels intentional rather than like a web animation demo.
12. As a Game visitor, I want clear interaction prompts, so that I know which objects contain evidence.
13. As a Game visitor, I want Decorations to look different from Exhibits, so that atmosphere does not obscure navigation.
14. As a Game visitor, I want Evidence panels to open over the paused world, so that reading does not remove me from the experience.
15. As a reader, I want normal scrolling, selectable text, and links inside themed panels, so that the visual treatment does not reduce usability.
16. As a Game visitor, I want a visible close control and Escape support, so that I can return to movement immediately.
17. As a Game visitor, I want Home and Profile controls outside the canvas, so that I can leave even if the Game fails.
18. As a returning Game visitor, I want refresh to reset the experience, so that I can recover from a broken or confusing state.
19. As a mobile visitor, I want a complete Landing and Profile, so that the site remains useful when the desktop-oriented Game is awkward.
20. As a mobile Game visitor, I want functional movement, interaction, panels, and exit controls, so that trying the Game does not trap me.
21. As Trevor, I want project prominence controlled by corpus metadata, so that I can change featured work without redesigning the hall.
22. As Trevor, I want normal project growth to flow into an archive, so that the world does not expand with every addition.
23. As Trevor, I want one canonical public corpus, so that the Profile, Game, AI, and agent-readable formats do not contradict one another.
24. As Trevor, I want a local draft area excluded from the build and Git, so that I can prepare notes before approving them for publication.
25. As Trevor, I want invalid records to fail the build, so that mistakes cannot masquerade as deliberate placeholders.
26. As Trevor, I want presentation rules separate from privacy, so that omitted content is never mistaken for secret content.
27. As an Evaluator, I want Grounded Q&A in both the Profile and Game, so that my chosen route does not hide the feature.
28. As an Evaluator, I want suggested questions, so that I can understand what the assistant can answer.
29. As an Evaluator, I want to ask free-form questions about Trevor, so that I can investigate criteria relevant to my role.
30. As an Evaluator, I want answers tied to evidence, so that I can distinguish supported claims from model language.
31. As an Evaluator, I want unsupported questions to produce uncertainty or refusal, so that missing information is not invented.
32. As an Evaluator, I want to paste a job description, so that I can compare its requirements with Trevor's recorded experience.
33. As an Evaluator, I want qualification fit separated from preference alignment, so that evidence and personal preference are not conflated.
34. As Trevor, I want the assistant to speak about me rather than as me, so that it does not impersonate me.
35. As Trevor, I want reasonable inferences labeled and cited, so that the assistant can be useful without turning guesses into biography.
36. As a Q&A user, I want a short privacy notice, so that I know the feature uses AI and should not receive sensitive information.
37. As a Q&A user, I want refresh to clear the conversation, so that the site does not imply durable chat storage.
38. As a Q&A user, I want a clear unavailable state, so that a provider failure is not confused with an answer.
39. As Trevor, I want rate and size limits on public AI requests, so that casual abuse does not consume the free quota.
40. As Trevor, I want the Groq key held server-side, so that it never reaches public code.
41. As Trevor, I want machine-readable files generated automatically, so that content updates cannot leave stale agent-facing copies.
42. As Trevor, I want preview deployments for incomplete work, so that Foundation builds never need the custom domain.
43. As Trevor, I want Public launch readiness checked in CI, so that unfinished Exhibits and invalid content cannot reach recruiters accidentally.
44. As Trevor, I want free aggregate analytics and performance data, so that I can inspect basic behavior without operating a tracking system.
45. As a visitor, I want the Profile and professional evidence to survive AI outages, so that provider availability never blocks evaluation.

## Testing decisions

Tests should observe behavior at the highest useful boundary. They should verify outputs and interactions rather than internal class structure, Phaser implementation details, or framework internals.

### Corpus and generated output

- Valid records build successfully.
- Invalid records, duplicate IDs, broken references, and accidental missing content fail the build.
- Explicit Foundation placeholders render their intended state.
- Presentation targets produce consistent Profile, Game manifest, Q&A context, and machine-readable output.
- JSON-LD, sitemap, `robots.txt`, and `llms.txt` regenerate when the corpus changes.
- No generated format introduces claims absent from the corpus.

### Site routes

- Landing, Profile, and Game URLs load directly.
- The Profile renders meaningful HTML without client JavaScript.
- Landing controls enter the Game through keyboard, scroll, pointer, and touch paths where applicable.
- Direct `/explore` loads at the Game spawn point.
- Refresh resets Game and Q&A state.
- Browser Back closes an open Evidence panel before leaving the Game.

### Game boundary

- Movement, collision, camera bounds, and Exhibit interaction work through public Game behavior.
- Exhibit interaction reports the correct stable identifier.
- Opening a panel pauses movement; closing it resumes movement.
- Home and Profile remain usable independently of canvas state.
- Profile routes do not download the Phaser bundle.
- Touch controls and panels meet the agreed functional mobile floor.

### Grounded Q&A

- Request validation rejects malformed methods, content types, bodies, excessive sizes, and excessive conversation context before a Groq call.
- Provider credentials never appear in client bundles or returned errors.
- A fixed evaluation set covers biography, project evidence, skills, missing information, unrelated questions, labeled inference, fit analysis, preference alignment, prompt injection inside a job description, and unavailable-provider behavior.
- Substantive answers include evidence references.
- Unsupported claims do not appear in evaluation answers.
- Logs and analytics do not contain prompt or response bodies.

### Public launch gate

- Every visible Exhibit has intentional content.
- The Profile contains all required sections.
- At least three project presentations are complete.
- Both presentations show an intentional Grounded Q&A under-construction state, or Grounded Q&A passes its separate release gate.
- Machine-readable outputs pass syntax and consistency checks.
- Current desktop browsers pass the core flow.
- Current mobile browsers pass Landing and Profile checks and the functional Game floor.

## Explicit non-goals

The following are not planned. They are not deferred work, future phases, backlog suggestions, or invitations for an agent to add them. Reconsidering one requires a new explicit product decision.

- Automatic resume generation
- Retrieval, embeddings, RAG, or a vector database
- Additional Game rooms
- Persistent Game or conversation state
- Advanced or custom monitoring

The following are also outside the accepted launch scope and must not be added opportunistically:

- Database
- CMS
- Authentication or accounts
- Saved progress
- Second AI provider
- Separate backend service outside Vercel
- Semantic response caching
- CAPTCHA or durable rate-limit storage
- Session replay or detailed player telemetry
- Scores, achievements, quests, locked evidence, inventory, or other progression systems
- Automatic local-time theming
- Audio
- Reduced-motion variant

Nighttime artwork was discussed only as a possible visual gimmick. It is not a requirement or assigned follow-up.

## Content work outside this specification

The implementation must support content, but this specification does not select the final featured projects, write final case studies, decide what confidential work may be described, or compose the final Profile copy. Those choices require a separate content pass before Public launch.

## Final design principle

The Game earns attention. The Profile earns trust. Grounded Q&A helps an Evaluator connect Trevor's evidence to a specific need. None may weaken the other two.
