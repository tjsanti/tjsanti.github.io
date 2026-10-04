/** Fictional content for the local Foundation build. Replace with reviewed facts. */
export const previewNotice = 'Local preview. All experience, projects, skills, and education below are fictional sample content.';

export interface Portfolio {
  name: string;
  title: string;
  tagline: string;
  about: string[];
  experience: { id: string; title: string; organization: string; period: string; summary: string; bullets: string[] }[];
  projects: { id: string; title: string; summary: string; detail: string[]; tags: string[]; featured: boolean }[];
  skills: string[];
  education: { id: string; title: string; institution: string; period: string; summary: string }[];
  links: { github: string; linkedin: string; contact: string; resume: string };
}

export const portfolio: Portfolio = {
  name: 'Trevor Santiago',
  title: 'Applied AI engineer',
  tagline: 'A little world. A body of work.',
  about: [
    'This is a working local preview of Trevor\'s Portfolio. The hall, its exhibits, and the Profile share the same sample records so you can try each route through the site.',
    'Imagine a practice project that turns a box of messy notes into a useful search tool. Then imagine the less glamorous work around it: checking inputs, reading failures, and making the result understandable. That is the kind of story this layout is ready to hold.',
    'The content here is fictional. It exists to test reading, navigation, and conversation flows before any professional history is added.',
  ],
  experience: [
    {
      id: 'sample-engineer', title: 'AI engineer', organization: 'Imaginary Field Lab', period: 'Sample dates, 2024 to 2026',
      summary: 'A fictional role building small tools for a team with a very large pile of notes.',
      bullets: ['Designed an example document workflow with checks at each handoff.', 'Compared sample answers against a small, repeatable evaluation set.', 'Worked with fictional teammates to turn an awkward prototype into a usable tool.'],
    },
    {
      id: 'sample-analyst', title: 'Data analyst', organization: 'Placeholder Workshop', period: 'Sample dates, 2022 to 2024',
      summary: 'A fictional earlier role cleaning inconsistent records and explaining what the numbers meant.',
      bullets: ['Repaired a sample pipeline with missing dates and duplicate rows.', 'Built a pretend report that made the underlying assumptions visible.'],
    },
  ],
  projects: [
    {
      id: 'field-notes', title: 'Field notes', featured: true,
      summary: 'A fictional assistant that finds an answer in a stack of research notes and points back to the source.',
      detail: ['The sample problem is simple: notes arrive in different formats, and the useful paragraph is rarely where someone expects it.', 'This pretend implementation separates importing, searching, and answering. Each answer links to its example evidence so a reader can check the wording.', 'This is sample copy for testing a longer case study. There is no deployed product or real result behind these descriptions.'],
      tags: ['Python', 'Search', 'Evaluation'],
    },
    {
      id: 'signal-garden', title: 'Signal garden', featured: true,
      summary: 'A fictional data pipeline that makes questionable records visible before they reach a report.',
      detail: ['A sample batch arrives with repeated identifiers, blank timestamps, and a few values that look too good to be true.', 'The pretend pipeline marks questionable rows, produces a readable validation report, and lets the operator choose what to retry.', 'The case study would eventually include real constraints and measurements. For now, these paragraphs test the page and panel layouts.'],
      tags: ['TypeScript', 'Data pipelines', 'Validation'],
    },
    {
      id: 'small-hours', title: 'Small hours', featured: true,
      summary: 'A fictional interface for inspecting an automated workflow one decision at a time.',
      detail: ['The sample workflow has several steps. An operator needs to see what happened without reading a wall of logs.', 'This pretend interface keeps the input, decision, and output together. Failed steps can be inspected before the operator tries again.', 'The displayed technical choices are fictional placeholders, ready for an actual project story later.'],
      tags: ['Interfaces', 'Tool use', 'Observability'],
    },
    {
      id: 'paper-trail', title: 'Paper trail', featured: false,
      summary: 'A small fictional experiment comparing different ways to label a collection of documents.',
      detail: ['An archive entry can be smaller than a featured case study. This sample keeps the question, approach, and remaining uncertainty in one place.', 'No real project claims or performance numbers are included.'],
      tags: ['Experiment', 'Classification'],
    },
  ],
  skills: ['Python', 'TypeScript', 'Data pipelines', 'LLM evaluation', 'Search', 'Interface design', 'Testing'],
  education: [{ id: 'sample-education', title: 'Example degree in computing', institution: 'Fictional University', period: 'Sample dates', summary: 'Placeholder education record. Replace with reviewed education details before publishing.' }],
  links: { github: '/profile#preview-links', linkedin: '/profile#preview-links', contact: '/profile#contact', resume: '/profile#preview-links' },
};

export type Exhibit = {
  id: string;
  label: string;
  kind: 'about' | 'experience' | 'project' | 'archive' | 'skills' | 'ask';
  projectId?: string;
  x: number;
  y: number;
  radius: number;
};

const featuredPositions = [[400, 425], [365, 745], [1180, 825]] as const;

export function makeExhibits(corpus: Portfolio): Exhibit[] {
  const featured = corpus.projects.filter(project => project.featured);
  if (featured.length !== 3) throw new Error('Portfolio must contain exactly three featured projects for the great hall.');
  return [
    { id: 'about', label: 'About Trevor', kind: 'about', x: 768, y: 390, radius: 130 },
    { id: 'experience', label: 'Experience', kind: 'experience', x: 1130, y: 425, radius: 110 },
    ...featured.map((project, index): Exhibit => ({ id: `project-${project.id}`, label: project.title, kind: 'project', projectId: project.id, x: featuredPositions[index][0], y: featuredPositions[index][1], radius: 110 })),
    { id: 'archive', label: 'Project archive', kind: 'archive', x: 275, y: 510, radius: 110 },
    { id: 'skills', label: 'Skills & education', kind: 'skills', x: 1295, y: 470, radius: 110 },
    { id: 'ask', label: 'Ask about Trevor', kind: 'ask', x: 1180, y: 610, radius: 110 },
  ];
}

/** Run on import so Astro's build rejects malformed content before emitting pages. */
export function validatePortfolio(corpus: Portfolio, manifest?: Exhibit[]): void {
  if (!corpus || typeof corpus !== 'object') throw new Error('Portfolio must be a content object.');
  const requireText = (value: unknown, field: string) => {
    if (typeof value !== 'string' || !value.trim()) throw new Error(`Portfolio is missing required text: ${field}.`);
  };
  const requireList = (value: unknown, field: string) => {
    if (!Array.isArray(value) || !value.length) throw new Error(`Portfolio requires a non-empty list: ${field}.`);
  };
  const ids = new Set<string>();
  for (const field of ['name', 'title', 'tagline'] as const) requireText(corpus[field], field);
  for (const field of ['about', 'skills'] as const) {
    requireList(corpus[field], field);
    corpus[field].forEach((value, index) => requireText(value, `${field}[${index}]`));
  }
  for (const field of ['github', 'linkedin', 'contact', 'resume'] as const) requireText(corpus.links?.[field], `links.${field}`);
  for (const kind of ['experience', 'projects', 'education'] as const) {
    requireList(corpus[kind], kind);
    for (const record of corpus[kind]) {
      if (!record || typeof record !== 'object') throw new Error(`Portfolio contains an invalid ${kind} record.`);
      requireText(record.id, `${kind}.id`);
      if (ids.has(record.id)) throw new Error(`Duplicate Portfolio record identifier: ${record.id}.`);
      ids.add(record.id);
      requireText(record.title, `${record.id}.title`);
      requireText(record.summary, `${record.id}.summary`);
      if ('organization' in record) {
        requireText(record.organization, `${record.id}.organization`);
        requireText(record.period, `${record.id}.period`);
        requireList(record.bullets, `${record.id}.bullets`);
        record.bullets.forEach((value, index) => requireText(value, `${record.id}.bullets[${index}]`));
      }
      if ('institution' in record) {
        requireText(record.institution, `${record.id}.institution`);
        requireText(record.period, `${record.id}.period`);
      }
      if ('featured' in record) {
        if (typeof record.featured !== 'boolean') throw new Error(`${record.id}.featured must be a boolean.`);
        for (const field of ['detail', 'tags'] as const) {
          requireList(record[field], `${record.id}.${field}`);
          record[field].forEach((value, index) => requireText(value, `${record.id}.${field}[${index}]`));
        }
      }
    }
  }
  if (corpus.projects.filter(project => project.featured).length !== 3) throw new Error('Portfolio must contain exactly three featured projects for the great hall.');
  if (!manifest) return;
  const exhibitIds = new Set<string>();
  const projects = new Set(corpus.projects.map(project => project.id));
  const kinds = new Set(['about', 'experience', 'project', 'archive', 'skills', 'ask']);
  for (const exhibit of manifest) {
    if (!exhibit || typeof exhibit !== 'object') throw new Error('Exhibit manifest contains an invalid record.');
    requireText(exhibit.id, 'exhibit.id');
    requireText(exhibit.label, `${exhibit.id}.label`);
    if (exhibitIds.has(exhibit.id)) throw new Error(`Duplicate Exhibit identifier: ${exhibit.id}.`);
    exhibitIds.add(exhibit.id);
    if (!kinds.has(exhibit.kind)) throw new Error(`Invalid Exhibit kind: ${exhibit.id}.`);
    if (!Number.isFinite(exhibit.x) || !Number.isFinite(exhibit.y) || !Number.isFinite(exhibit.radius) || exhibit.radius <= 0) throw new Error(`Invalid Exhibit position or radius: ${exhibit.id}.`);
    if (exhibit.kind === 'project' && (!exhibit.projectId || !projects.has(exhibit.projectId))) throw new Error(`Exhibit ${exhibit.id} references a missing project: ${exhibit.projectId ?? '(none)'}.`);
  }
  const linkedProjects = manifest.filter(exhibit => exhibit.kind === 'project').map(exhibit => exhibit.projectId);
  const featured = corpus.projects.filter(project => project.featured).map(project => project.id);
  if (linkedProjects.length !== 3 || new Set(linkedProjects).size !== 3 || featured.some(id => !linkedProjects.includes(id))) throw new Error('Exhibit manifest must reference each of the three featured projects exactly once.');
}

validatePortfolio(portfolio);
export const exhibits = makeExhibits(portfolio);
validatePortfolio(portfolio, exhibits);
export const getExhibit = (id: string): Exhibit | undefined => exhibits.find(exhibit => exhibit.id === id);
