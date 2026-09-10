# Gia Bao — Java Backend Portfolio

Static portfolio for Pham Ngoc Gia Bao, built with plain HTML, CSS and
JavaScript.

## Positioning

The site is designed primarily for recruiters hiring Java Backend Intern or
Fresher candidates. It leads with Spring Boot, PostgreSQL and workflow
reliability, then supports that positioning with source-backed evidence and eight case
studies. Freelance delivery remains supporting evidence of end-to-end ownership.

## Run

Open `index.html` directly in a browser — no build step.

For a local server (so relative asset paths resolve cleanly):

```
python -m http.server 4321 --directory .
# → http://localhost:4321
```

## Files

- `index.html` — structure (projects are injected by `script.js`)
- `styles.css` — design tokens, responsive layout and dark/light themes
- `script.js` — `PROJECTS` data (each project's state machine lives here), node
  interactions, featured/supporting project visibility, theme toggle, filters,
  navigation and contact helpers
- `assets/` — resume, role-specific CVs, shared `cv-role.css`, project assets and favicon
- `robots.txt` — crawler access rules
- `CONTENT_FACTS.md` — canonical claims and wording shared by the site and resumes

## Editing content

All project content is the `PROJECTS` array at the top of `script.js`. Each entry:
`flow` is the list of states; a state with `challenge` + `fix` gets an amber dot
and shows the problem/solution when clicked.

## Notes

- Education shows an expected 2027 graduation and GPA 3.46/4.0.
- The SSTC warranty operations case study was engineered by Gia Bao as the sole
  developer during a Backend Developer Internship. Public material describes the
  complete source handover but does not expose the company database or production data.
- Test wording distinguishes implementation count from execution evidence: the final
  source contains 800+ automated test methods; the latest documented complete Maven
  verification passed 805 tests.
- Coffee Shop links to its team repository. Other public projects link to Gia
  Bao's GitHub profile until project-specific repository URLs are available.
- Deploy: upload the contents of this `portfolio/` folder to any static host
  (Vercel / Netlify / GitHub Pages).
