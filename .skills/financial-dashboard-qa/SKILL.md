---
name: financial-dashboard-qa
description: Review this financial dashboard branch before merge using its Vite scripts, FastAPI tests, live proxy checks and ten local engineering rules. Separate regressions from inherited violations and never equate passing tests with merge readiness.
---

## Objective

Produce an evidence-based merge decision for this Vite/React + FastAPI repo.
Community skills do not know its ten local rules, two-runtime commands or
the distinction between backend availability and Vite proxy connectivity.

## Inputs

- Base ref (default: existing local main), current branch, committed diff and worktree.
- AGENTS.md, .agents/rules/*.md, context.md, practices-analysis.md and memory-bank/.
- frontend/package.json, frontend/vite.config.ts, backend/requirements.txt and docker-compose.yml.
- Previous gate output in skill-audit.md; running services if available.

## Expected output

Append a dated review to skill-audit.md: base/head, changed paths, command exit
codes, test counts, build warnings/chunks, HTTP/JSON results and one row per
local rule with file:line, PASS / FAIL / LEGACY / N/A and the next action.
Prove LEGACY with the base version. Report regression status separately from
overall READY / BLOCKED. Missing tools or services mean BLOCKED, not PASS.

## Acceptance criteria

- Build, lint, frontend tests and backend tests exit 0; report any new warnings.
- Direct backend and Vite-proxied /api/metrics return nonempty JSON arrays.
- All ten local rules are reviewed, including unchanged legacy violations.
- READY requires every applicable rule to pass; LEGACY is not an implicit waiver.
- Each main dashboard component has a .test.tsx; loading/data/empty/error cases
  are tested where its API supports them. Header loading/error is N/A.
- English commits follow the observed type(scope): summary or type: summary
  style. Cite the applied skill; no Next.js migration, broad cleanup or push.
- Do not claim rendered accessibility or browser QA from jsdom/curl alone.

## Steps

1. Load this file explicitly; .skills/ is project-requested storage, not a claim
   of automatic Copilot discovery. Read the inputs and verify the base exists.
   Run these commands from the repository root; replace main only if supplied:

   ```sh
   git status -sb
   git log --oneline -8
   git diff --name-status main...HEAD
   git diff main...HEAD -- frontend/src backend/app
   git diff HEAD
   git ls-files --others --exclude-standard
   git diff --check main...HEAD
   git diff --check
   ```

2. Use the real scripts, not an assumed lint/test/typecheck command:

   ```sh
   npm --prefix frontend run build
   npm --prefix frontend run lint
   npm --prefix frontend test
   docker compose exec -T backend pytest
   ```

   Backend fallback when Docker is unavailable: from backend/, run pytest in
   the environment containing requirements.txt dependencies. Do not install or
   start services merely to hide a blocked gate; report the missing prerequisite.

3. Read the current Vite proxy target first (currently http://backend:8000).
   With services already running, check health and both data paths:

   ```sh
    set -o pipefail
   curl --fail-with-body --silent --show-error --max-time 15 http://localhost:8000/health
    for url in http://localhost:8000/api/metrics http://localhost:5173/api/metrics; do
       printf '%s\n' "$url"
       curl --fail-with-body --silent --show-error --max-time 15 --write-out '%{stderr}HTTP %{http_code}\n' "$url" |
          python3 -c 'import json,sys; data=json.load(sys.stdin); fields={"create_date","amount","operation_type","category","business_type"}; assert isinstance(data,list) and data; assert all(fields <= item.keys() for item in data); print("PASS:",len(data),"movements")' || exit 1
    done
   ```

   Parse JSON, require a nonempty list with create_date, amount,
   operation_type, category and business_type. Do not freeze dates or counts
   as a contract: mocks span a moving year. Check pipeline exit codes too.
   Direct 200 + proxy 502 indicates connectivity/DNS, not a healthy full stack.
   backend resolves inside Compose; standalone Vite needs suitable DNS. Do not
   edit /etc/hosts, proxy settings or CORS as a side effect of this review.

4. Review every rule against its owning source. For inherited findings, use
   git show main:<path> and diff the affected lines before marking LEGACY.

   | Rule file in .agents/rules/ | Evidence / required action |
   | --- | --- |
   | no-cors-wildcard.md | backend/app/main.py: explicit origins, never credentials + wildcard. |
   | separate-dev-prod-dockerfile.md | Production Dockerfile excludes debugpy/reload; Compose selects Dockerfile.dev. |
   | pin-backend-dependencies.md | Every backend requirement uses ==. |
   | cache-mock-data-generation.md | backend/app/routes.py: reuse generated movements, not generation inside handlers. |
   | extract-business-type-filter.md | business_type filtering is centralized in filter_movements. |
   | no-dead-code.md | Verify mock-data references with grep -r "mock-data" frontend/src/; remove unimported source only in an authorized implementation task. |
   | log-real-errors-frontend.md | App fetch catch preserves/logs the original error and exposes useful status information. |
   | derive-period-from-data.md | App/header use facets min_date/max_date, not a literal year. |
   | extract-chart-tooltip.md | Both charts reuse components/ui/chart-tooltip.tsx rather than duplicate CustomTooltip. |
   | test-react-components.md | Tests cover all five dashboard components; App covers request errors. |

5. Compare warnings to the recorded baseline and list Vite-specific exclusions:
   no RSC, Next server actions, server cache/hydration or next/image/next/font
   APIs. Keep compatible React rules applicable. Record dependency deprecations
   separately with evidence of unchanged requirements; never suppress them.
   Finish the evidence table and explicit decision. Report legacy next actions
   without silently expanding scope.
