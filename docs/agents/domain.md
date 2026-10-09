# Domain docs

This repository uses a single-context domain layout.

## Before exploring

Read these files when they exist:

- `CONTEXT.md` at the repository root
- Relevant ADRs under `docs/adr/`

If a file or directory does not exist, continue without flagging its absence. The `domain-modeling` skill creates domain documentation when the project resolves terms or decisions.

## File structure

```text
/
├── CONTEXT.md
├── docs/
│   └── adr/
└── src/
```

## Use glossary terms

Use the terms defined in `CONTEXT.md` when naming domain concepts in issues, refactoring proposals, hypotheses, and tests.

If a needed concept is missing, first check whether the proposed term matches language already used in the project. Record genuine vocabulary gaps for the `domain-modeling` skill.

## Flag ADR conflicts

Call out any proposal that conflicts with an existing ADR. Name the ADR and explain why revisiting the decision may be warranted.
