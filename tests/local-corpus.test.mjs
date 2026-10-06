import assert from 'node:assert/strict';
import test from 'node:test';
import { portfolio, exhibits, makeExhibits, validatePortfolio } from '../src/data/portfolio.ts';
import { getDemoAnswer } from '../src/scripts/ask.ts';

test('the local corpus generates eight exhibits and derives featured project references', () => {
  assert.doesNotThrow(() => validatePortfolio(portfolio, exhibits));
  assert.equal(exhibits.length, 8);
  const changed = structuredClone(portfolio);
  changed.projects[0].id = 'renamed-study';
  assert.equal(makeExhibits(changed).find(exhibit => exhibit.kind === 'project').projectId, 'renamed-study');
});

test('duplicate corpus IDs and missing required content fail validation', () => {
  const duplicate = structuredClone(portfolio);
  duplicate.projects[0].id = duplicate.experience[0].id;
  assert.throws(() => validatePortfolio(duplicate), /Duplicate Portfolio record identifier/);
  const missing = structuredClone(portfolio);
  missing.projects[0].summary = '  ';
  assert.throws(() => validatePortfolio(missing), /normflow.summary/);
  const credential = structuredClone(portfolio);
  delete credential.certifications[0].period;
  assert.throws(() => validatePortfolio(credential), /hf-llms.period/);
  credential.certifications[0].period = 'June 2025';
  delete credential.certifications[0].organization;
  assert.throws(() => validatePortfolio(credential), /hf-llms.organization/);
});

test('broken and duplicate exhibit references fail validation', () => {
  const broken = structuredClone(exhibits);
  broken.find(exhibit => exhibit.kind === 'project').projectId = 'absent-project';
  assert.throws(() => validatePortfolio(portfolio, broken), /references a missing project/);
  const duplicate = structuredClone(exhibits);
  duplicate[1].id = duplicate[0].id;
  assert.throws(() => validatePortfolio(portfolio, duplicate), /Duplicate Exhibit identifier/);
});

test('a featured selection must contain exactly three projects', () => {
  const changed = structuredClone(portfolio);
  changed.projects[3].featured = true;
  assert.throws(() => validatePortfolio(changed), /exactly three featured projects/);
  assert.throws(() => makeExhibits(changed), /exactly three featured projects/);
});

test('project demo answers cite reviewed evidence without fictional claims', () => {
  const answer = getDemoAnswer('Tell me about NormFlow');
  assert.match(answer.text, /reviewed Portfolio content/);
  assert.match(answer.text, /FAISS/);
  assert.doesNotMatch(answer.text, /fictional|sample content/);
  assert.deepEqual(answer.citations, [{ label: 'NormFlow', href: '/profile/#normflow' }]);
});

test('a follow-up uses only the in-memory project conversation', () => {
  const first = getDemoAnswer('Tell me about Repair Trends');
  const followUp = getDemoAnswer('Tell me more', [{ role: 'assistant', ...first }]);
  assert.deepEqual(followUp.citations, [{ label: 'Repair Trends AI service', href: '/profile/#repair-trends' }]);
  assert.deepEqual(getDemoAnswer('Tell me more').citations, []);
});

test('unrelated questions have no invented facts or evidence', () => {
  const answer = getDemoAnswer('Who won a tennis tournament yesterday?');
  assert.match(answer.text, /no evidence for that question/);
  assert.deepEqual(answer.citations, []);
});

test('job fit preview refuses an assessment even when the description names a project', () => {
  const answer = getDemoAnswer('Assess fit for this job description: Python engineer, NormFlow');
  assert.match(answer.text, /cannot assess job fit/);
  assert.doesNotMatch(answer.text, /fictional/);
  assert.equal(answer.citations.length, 2);
});

test('PCD replies preserve the matching then generation flow and attributed outcome', () => {
  const answer = getDemoAnswer('How does PCD editing work?');
  assert.match(answer.text, /A match fills the corresponding prior edit/);
  assert.match(answer.text, /Inputs without a reusable match go to a separate generation step/);
  assert.match(answer.text, /a fine-tuned Flan-T5 Small model/);
  assert.match(answer.text, /primary subject-matter expert estimated at least a 50% reduction/);
  assert.equal(answer.citations[0].href, '/profile/#probable-cause-editing');
});

test('project outcomes reflect the beta rollout, product subscriptions, and retired status', () => {
  const trends = getDemoAnswer('What is Repair Trends?');
  assert.match(trends.text, /coverage, not an accuracy measurement/);
  assert.match(trends.text, /beta\/staging rollout is complete/i);
  assert.match(getDemoAnswer('What is Known Fixes?').text, /Diagnostic Intelligence reached 1,700\+ subscriptions/);
  assert.match(getDemoAnswer('What is Find a Fix?').text, /pipeline are retired/);
});

test('credentials and preferences cite records available in the Profile', () => {
  const credentials = getDemoAnswer('What certifications does Trevor have?');
  assert.match(credentials.text, /Hugging Face/);
  assert.deepEqual(credentials.citations.map(item => item.href), ['/profile/#certifications', '/profile/#recognition']);
  const preferences = getDemoAnswer('Does Trevor prefer remote work?');
  assert.match(preferences.text, /US remote work preferred/);
  assert.equal(preferences.citations[0].href, '/profile/#work-preferences');
});
