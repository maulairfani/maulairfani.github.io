# irfani.me

Personal site of Maula Irfani (AI/ML engineer, Jakarta). Not a CV: a clean landing page plus a growing list of interactive learning artifacts.

## Stack

Astro 7 (static output) + React 19 + Tailwind 4 (via `@tailwindcss/vite`). Node >= 22.23.4. Deployed to GitHub Pages at https://irfani.me.

## Commands

- `npm run dev` / `astro dev --background` to run locally (http://localhost:4321). Manage with `astro dev status|logs|stop`.
- `npm run build` must pass before committing.

## Structure

- `src/pages/index.astro`: landing page (intro + artifact list).
- `src/data/artifacts.ts`: registry that feeds the landing page list. Add an entry for every new artifact.
- `src/pages/artifacts/<slug>.astro`: route for an artifact (`/artifacts/<slug>/`).
- `src/components/artifacts/<Name>.tsx`: the React component for that artifact.
- `public/CNAME`: custom domain. Never delete it.

## Artifacts

Artifacts exist so the author can learn a topic interactively; they are public notes, not polished products.

- Write all artifact text in simple English: short sentences, common words, no jargon without a quick explanation.
- Teach in small bites: one idea per section, explained with tiny, concrete numbers before any formula.
- Add interactive widgets only where they make the idea clearer than text would. Add short quizzes to check understanding.
- Large topics are split into several focused artifacts rather than one long page.
- Credit sources at the bottom of every artifact with the shared `src/components/Sources.astro` component (pass `items` with `title`, `url`, and optional `author` and `note`). Do not write source credits by hand.
- Artifacts are static React: no `window.claude`, no `window.storage`, no API calls. Use `localStorage` if state must persist.
- Look: clean and plain. No decoration for its own sake. Use a library only when it clearly improves the learning experience.

## Git

- `main` deploys to production on push (GitHub Actions). Do not push to `main` without being asked.
- Tag `v1-archive` (and branch `archive`) hold the previous site.
- Commit messages: short imperative subject.
