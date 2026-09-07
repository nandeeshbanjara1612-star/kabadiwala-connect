# Kabadiwala Connect

Kabadiwala Connect is a React + TypeScript collector dashboard with an Express API prototype for managing scrap pickup requests, active pickups, waste passports, transactions, notifications, collector availability, profile data, and location reporting.

## Current Project Status

**Development / prototype stage.** The frontend and REST API flow are implemented, but the current server uses in-memory data stores. Data is lost when the server restarts. Before production use, replace the in-memory stores with a persistent database and implement production-grade authentication, authorization, validation, and security controls.

## Tech Stack

- React 19
- TypeScript
- Vite
- Express
- Tailwind CSS
- Lucide React
- Motion
- Google GenAI SDK
- Node.js

## Project Structure

```text
src/
  api/                  API client and endpoint modules
  components/           Reusable UI components
  context/              Authentication and dashboard state
  App.tsx               Application root
  main.tsx              Frontend entry point
  types.ts              Shared TypeScript types
public/                 Static assets
docs/
  API_ENDPOINTS.md      Frontend/backend API contract
server.ts               Express API server
project-context.json    Project state and development context
.env.example            Safe environment-variable template
.gitignore              Git ignore rules
```

## Prerequisites

- Node.js 20+ recommended
- npm
- Git

Check your versions:

```bash
node --version
npm --version
git --version
```

## Setup

Clone the repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd kabadiwala-connect
```

Install dependencies:

```bash
npm install
```

Create your local environment file.

### macOS / Linux / Git Bash

```bash
cp .env.example .env.local
```

### Windows PowerShell

```powershell
Copy-Item .env.example .env.local
```

Edit `.env.local` and add your own local values. **Never commit `.env.local` or any file containing secrets.**

## Run Locally

Start the development server:

```bash
npm run dev
```

The project uses the Express server as the development entry point. The server hosts the application/API according to the current configuration.

## Validation Before Pushing

Run these before creating a pull request:

```bash
npm run lint
npm run build
```

If either command fails, fix the issue before pushing your branch.

## Environment Variables

The required variables are documented in `.env.example`.

- `GEMINI_API_KEY` — API key used for Gemini integrations when applicable.
- `APP_URL` — Application URL used for application/self-referential configuration.

Use `.env.local` for local development. Never commit real keys.

## API Documentation

The frontend/backend contract is documented in:

```text
docs/API_ENDPOINTS.md
```

When an endpoint is added, removed, renamed, or its request/response shape changes, update this document in the same pull request.

## Backend Notes

The current `server.ts` implementation uses in-memory Maps for application data. This is suitable for development/demo work only.

Before production:

1. Add a persistent database.
2. Add proper password/OTP authentication as required by the product.
3. Store passwords only as secure password hashes when passwords are used.
4. Replace development token handling with secure production authentication/session handling.
5. Add authorization checks for every protected resource.
6. Validate and sanitize request bodies and parameters.
7. Add rate limiting and appropriate security headers.
8. Add centralized error handling and structured logging.
9. Add automated tests for API and critical UI flows.
10. Add database migrations and seed strategy if required.

## Git Workflow

Use this workflow for team development:

```text
main        -> stable/release branch
  ^
develop     -> team integration branch
  ^
feature/*   -> individual work
```

Do not work directly on `main` or `develop` unless the team lead explicitly asks you to.

### Create a feature branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/<short-description>
```

### Save your work

```bash
git status
git add .
git commit -m "Add <short description>"
```

### Push your branch

```bash
git push -u origin feature/<short-description>
```

Then open a Pull Request into `develop`.

### Before starting new work

Always update your local branch first:

```bash
git checkout develop
git pull origin develop
```

## Commit Message Rules

Use short, meaningful commit messages.

Good:

```text
Add pickup acceptance flow
Fix collector dashboard metrics
Update pickup API documentation
Add database repository layer
```

Avoid:

```text
changes
final
update
new
asdf
```

## Files That Must Not Be Committed

Never commit:

```text
node_modules/
dist/
build/
coverage/
.env
.env.local
.env.production
*.log
```

`.env.example` **should be committed** because it documents required environment variables without containing real secrets.

## Team Rules

1. One feature/fix per branch.
2. Do not push directly to `main`.
3. Pull the latest `develop` before starting work.
4. Keep commits small and meaningful.
5. Run `npm run lint` and `npm run build` before opening a PR.
6. Do not commit secrets or generated dependency folders.
7. Update `docs/API_ENDPOINTS.md` whenever the API contract changes.
8. Keep `project-context.json` updated when significant project work is completed.
9. Do not silently change another developer's feature or shared API contract.
10. Resolve merge conflicts carefully and test after resolving them.

## Important Development Rule

The frontend should consume the API through the modules in `src/api/`. Avoid placing direct API calls throughout UI components. Keep shared types in `src/types.ts` and shared state in the appropriate context modules.

## Project Context

`project-context.json` is maintained as the project's current development context. When completing a work item, update the current state, project structure, newly added/updated files, API/database requirements, and known issues as appropriate.
