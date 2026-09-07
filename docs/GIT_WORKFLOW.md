# Git Workflow — Kabadiwala Connect

## Branches

- `main`: stable/release code
- `develop`: team integration branch
- `feature/<name>`: new functionality
- `fix/<name>`: bug fixes
- `docs/<name>`: documentation-only changes

## Standard workflow

```bash
git checkout develop
git pull origin develop
git checkout -b feature/<name>
```

Work and test locally, then:

```bash
git status
git add .
git commit -m "Add <description>"
git push -u origin feature/<name>
```

Create a Pull Request from the feature branch into `develop`.

## Before PR

```bash
npm run lint
npm run build
git status
```

Confirm there are no secrets or generated folders staged.

## Never commit

```text
.env
.env.local
.env.production
node_modules/
dist/
build/
coverage/
*.log
```

Commit `.env.example`.

## Commit style

Use imperative, specific messages:

```text
Add collector availability API
Fix active pickup status transition
Update API endpoint documentation
```

Avoid vague messages such as `changes`, `final`, or `update`.

## Pull Requests

A PR should explain:

1. What changed
2. Why it changed
3. How it was tested
4. Any API/database changes
5. Any known limitations

If the API contract changed, update `docs/API_ENDPOINTS.md` in the same PR.

If significant project structure or functionality changed, update `project-context.json` in the same PR.
