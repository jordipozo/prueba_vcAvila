---
name: conventional-commits
description: >-
  Prepare well-structured git commits following the Conventional Commits
  specification. Use this skill when the user asks to prepare a commit,
  make a commit, do a commit, write a commit message, or anything similar
  about committing changes. It helps review unstaged changes, separate
  unrelated concerns into multiple commits, choose the right commit type,
  and write a clear, structured commit message.
---

# Conventional Commits Skill

This skill helps you prepare git commits that follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. A consistent commit history makes it easier to generate changelogs, automate releases, and understand what changed and why.

## Workflow

Follow these steps in order when the user asks you to prepare a commit.

### 1. Review the current state

Run `git status` and `git diff` (or `git diff --cached` if files are already staged) to understand what has changed.

Look at each modified file and summarize:
- What files were added, modified, or deleted
- What each change does at a high level

### 2. Identify unrelated changes

If the diff contains multiple logical changes that serve different purposes (e.g., a bugfix mixed with a refactor), point this out to the user. Explain what each group of changes does and suggest making separate commits.

Wait for the user to confirm before proceeding. They may want a single commit anyway.

### 3. Choose the commit type

Based on the changes, pick the most appropriate type:

| Type       | When to use                                                |
|------------|------------------------------------------------------------|
| `feat`     | A new feature for the user                                 |
| `fix`      | A bug fix                                                  |
| `docs`     | Documentation only changes                                 |
| `style`    | Formatting, missing semicolons, etc (no code change)       |
| `refactor` | Code change that neither fixes a bug nor adds a feature    |
| `perf`     | Code change that improves performance                      |
| `test`     | Adding or correcting tests                                 |
| `build`    | Changes to the build system or dependencies                |
| `ci`       | Changes to CI configuration files and scripts              |
| `chore`    | Other changes that don't modify src or test files          |
| `revert`   | Reverts a previous commit                                  |

If no type fits perfectly, `chore` is a safe fallback for maintenance work that doesn't fit other categories.

### 4. Write the commit message

Use the format:

```
<type>(<scope>): <short summary>

<body>
```

**Rules:**
- **type** must be one of the types above, in lowercase
- **scope** is optional — use it when the change affects a specific module, component, or area (e.g., `feat(auth)`, `fix(api)`). Omit it if the change is project-wide or doesn't have a clear scope.
- **summary** is imperative, present tense, lowercase, no period at the end. Keep it under 72 characters.
- **body** explains the *why*, not the *what*. Describe motivation and context. Wrap at 72 characters. Leave a blank line after the summary. If the change is self-explanatory, the body is optional.

### 5. Propose the command

Present the final `git commit` command(s) to the user with the message already written. Use `-m` for single-line messages or a heredoc for multi-line messages.

**Single-line example:**
```
git commit -m "fix(auth): prevent infinite redirect on invalid token"
```

**Multi-line example:**
```
git commit -m "feat(api): add pagination to user list endpoint" -m "The /users endpoint now supports ?page and ?limit query parameters. Defaults to page 1 with 20 items per page."
```

If you suggested splitting into multiple commits, present them in the order they should be applied.

## Important reminders

- Only include files that were modified in this session. Do not stage unrelated files.
- If there are no changes to commit, tell the user before doing anything else.
- The `git commit` command should be the final output — the user will run it themselves.
