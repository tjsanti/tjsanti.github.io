# Portfolio

This context describes the public professional site Trevor uses to support a full-time AI engineering job search and maintain a durable record of his work.

## Language

**Portfolio**:
The public professional site whose primary purpose is to increase qualified interviews for full-time AI engineering roles. It also acts as Trevor's canonical professional profile and project archive.
_Avoid_: Personal website, resume site

**Core portfolio**:
The parts of the Portfolio that communicate Trevor's experience, projects, skills, and contact paths without depending on optional interactive or AI capabilities.
_Avoid_: Static site, fallback site

**Evaluator**:
A human recruiter, recruiting agent, or hiring manager deciding whether Trevor merits further consideration. Use a narrower audience name only when its behavior differs.
_Avoid_: Visitor, recruiter as a catch-all

**Landing**:
The Portfolio's opening view, which identifies Trevor and offers direct paths into the Profile and Game.
_Avoid_: Home page, splash screen

**Profile**:
The complete conventional presentation of the Core portfolio. It begins with a concise overview but does not withhold technical depth or require the Game.
_Avoid_: Quick info, static page, fallback page

**Game**:
The optional lightweight interactive experience through which an Evaluator can explore Trevor's professional evidence.
_Avoid_: Interactive mode, interactive background

**Grounded Q&A**:
The optional question-answering capability available from both the Profile and Game. It answers questions about Trevor using approved portfolio information, identifies supporting evidence, and does not answer unrelated or unsupported questions.
_Avoid_: Chatbot, AI Trevor, RAG

**Portfolio corpus**:
The approved, public facts, source relationships, project notes, work preferences, and personal details from which the Profile, Game, and Grounded Q&A draw. It is the Portfolio's canonical information source; unpublished drafts are not part of it.
_Avoid_: Knowledge base, AI context, RAG corpus

**Evidence panel**:
A themed overlay that presents Portfolio corpus information without leaving the Game. Opening one pauses player movement until the Evaluator closes it.
_Avoid_: Side panel, pop-up, project page

**Exhibit**:
An evidence-bearing object or character in the Game. Interacting with an Exhibit opens its Evidence panel, including an explicit under-construction state when its content is not ready.
_Avoid_: Hotspot, content object, point of interest

**Decoration**:
An optional atmospheric object that may respond to interaction but contains no required portfolio information.
_Avoid_: Exhibit, easter egg

**Foundation build**:
The privately reviewed implementation milestone in which the Landing, Profile shell, Game structure, Exhibits, navigation, content-loading mechanism, and preview deployment work without requiring finished Portfolio corpus content or a live Grounded Q&A backend.
_Avoid_: Initial launch, MVP

**Public launch**:
The recruiter-ready release served from the custom domain. It contains a complete Profile and intentional content for every visible Exhibit; optional Grounded Q&A may remain explicitly under construction until it is ready for public use.
_Avoid_: Production build, content launch

**Fit analysis**:
An evidence-backed comparison between a job's stated requirements and Trevor's recorded experience, including relevant gaps.
_Avoid_: Fit score, hiring prediction

**Preference alignment**:
An evidence-backed comparison between a job and Trevor's explicitly recorded work preferences. It does not claim that Trevor will enjoy a role.
_Avoid_: Enjoyment score, culture fit
