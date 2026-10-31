# Gia Bao — Behind the Interface

A static portfolio for Pham Ngoc Gia Bao, focused on Java backend internship and fresher opportunities. The cinematic homepage uses an original procedural WebGL2 system sculpture, scroll-driven composition and explorable layers. It retains eight case studies, the concurrency teaching model, and the shared backend résumé in HTML and PDF.

## View

Use the HTTP preview below for the full 3D experience. Opening `index.html` through `file://` still shows HTML content and a CSS sculpture, but browsers restrict ES modules on local files.

For a local HTTP preview, build once and run:

```sh
npm run dev
```

Then open `http://127.0.0.1:4321`. The server exposes only the generated `dist/` artifact on loopback.

## Edit and build

Requires Node.js 22+ and Python 3.10+. Run `npm ci` to install the pinned esbuild development dependency. The required Three.js 0.187.0 module subset is vendored with its MIT license and provenance in `vendor/three/`. Python build dependencies are listed in `requirements-build.txt`.

```sh
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -r requirements-build.txt
npm ci
npm run build
npm run check
npm test
```

The build regenerates `app.js`, the homepage, the eight case-study pages, the HTML/PDF backend résumé and `dist/`. The PDF uses fonts bundled with ReportLab, so it does not depend on macOS font paths.

Commit the generated root pages, `app.js`, résumé PDF and prepared assets alongside their source. Rebuild after editing content. Do not hand-edit generated HTML or `app.js`.

## Source map

| Source | Purpose |
|---|---|
| `CONTENT_FACTS.md` | Authoritative claims, role titles and wording constraints |
| `data/profile.json` | Contact, education and core profile data |
| `data/projects.json` | Eight projects: role, context, workflow, decisions, evidence and scope |
| `scripts/build_portfolio.py`, `templates/` | Data-driven cinematic homepage, case studies and résumé HTML |
| `cinematic.css`, `cinematic.js`, `js/cinematic-controller.js` | Homepage styling and lightweight worker controller |
| `js/cinematic-scene.js`, `js/scene-worker.js`, `js/studio-environment.js` | OffscreenCanvas renderer and precomputed HDR reflection loading |
| `scripts/build_scene.mjs` | Bundled/minified worker output, `js/cinematic-3d.min.js`, with a linked MIT notice |
| `assets/3d/`, `scripts/bake_environment.*`, `scripts/prepare_environment.py` | Studio reflection assets and reproducible bake/quantization tools |
| `vendor/three/` | Pinned local Three.js dependency closure, license and source integrity metadata |
| `script.js`, `js/` | Interaction source; dialogs, search and simulation are separate modules |
| `scripts/build_client.mjs` | Small dependency-free case-study bundle |
| `theme.js` | Theme initialization before paint, with storage fallback |
| `styles.css` | Design tokens, layout, motion, responsive and print styles |
| `scripts/export_backend_cv.py` | Text-selectable one-page PDF from the same résumé HTML |
| `scripts/prepare_assets.py` | Responsive WebP copies and brand asset preparation |
| `scripts/package_portfolio.py` | Explicit public-file allowlist for `dist/` |
| `scripts/check_site.py` | Internal links/fragments, resources, PDF and artifact-boundary checks |
| `tests/simulation.test.js` | Invariants and failure contrast in the concurrency teaching model |

Existing role-specific application exporters and documents are separate from the website build. They are not included in the public artifact.

## Design and interaction

- Cinematic dark homepage; matching ice-blue case-study palette with an optional light theme. Self-hosted fonts and licenses live in `assets/fonts/`.
- The procedural metal sculpture changes composition while scrolling; Explore the layers separates and recombines its frames. It is illustrative, with no live telemetry.
- Pause/Resume controls stop ambient 3D motion. Reduced motion starts paused. A hidden page stops rendering; renderer pixel ratio is capped. Rendering and shader compilation run in a worker. Browsers without worker WebGL support retain the CSS sculpture.
- On compact screens the sculpture occupies a dedicated hero region. Headings and descriptions are outside its bounds, and later sections have opaque reading backgrounds. The worker stops when the artwork is offscreen, and mobile drawing is capped at 30 FPS.
- Runtime RoomEnvironment/PMREM generation and the bloom multipass were removed. Reflection assets are baked once; mobile uses a smaller preset and simpler materials. Initialization yields between geometry batches and precompiles shaders asynchronously.
- Static view (`?view=static`) and Save-Data skip loading the optional 3D scene. HTML navigation, project archive and case-study links work without JavaScript. No FPS or device-performance benchmark is claimed.
- The concurrency playground compares five stale readers with and without a version check. It is a deterministic teaching model, not a live backend, load test or benchmark.
- On case-study pages, search opens with the search button or Cmd/Ctrl+K. Arrow keys select, Enter opens and Escape closes. User input is rendered with text nodes.
- Native dialogs handle focus containment; all closing paths share scroll cleanup.
- Core project content is rendered as HTML. Navigation, case studies, the project archive and decision accordions work without JavaScript.
- Reduced-motion preferences disable decorative animation and remove artificial simulation delays.

Prepared screenshots remain in `assets/optimized/`. To regenerate after replacing screenshot sources, run `npm run assets`. The full original screenshots remain unchanged in `assets/photo_prod/`.

## Verification

`npm run check` validates the actual `dist/` artifact, including one H1 per page, unique IDs, internal targets and fragments, images, font resources, JavaScript imports and worker URLs, manifest icons and a one-page résumé with selectable text. It also rejects development/private directories and mail/tracker files in the artifact.

The GitHub Actions workflow runs build, checks and model tests. It does not deploy or change repository settings. Browser QA is separate from these checks; the current local QA record is in `review/UPGRADE_QA.md` when present.

## Publication

Publish **only `dist/`** to a static host. All asset and document links are relative and work under a subpath such as `/Portfolio/`. The default canonical origin is `https://giabaocode.github.io/Portfolio`.

To generate pages for another origin:

```sh
node scripts/build_scene.mjs
node scripts/build_client.mjs
python3 scripts/build_portfolio.py --base-url https://your-domain.example
python3 scripts/export_backend_cv.py
python3 scripts/package_portfolio.py
python3 scripts/check_site.py
```

Do not upload the working directory. `SSTC/` is a read-only private reference project; `output/`, `tmp/`, mail exports, the job tracker, and QA artifacts are not website content.

## Evidence rules

Keep the official SSTC role as Backend Developer Intern. Its 29 states, 57 migrations, 800+ implemented test methods and recorded 805-test verification refer to final handover records, not current CI or live runtime telemetry. The local SSTC reference is an older snapshot and is excluded from publication.

UniHub's 12,000 virtual users describe an authored K6 scenario; do not turn that into a measured throughput, latency, error-rate or zero-overselling claim without the corresponding report. Revalidate current product availability before presenting it as current use. Never publish company source, data or private documents without authorization.
