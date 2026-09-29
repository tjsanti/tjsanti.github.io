# Issue tracker: GitHub

Issues and specs for this repository live as GitHub issues. Use the `gh` CLI for all operations.

## Conventions

- Create an issue with `gh issue create --title "..." --body "..."`. Use a heredoc for multiline bodies.
- Read an issue with `gh issue view <number> --comments`. Fetch its labels and use `jq` when comments need filtering.
- List issues with `gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'`. Add suitable `--label` and `--state` filters.
- Comment with `gh issue comment <number> --body "..."`.
- Apply or remove labels with `gh issue edit <number> --add-label "..."` or `--remove-label "..."`.
- Close an issue with `gh issue close <number> --comment "..."`.

Run commands inside the clone so `gh` can infer the repository from the Git remote.

## Pull requests as a triage source

**PRs as a request surface: no.**

Set this to `yes` if the repository later treats external pull requests as feature requests. The `triage` skill reads this flag.

When set to `yes`, process pull requests with the same labels and states as issues:

- Read a pull request with `gh pr view <number> --comments` and inspect its changes with `gh pr diff <number>`.
- List external pull requests with `gh pr list --state open --json number,title,body,labels,author,authorAssociation,comments`. Keep authors whose association is `CONTRIBUTOR`, `FIRST_TIME_CONTRIBUTOR`, or `NONE`.
- Comment, label, and close with `gh pr comment`, `gh pr edit`, and `gh pr close`.

GitHub shares one number sequence across issues and pull requests. For a bare reference such as `#42`, try `gh pr view 42` and fall back to `gh issue view 42`.

## Skill instructions

When a skill says "publish to the issue tracker," create a GitHub issue.

When a skill says "fetch the relevant ticket," run `gh issue view <number> --comments`.

## Wayfinding operations

The `wayfinder` skill uses one issue as a map and links child issues as tickets.

- Label the map issue `wayfinder:map`. Its body holds Notes, Decisions-so-far, and Fog.
- Link tickets as GitHub sub-issues. If sub-issues are unavailable, add each child to a task list in the map and put `Part of #<map>` at the top of the child.
- Label each child `wayfinder:<type>`, where the type is `research`, `prototype`, `grilling`, or `task`.
- Represent blocking relationships with GitHub's native issue dependencies. If those are unavailable, put `Blocked by: #<n>, #<n>` at the top of the child.
- To find the next ticket, list the map's open children and discard assigned or blocked issues. The first remaining issue in map order wins.
- Claim a ticket with `gh issue edit <n> --add-assignee @me`.
- Resolve a ticket by commenting with the answer, closing it, and adding a context link to the map's Decisions-so-far section.
