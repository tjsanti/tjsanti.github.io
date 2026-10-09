/** Approved Portfolio content, reviewed by Trevor through October 5, 2026. */
export const previewNotice = 'Explore the work in the Profile or Game. AI Q&A is under construction.';

export interface Credential { id: string; title: string; organization: string; period: string }

export interface Portfolio {
  name: string;
  title: string;
  tagline: string;
  location: string;
  workAuthorization: string;
  languages: string[];
  preferences: string[];
  about: string[];
  experience: { id: string; title: string; organization: string; period: string; summary: string; bullets: string[] }[];
  projects: { id: string; title: string; aliases?: string[]; repository?: string; organization: string; summary: string; detail: string[]; tags: string[]; featured: boolean }[];
  skills: string[];
  education: { id: string; title: string; institution: string; period: string; summary: string }[];
  certifications: Credential[];
  recognition: Credential[];
  links: { github: string; linkedin: string; contact: string; resume: string | null };
}

export const portfolio: Portfolio = {
  "name": "Trevor Santiago",
  "title": "Applied AI engineer",
  "tagline": "I build AI applications that turn messy data into useful tools.",
  "location": "Sacramento, California",
  "workAuthorization": "US citizen, no sponsorship required.",
  "languages": [
    "English, fluent/native"
  ],
  "preferences": [
    "US remote work preferred. Open to relocation for hybrid work in the San Francisco Bay Area or San Diego."
  ],
  "about": [
    "I'm Trevor Santiago, a data scientist at ALLDATA building AI applications and data workflows. My recent work includes Gemini-powered services, semantic retrieval, and tools that help subject-matter experts reuse prior edits and review AI-generated drafts.",
    "I like taking an unclear problem through research, prototyping, and implementation. At ALLDATA, that has meant working directly with subject-matter experts, building FastAPI services on Google Cloud, and checking model output against the cases those experts care about.",
    "Outside work, I built NormFlow, a text-normalization workbench that combines exact matching, semantic retrieval, and optional LLM suggestions with batch processing and human review."
  ],
  "experience": [
    {
      "id": "alldata",
      "title": "Data Scientist",
      "organization": "ALLDATA · Elk Grove, California",
      "period": "November 2021 to present",
      "summary": "Build AI services, human review workflows, and cloud data pipelines.",
      "bullets": [
        "Built the Repair Trends AI service with FastAPI, Cloud Run, Gemini through Vertex AI, and an AlloyDB cache that regenerates results when upstream component inputs change. The beta/staging rollout is complete.",
        "Independently built a Probable Cause Data editing system that fills text edits from a library of previously applied edits using progressive matching. When no match is found, it uses a separately fine-tuned Flan-T5 Small model to generate a new draft edit.",
        "Fine-tuned the generation model with QLoRA and evaluated it with BLEU separately from the editing workflow. The primary SME estimated that the overall system reduced total editing effort by at least 50%.",
        "Owned the Known Fixes pipeline for billions of dealership repair-order records, using Gemini with web-search grounding to standardize free-text part descriptions before ACES mapping.",
        "Combined repair-order data with SME-curated Probable Causes, applied related-vehicle rules, and automated monthly Known Fixes publishing with BigQuery, Cloud Run Jobs, Airflow, and AlloyDB. Known Fixes is a core feature of Diagnostic Intelligence, which reached 1,700+ subscriptions in its first three months."
      ]
    },
    {
      "id": "new-york-mets",
      "title": "Data Science Intern",
      "organization": "New York Mets",
      "period": "January 2021 to August 2021",
      "summary": "Built predictive-model components and venue features for a larger outfield-alignment system.",
      "bullets": [
        "Owned an XGBoost hit-outcome classifier within a multi-model system designed to maximize expected outs for batter and pitcher matchups.",
        "Trained and evaluated the classifier using separate historical training, evaluation, and held-out test sets.",
        "Standardized wall geometry for every MLB venue with interpolation and spline fitting, estimating distance from home plate at one-degree increments."
      ]
    }
  ],
  "projects": [
    {
      "id": "normflow",
      "title": "NormFlow",
      "organization": "Independent project",
      "featured": true,
      "summary": "A text-normalization workbench with exact matching, semantic retrieval, optional LLM fallback, and human review.",
      "detail": [
        "I built and shipped NormFlow using Python, FastAPI, TypeScript, SQLite, and FAISS. It combines exact matching and semantic retrieval with optional LLM fallback.",
        "Durable batch, review, and export workflows keep human review and correction within the process of turning raw text into reusable normalized data."
      ],
      "tags": [
        "Python",
        "FastAPI",
        "TypeScript",
        "SQLite",
        "FAISS",
        "Semantic retrieval",
        "Human review"
      ],
      "repository": "https://github.com/tjsanti/NormFlow"
    },
    {
      "id": "probable-cause-editing",
      "title": "AI-assisted PCD editing",
      "aliases": [
        "PCD",
        "Probable Cause Data",
        "probable cause editing"
      ],
      "organization": "ALLDATA",
      "featured": true,
      "summary": "An editing workflow that fills from previously applied edits, then uses a separately fine-tuned model to generate new draft edits when matching finds no reusable edit.",
      "detail": [
        "Probable Cause Data editing turns parsed OEM repair text into curated probable causes. Subject-matter experts used an Excel macro and a library mapping source text to previously applied edits. Its limited matching left unmatched text for manual drafting.",
        "I built a workflow that looks for each input in that library, progressing through exact, case-insensitive, whitespace-normalized, formatting-normalized, and semantic matching. A match fills the corresponding prior edit into the output. Normalization preserves symbols with automotive meaning and exposes conflicting library mappings for expert review.",
        "Inputs without a reusable match go to a separate generation step. This step uses a fine-tuned Flan-T5 Small model to generate new draft edits.",
        "Matching and generation run as separate Cloud Run Jobs connected by Cloud Storage upload events. I also built a simple upload/download UI for non-technical experts. I designed and implemented the system independently apart from the UI's Kubernetes deployment, which a DevOps engineer owned.",
        "The primary subject-matter expert estimated at least a 50% reduction in total editing effort."
      ],
      "tags": [
        "Python",
        "Semantic retrieval",
        "Flan-T5",
        "QLoRA",
        "BLEU",
        "Cloud Run Jobs",
        "Cloud Storage"
      ]
    },
    {
      "id": "repair-trends",
      "title": "Repair Trends AI service",
      "aliases": [
        "Repair Trends"
      ],
      "organization": "ALLDATA",
      "featured": true,
      "summary": "A Gemini-powered service that supplements repair-order observations with component-failure suggestions for a vehicle and mileage range.",
      "detail": [
        "Repair Trends helps technicians identify components likely to fail and cause an unscheduled repair within a requested mileage range. The upstream repair-order data had coverage gaps and could include scheduled-wear or collision-related replacements.",
        "I independently built and deployed the AI service using FastAPI on Cloud Run and Gemini through Vertex AI. Teammates owned the upstream cleaning pipeline and querying API.",
        "The service uses aggregated repair-order observations as grounding to rerank components, revise probabilities, and suggest missing components. It accounts for scheduled-wear and collision-related biases and generates suggestions when the upstream component list is empty.",
        "An AlloyDB cache reuses responses for repeated vehicle, mileage, and component inputs. When the upstream component list changes, the service regenerates and replaces the cached response.",
        "Direct data covered 80 of 100 expert-selected vehicle and mileage test cases. The service produced AI-assisted output for all 100 when available, including the 20 without underlying observations. Subject-matter experts reviewed every case. This is test-set coverage, not an accuracy measurement.",
        "The beta/staging rollout is complete as of October 2026."
      ],
      "tags": [
        "Python",
        "FastAPI",
        "Gemini",
        "Vertex AI",
        "Cloud Run",
        "AlloyDB",
        "Caching"
      ]
    },
    {
      "id": "known-fixes",
      "title": "Known Fixes",
      "organization": "ALLDATA",
      "featured": false,
      "summary": "A repair-intelligence pipeline combining dealership repair orders and expert-curated probable causes to rank parts associated with diagnostic trouble codes.",
      "detail": [
        "I owned the pipeline for a third-party dataset containing billions of dealership repair-order records. I used Gemini with web-search grounding to standardize part descriptions before ACES mapping. Inputs included vehicle details, part numbers, and mechanic descriptions.",
        "I combined repair-order data with expert-curated Probable Causes in BigQuery and applied expert-defined related-vehicle rules to extend coverage. A teammate owned the Probable Causes pipeline.",
        "I deployed Cloud Run Jobs and created Airflow DAGs to orchestrate monthly publishing to AlloyDB. My work also included contributions to prompting and structured-output validation, with repeated subject-matter expert reviews.",
        "Known Fixes launched as a core Diagnostic Intelligence feature. Diagnostic Intelligence reached 1,700+ subscriptions in its first three months."
      ],
      "tags": [
        "Python",
        "SQL",
        "Gemini",
        "BigQuery",
        "Cloud Run Jobs",
        "Airflow",
        "AlloyDB"
      ]
    },
    {
      "id": "mets-outfield-modeling",
      "title": "Mets outfield-alignment modeling",
      "aliases": [
        "Mets outfield",
        "ballpark geometry"
      ],
      "organization": "New York Mets",
      "featured": false,
      "summary": "An XGBoost hit-outcome classifier and standardized ballpark geometry for matchup-specific outfield alignment.",
      "detail": [
        "During my internship, I owned an XGBoost hit-outcome classifier within a larger multi-model outfield-alignment system designed to maximize expected outs for batter and pitcher matchups. I also contributed matchup-outcome distribution work.",
        "I trained and evaluated the classifier on separate historical training, evaluation, and held-out test sets.",
        "I used interpolation and spline fitting to standardize wall geometry for every MLB venue, estimating distance from home plate at one-degree increments from foul pole to foul pole."
      ],
      "tags": [
        "Python",
        "XGBoost",
        "Classification",
        "Feature engineering",
        "Interpolation"
      ]
    },
    {
      "id": "find-a-fix",
      "title": "Find a Fix data pipeline",
      "aliases": [
        "Find a Fix"
      ],
      "organization": "ALLDATA · Retired project",
      "featured": false,
      "summary": "BigQuery and Dataform pipelines over millions of retail-sales, lookup, and scan records for a legacy repair-ranking product.",
      "detail": [
        "I built BigQuery and Dataform pipelines over millions of retail-sales, lookup, and scan records for Find a Fix, the repair-ranking product that preceded Known Fixes.",
        "I also deployed a Cloud Run process exporting results to CSV in Cloud Storage for Solr indexing and API updates.",
        "Find a Fix and this pipeline are retired. This record describes earlier data-engineering work, not a currently active system."
      ],
      "tags": [
        "SQL",
        "BigQuery",
        "Dataform",
        "Cloud Run",
        "Cloud Storage",
        "Solr"
      ]
    }
  ],
  "skills": [
    "Python",
    "SQL",
    "LLM applications",
    "Semantic retrieval",
    "Prompt engineering",
    "Data pipelines",
    "FastAPI",
    "Flask",
    "Docker",
    "TypeScript",
    "SQLite",
    "scikit-learn",
    "XGBoost",
    "Pandas",
    "NumPy",
    "FAISS",
    "AlloyDB / PostgreSQL",
    "BigQuery",
    "Dataform",
    "Airflow",
    "Vertex AI",
    "Cloud Run",
    "Cloud Functions",
    "Cloud Storage",
    "Solr",
    "Claude Code",
    "Codex",
    "Vercel"
  ],
  "education": [
    {
      "id": "usf-data-science",
      "title": "M.S. in Data Science",
      "institution": "University of San Francisco",
      "period": "August 2020 to August 2021",
      "summary": "Selected coursework: machine learning, deep learning, databases, distributed computing, and design of experiments."
    },
    {
      "id": "ucsb-mathematics",
      "title": "B.S. in Mathematical Sciences",
      "institution": "University of California, Santa Barbara",
      "period": "July 2016 to June 2020",
      "summary": "Minor in Statistical Science. Selected coursework: linear algebra, probability, stochastic processes, operations research, and linear regression."
    }
  ],
  "certifications": [
    {
      "id": "hf-llms",
      "title": "Fundamentals of LLMs",
      "organization": "Hugging Face",
      "period": "June 2025"
    },
    {
      "id": "langchain-data",
      "title": "LangChain Chat with Your Data",
      "organization": "DeepLearning.AI",
      "period": "May 2025"
    },
    {
      "id": "langchain-apps",
      "title": "LangChain for LLM Application Development",
      "organization": "DeepLearning.AI",
      "period": "May 2025"
    },
    {
      "id": "data-engineering-bootcamp",
      "title": "Free Data Engineering Bootcamp Certificate",
      "organization": "DataExpert.io",
      "period": "January 2025"
    },
    {
      "id": "gcp-fundamentals",
      "title": "Google Cloud Fundamentals: Core Infrastructure",
      "organization": "Google",
      "period": "November 2023"
    }
  ],
  "recognition": [
    {
      "id": "extra-miler",
      "title": "Extra Miler of the Year",
      "organization": "ALLDATA",
      "period": "2023"
    }
  ],
  "links": {
    "github": "https://github.com/tjsanti/",
    "linkedin": "https://www.linkedin.com/in/trevor-santiago",
    "contact": "mailto:trevorjsantiago1@gmail.com",
    "resume": null
  }
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
  for (const field of ['name', 'title', 'tagline', 'location', 'workAuthorization'] as const) requireText(corpus[field], field);
  for (const field of ['about', 'skills', 'languages', 'preferences'] as const) {
    requireList(corpus[field], field);
    corpus[field].forEach((value, index) => requireText(value, `${field}[${index}]`));
  }
  for (const field of ['github', 'linkedin', 'contact'] as const) requireText(corpus.links?.[field], `links.${field}`);
  if (corpus.links.resume !== null) requireText(corpus.links.resume, 'links.resume');
  for (const kind of ['experience', 'projects', 'education', 'certifications', 'recognition'] as const) {
    requireList(corpus[kind], kind);
    for (const record of corpus[kind]) {
      if (!record || typeof record !== 'object') throw new Error(`Portfolio contains an invalid ${kind} record.`);
      requireText(record.id, `${kind}.id`);
      if (ids.has(record.id)) throw new Error(`Duplicate Portfolio record identifier: ${record.id}.`);
      ids.add(record.id);
      requireText(record.title, `${record.id}.title`);
      if (kind === 'experience' || kind === 'projects' || kind === 'education') requireText('summary' in record ? record.summary : undefined, `${record.id}.summary`);
      if (kind !== 'projects') requireText('period' in record ? record.period : undefined, `${record.id}.period`);
      if (kind !== 'education') requireText('organization' in record ? record.organization : undefined, `${record.id}.organization`);
      if ('bullets' in record) {
        requireList(record.bullets, `${record.id}.bullets`);
        record.bullets.forEach((value, index) => requireText(value, `${record.id}.bullets[${index}]`));
      }
      if ('institution' in record) {
        requireText(record.institution, `${record.id}.institution`);
        requireText(record.period, `${record.id}.period`);
      }
      if ('featured' in record) {
        if (typeof record.featured !== 'boolean') throw new Error(`${record.id}.featured must be a boolean.`);
        if (record.repository !== undefined) requireText(record.repository, `${record.id}.repository`);
        if (record.aliases !== undefined) {
          requireList(record.aliases, `${record.id}.aliases`);
          record.aliases.forEach((value, index) => requireText(value, `${record.id}.aliases[${index}]`));
        }
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
