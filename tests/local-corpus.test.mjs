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
  assert.throws(() => validatePortfolio(missing), /field-notes.summary/);
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

test('project demo answers cite the matching local evidence and label it fictional', () => {
  const answer = getDemoAnswer('Tell me about Field notes');
  assert.match(answer.text, /fictional sample content/);
  assert.match(answer.text, /stack of research notes/);
  assert.deepEqual(answer.citations, [{ label: 'Field notes', href: '/profile/#field-notes' }]);
});

test('a follow-up uses only the in-memory project conversation', () => {
  const first = getDemoAnswer('Tell me about Signal garden');
  const followUp = getDemoAnswer('Tell me more', [{ role: 'assistant', ...first }]);
  assert.deepEqual(followUp.citations, [{ label: 'Signal garden', href: '/profile/#signal-garden' }]);
  assert.deepEqual(getDemoAnswer('Tell me more').citations, []);
});

test('unrelated questions have no invented facts or evidence', () => {
  const answer = getDemoAnswer('Who won a tennis tournament yesterday?');
  assert.match(answer.text, /no evidence for that question/);
  assert.deepEqual(answer.citations, []);
});

test('job fit preview refuses a real assessment of fictional records', () => {
  const answer = getDemoAnswer('Assess fit for this job description: Python engineer');
  assert.match(answer.text, /cannot assess job fit or preferences/);
  assert.match(answer.text, /fictional/);
  assert.equal(answer.citations.length, 2);
});
