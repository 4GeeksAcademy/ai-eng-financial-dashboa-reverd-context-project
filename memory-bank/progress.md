# Agent Skills Progress

Updated: 2026-10-20. Branch: feature/agent-skills. No push performed.

## Applied community skills

| Skill / source | Why | Verified changes / evidence |
| --- | --- | --- |
| accessibility / addyosmani/web-quality-skills | Financial values must be available without interpreting chart colors or pointer tooltips. | App announces loading/errors, marks regions busy and exposes a native monthly data table; CSS adds visible focus and reduced motion. Commit 74431f5; App.test.tsx covers request states/table semantics. |
| vercel-react-best-practices / vercel-labs/agent-skills | Recharts dominated the initial bundle although the first render only needed loading placeholders. | React.lazy/Suspense + conditional loading and hoisted fallback; single-pass KPI aggregation. Commit f97f06f. With the same dependencies, entry chunk 585.49 -> 188.91 kB; Recharts deferred to a 342.29 kB shared chunk. Shared eager chunks remain; this is not a total JS removal claim. |
| vitest / antfu/skills | Matches the existing runner and closes local rule test-react-components.md without a new framework. | Commit 91156cd adds five component test files: KPICard, KPIRow, header and both charts. Per-file jsdom, explicit cleanup and partial ResponsiveContainer mock preserve real Recharts. Frontend now has 26 tests in 7 files, up from 10 before this step. |

The Vitest skill targets version 5, but only APIs compatible with the installed
Vitest 4.1.4 were applied. No production code, dependencies or runner version
changed in the Vitest application. Both ecosystem searches (vitest/typescript),
all results, selection and instruction-to-change tables are in ../skill-audit.md.
Community skill discovery is registered for GitHub Copilot in .agents/skills/
and skills-lock.json. Installation commit: 05b0744.

## Verification evidence

Commands run from the repository root, using actual frontend scripts:

| Command / check | Latest observed result |
| --- | --- |
| npm --prefix frontend run build | Exit 0; no warnings. Entry 188.91 kB (60.15 kB gzip), deferred Recharts 342.29 kB. No size threshold changes or suppressed warnings. |
| npm --prefix frontend run lint | Exit 0; no warnings. |
| npm --prefix frontend test | Exit 0; 26 tests, 7 files. |
| docker compose exec -T backend pytest | Exit 0; 15 tests. One StarletteDeprecationWarning for TestClient/httpx; unchanged unpinned backend requirements, not suppressed. |
| curl localhost:8000/health | HTTP 200; status=ok. |
| curl localhost:8000/api/metrics + JSON check | HTTP 200; 360 movements with all required fields. |
| curl localhost:5173/api/metrics + JSON check | HTTP 200; 360 movements via the existing Vite proxy. |
| Internal skill validation | YAML parsed with the installed js-yaml; five required sections and 10/10 local rules present. |
| git diff --check main...HEAD and worktree | Passed. |

The backend is running through docker compose up -d --build backend. Vite runs
standalone on port 5173. Its backend hostname became resolvable after the user
added a session-local /etc/hosts entry; no tracked proxy/Compose change was made.
This environment workaround is not a portable setup guarantee. Full Compose
provides service-name DNS. Earlier 502 observations in the audit are historical.
No browser, Lighthouse, manual keyboard, rendered contrast or screen-reader
verification was completed; jsdom and curl do not establish WCAG conformance.

The earlier a11y dependency install reported 13 npm vulnerabilities. No new
audit was run in this step, and the issue is not claimed resolved. Backend
dependency pinning and its observed deprecation remain follow-up work.

## Vercel rules not applicable to this Vite frontend

The complete classification of all 70 rules is in ../skill-audit.md.
The frontend mounts with createRoot; there are no RSC, React server request
lifecycles or hydration. The backend is FastAPI, not a Next.js API route.

- N/A: server-auth-actions, server-cache-react, server-cache-lru,
  server-dedup-props, server-hoist-static-io, server-no-shared-module-state,
  server-serialization, server-parallel-fetching,
  server-parallel-nested-fetching and server-after-nonblocking.
- N/A: async-api-routes and async-suspense-boundaries (server streaming).
  Client Suspense for lazy bundle loading is a separate, applicable adaptation.
- N/A: rendering-hydration-no-flicker and rendering-hydration-suppress-warning.
- No next/image or next/font APIs were added. No rendered img or downloaded
  font requires width/height, loading=lazy, font-display or font preloading here.
  Those are adaptation checks, not invented rule IDs from this skill.
- Compatible React rules remain applicable. bundle-dynamic-imports is adapted
  to React.lazy/Suspense; Vite supplies modulepreload. No Next.js migration.

## Internal skill and real trial

Created .skills/financial-dashboard-qa/SKILL.md (commit 4614613) to fill a
repo-specific gap: combine frontend/backend gates, proxy checks, local rules,
legacy provenance and commit conventions in one actionable pre-merge review.
It contains frontmatter and Objective, Inputs, Expected output, Acceptance
criteria and Steps. This project-requested .skills/ location is loaded manually;
automatic discovery by Copilot is not assumed.

The skill was loaded and applied to main (cf5ef35) ... 91156cd and the worktree.
Its first trial led to bounded JSON/schema checks with pipefail and explicit
dependency-warning reporting; the revised skill was validated and checks rerun.
Full output, source lines and next actions are in ../skill-audit.md.

Result: executable gates PASS; test-react-components.md PASS; nine other local
rules remain LEGACY, proven against main. Overall strict merge decision:
BLOCKED, not waived. Remaining actions are explicit origins, dev/prod Docker
separation, backend pins, mock generation reuse, centralized business filtering,
unused mock removal, original fetch-error logging, facets-derived period and
shared chart tooltip. They were not silently folded into the skills task.
