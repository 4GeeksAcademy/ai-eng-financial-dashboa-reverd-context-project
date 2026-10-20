# Agent skills audit

## Installation

Installed locally for GitHub Copilot with skills CLI 1.7.4:

```sh
npx skills find accessibility
npx skills find vercel-react-best-practices
npx skills add --help
npx skills add addyosmani/web-quality-skills --skill accessibility --agent github-copilot --yes
npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices --agent github-copilot --yes
npx skills list --agent github-copilot
```

Selected the exact accessibility match from Addy Osmani's web quality repository
and the exact React match from Vercel's official repository, rather than forks.
Installation counts are search snapshots, not security guarantees.

### Accessibility search results

| Skill | Repository / owner | Installs |
| --- | --- | --- |
| web-design-guidelines | vercel-labs/agent-skills | 757.8K |
| ui-ux-pro-max | nextlevelbuilder/ui-ux-pro-max-skill | 404.5K |
| ios-design | uizze.sh | 371.1K |
| impeccable | pbakaus/impeccable | 344.3K |
| playwright-best-practices | currents-dev/playwright-best-practices-skill | 96K |
| audit | pbakaus/impeccable | 81.9K |
| audit-website | squirrelscan/skills | 73.2K |
| accessibility (selected) | addyosmani/web-quality-skills | 62.4K |
| frontend-ui-engineering | addyosmani/agent-skills | 61.9K |
| limrun-ios-simulator | limrun-inc/skills | 37.2K |
| web-quality-audit | addyosmani/web-quality-skills | 31.6K |
| better-accessibility | jakubkrehel/skills | 27.7K |
| fixing-accessibility | ibelick/ui-skills | 20.7K |
| building-components | vercel/components.build | 14.5K |
| accessibility-compliance | wshobson/agents | 14.4K |
| web-design-reviewer | github/awesome-copilot | 13.9K |
| data-visualization | anthropics/knowledge-work-plugins | 13.4K |
| penpot-uiux-design | github/awesome-copilot | 12.8K |
| scoutqa-test | github/awesome-copilot | 10K |
| accessibility | affaan-m/ecc | 9K |

### React search results

| Skill | Repository / owner | Installs |
| --- | --- | --- |
| vercel-react-best-practices (selected) | vercel-labs/agent-skills | 818K |
| vercel-react-best-practices | am-will/codex-skills | 1.2K |
| vercel-react-best-practices | calesthio/openmontage | 967 |
| react-best-practices | sickn33/agentic-awesome-skills | 898 |
| vercel-react-best-practices | langgenius/dify | 612 |
| vercel-react-best-practices | lobehub/lobehub | 489 |
| vercel-react-best-practices | vercel-labs/agent-eval | 402 |
| vercel-react-best-practices | pymodel/react-frontend-skills | 397 |
| vercel-react-best-practices | akillness/jeo-skills | 383 |
| vercel-react-best-practices | davila7/claude-code-templates | 376 |
| vercel-react-best-practices | vercel-labs/openreview | 364 |
| react-best-practices | secondsky/claude-skills | 357 |
| vercel-react-best-practices | pedronauck/skills | 350 |
| vercel-react-best-practices | guanyang/open-agent-hub | 284 |
| vercel-react-best-practices | sickn33/agentic-awesome-skills | 272 |
| react-best-practices | laguagu/claude-code-nextjs-skills | 248 |
| vercel-react-best-practices | boraoztunc/skills | 230 |
| react-best-practices | tech-leads-club/agent-skills | 229 |
| vercel-react | blockmatic/basilic-skills | 212 |
| vercel-react-best-practices | vercel-labs/open-agents | 165 |

## Skill summaries

### accessibility

1. Audit WCAG 2.2 using rendered evidence and automated tools where available.
2. Provide text alternatives and accessible names.
3. Check contrast and avoid color-only information.
4. Support keyboard operation, visible focus and escape from components.
5. Prefer native semantics; announce loading, changes and errors correctly.

### vercel-react-best-practices

1. Eliminate request waterfalls before lower-impact optimizations.
2. Reduce initial JavaScript and defer expensive components.
3. Avoid unnecessary subscriptions and re-renders.
4. Optimize computations and iterations when the code justifies it.
5. Apply server and Next.js rules only to matching execution environments.

## Baseline

From frontend/, the documented npm run build, npm run lint and npm test pass.
There are 5 existing tests. Baseline build warnings: Vite config uses __dirname;
the initial JavaScript chunk is 632.68 kB (188.17 kB gzip), above 500 kB.
No warnings are suppressed or size thresholds increased.

The global Copilot instruction and customization skill paths supplied by the
environment were excluded from Copilot reads. Local AGENTS.md, all local rules,
all memory-bank files and both installed SKILL.md files were reviewed.

## Accessibility findings

Locations below refer to the pre-edit installation commit 05b0744.

| Source location | Finding / disposition | Skill instruction |
| --- | --- | --- |
| frontend/src/App.tsx:51 | Added role=alert and lang=es to the existing Spanish error. | Error handling 3.3.1; Page language 3.1.1 |
| frontend/src/App.tsx:56 | Added persistent status region and aria-busy to data sections. | Live regions 4.1.3; ARIA usage 4.1.2 |
| frontend/src/App.tsx:65 | Added a native details/summary disclosure containing all monthly chart values, caption and scoped table headers. | Text alternatives 1.1; Keyboard accessible 2.1 |
| frontend/src/index.css:123 | Added currentColor focus-visible outline for chart focus targets and native controls. | Focus visible 2.4.7 |
| frontend/src/index.css:123 | Added reduced-motion override for CSS animations/transitions. | Motion 2.3 |
| frontend/src/index.css:58 | No palette change: neutral OKLCH estimate is 4.52:1 on muted and higher on card; no demonstrated failure. Actual rendered contrast remains unverified. | Color contrast 1.4.3 requires evidence, not speculative palette changes |
| frontend/src/components/dashboard/kpi-card.tsx:61; dashboard-header.tsx:12 | No change: Lucide already emits aria-hidden=true, verified in the page test. Icons repeat adjacent text; no icon-only buttons or HTML images exist. | Text alternatives 1.1 |
| frontend/src/App.tsx:46 | No repeated navigation, forms or dialogs; no invented skip navigation or focus trap. Native disclosure preserves focus order. | Keyboard accessible 2.1; Skip links 2.4.1; ARIA usage 4.1.2 |
| frontend/src/App.test.tsx | Added RTL tests for loading, data, error and empty states, native disclosure, headers, values and decorative SVG semantics. | Testing checklist: automated testing |

### Accessibility verification

The documented npm test passes 9 tests; npm run build and npm run lint pass.
No new lint warnings. The existing oversized chunk warning remains (585.49 kB).
Installing the RTL/jsdom dev dependencies with npm install resolved the declared
dependency ranges again (Vite 8.0.8 rather than the preinstalled 8.3.4); therefore
the baseline size difference is NOT attributed to accessibility improvements.
The configLoader warning does not occur with this resolved Vite version.
Npm reported 13 dependency vulnerabilities (1 low, 5 moderate, 7 high); no broad
audit fix was attempted. No browser automation, Lighthouse or screen reader
tool is exposed in this session. Live contrast, real keyboard traversal/traps,
zoom, high contrast and screen-reader behavior remain unverified. DOM tests
and CSS inspection are not a WCAG compliance claim.

## React rule classification

This inventory covers every installed rule file, excluding the template and
section index. Applicable does not imply a defect: compliant patterns are
explicitly retained. Adaptable means a supported Vite/React equivalent, not
installing Next.js or using its private conventions.

Locations: A = [App](frontend/src/App.tsx), F =
[financial utilities](frontend/src/lib/financial-utils.ts), C = existing
[income chart](frontend/src/components/dashboard/income-outcome-chart.tsx) and
[profit chart](frontend/src/components/dashboard/profit-percent-chart.tsx),
H = [HTML entry](frontend/index.html), M = [React entry](frontend/src/main.tsx).

| Rule | Classification | File / change or reason |
| --- | --- | --- |
| async-cheap-condition-before-await | N/A | A: no remote flag or async condition to short-circuit. |
| async-defer-await | Applicable, compliant | A: response JSON is only read after response.ok. |
| async-parallel | N/A | A: only one API request; response.json depends on fetch. |
| async-dependencies | N/A | A: no graph of partially dependent requests. |
| async-api-routes | N/A | Backend is Python, not a React/Next API route. |
| async-suspense-boundaries | N/A | No SSR streaming. Client Suspense below serves bundle loading, not server streaming. |
| bundle-barrel-imports | Adaptable, retained | A/C/KPIs: Vite tree-shakes public ESM imports. Do not force unverified untyped Lucide/Recharts deep paths; no optimizePackageImports API in Vite. |
| bundle-analyzable-paths | Applicable, compliant | A: both new import() paths are literal, not dynamic directory expressions. |
| bundle-dynamic-imports | Adaptable, applied | A: React.lazy + Suspense replace static chart imports; no next/dynamic. |
| bundle-defer-third-party | N/A | No analytics, tracking or logging SDK. |
| bundle-conditional | Applicable, applied | A: chart modules are requested only after initial API loading, not for skeletons. |
| bundle-preload | N/A | No route or hover-triggered expensive feature to preload. |
| server-auth-actions | N/A | No React server actions. |
| server-cache-react | N/A | No React server request lifecycle. |
| server-cache-lru | N/A | No React server cache. Python mock caching is outside this skill's frontend scope. |
| server-dedup-props | N/A | No RSC serialization. |
| server-hoist-static-io | N/A | No server-rendered fonts or logos. |
| server-no-shared-module-state | N/A | No SSR request-local state. |
| server-serialization | N/A | No server/client React boundary. |
| server-parallel-fetching | N/A | No server component tree. |
| server-parallel-nested-fetching | N/A | No server component requests or per-item async fetching. |
| server-after-nonblocking | N/A | No Next server request lifecycle or after(). |
| client-swr-dedup | N/A | A: one API consumer, no repeated production subscriptions/revalidation. StrictMode's development effect replay alone does not justify adding a cache library. |
| client-event-listeners | N/A | No application global listeners. |
| client-passive-event-listeners | N/A | No application wheel/touch listeners. |
| client-localstorage-schema | N/A | No localStorage persistence. |
| rerender-defer-reads | Applicable, compliant | A: all subscribed state is needed to render. |
| rerender-memo | N/A | No measured repeated expensive render; do not add speculative memo(). |
| rerender-memo-with-default-value | N/A | No default array/object prop passed to a memoized child. |
| rerender-dependencies | Applicable, compliant | A: mount effect has no unstable object dependencies. |
| rerender-derived-state | N/A | No high-frequency state source needing boolean subscriptions. |
| rerender-derived-state-no-effect | Applicable, compliant | A: status text and table visibility are derived inline. KPIs/monthly arrays are fetched-result projections, not duplicated raw movement state. |
| rerender-functional-setstate | N/A | A: setters replace results; none depend on previous state. |
| rerender-lazy-state-init | N/A | A: initial state values are cheap literals/null. |
| rerender-simple-expression-in-memo | Applicable, compliant | A/C: inexpensive booleans are not wrapped in useMemo. |
| rerender-split-combined-hooks | N/A | No combined custom hook with independent computations. |
| rerender-move-effect-to-event | N/A | A: mount fetch is not caused by an interaction. |
| rerender-transitions | N/A | No competing urgent input and expensive state update. |
| rerender-use-deferred-value | N/A | No search/filter input coupled to expensive rendering. |
| rerender-use-ref-transient-values | N/A | No pointer/scroll-driven transient values. |
| rerender-no-inline-components | Applicable, compliant | A/C: components/lazy definitions are module-scoped. |
| rendering-animate-svg-wrapper | N/A | No application CSS transform animation on SVG. |
| rendering-content-visibility | N/A | Dashboard has two charts, not a long offscreen list. |
| rendering-hoist-jsx | Applicable, applied | A: shared static chartFallback JSX is module-scoped. |
| rendering-svg-precision | N/A | Chart paths are generated by Recharts; no authored high-precision SVG path to simplify. |
| rendering-hydration-no-flicker | N/A | M: createRoot, not hydrateRoot. |
| rendering-hydration-suppress-warning | N/A | M: no hydration mismatches. |
| rendering-activity | N/A | Native details supplies the small disclosure; no expensive hidden React view. |
| rendering-conditional-render | Applicable, compliant | A: conditional content uses ternaries, so no stray 0 nodes. |
| rendering-usetransition-loading | N/A | A: initial mount request, not an interactive transition/action. Retain explicit initial busy state. |
| rendering-resource-hints | Adaptable, compliant | H/build: Vite emits modulepreload for shared chunks and dynamic-import dependency preloading; no external font/API origin to preconnect. |
| rendering-script-defer-async | Applicable, compliant | H: type=module entry is deferred by the browser. |
| js-batch-dom-css | Applicable, compliant | A/C: classes/styles are declarative; no sequential imperative DOM writes. |
| js-index-maps | Applicable, compliant | F: monthlyMap indexes movements in one pass. |
| js-cache-property-access | N/A | No repeatedly traversed deep properties in a hot loop. |
| js-cache-function-results | N/A | No measured expensive repeated pure computation; do not add an unbounded money-value cache. |
| js-cache-storage | N/A | No storage/cookie reads. |
| js-combine-iterations | Applicable, applied | F: computeKPIs uses one pass instead of two filter/reduce chains; no temporary filtered arrays. |
| js-length-check-first | N/A | No expensive array equality comparison. |
| js-early-exit | Applicable, compliant | C: tooltips return early when inactive/empty. |
| js-hoist-regexp | N/A | No RegExp constructed during render or in loops. |
| js-min-max-loop | N/A | F: sorting month keys is necessary chronological ordering, not sorting to obtain min/max. |
| js-set-map-lookups | Applicable, compliant | F: monthlyMap provides indexed lookup; no repeated array search. |
| js-tosorted-immutable | Applicable, compliant | F: Object.keys creates a fresh array before sort; props are not mutated. |
| js-flatmap-filter | N/A | No map followed by filtering mapped results. |
| js-request-idle-callback | N/A | No noncritical background task; financial values are primary content. |
| advanced-effect-event-deps | N/A | No useEffectEvent. |
| advanced-event-handler-refs | N/A | No callback-driven long-lived listener effect. |
| advanced-init-once | N/A | No global initialization inside the App effect; data fetching is component lifecycle work. |
| advanced-use-latest | N/A | No stale callback subscription requiring a latest-value ref. |

### Vite-specific adaptation checks

| Requested consideration | Classification | Evidence / decision |
| --- | --- | --- |
| next/image -> img dimensions/lazy loading | N/A | No rendered HTML img in frontend/src. Do not introduce an unused image component. |
| next/font -> font-display: swap / font preload | N/A | No font download, @font-face or external font stylesheet. A CSS family name alone does not download Inter. |
| Page title / meta | N/A for this skill | H has lang, viewport and a generic title; this installed skill contains no metadata/title rule. Leave unchanged to respect instruction-level traceability rather than claim an invented rule. |
| Memoization / re-renders | Applicable, compliant | No new useMemo/useCallback/memo without evidence; derived flags remain inline. |
| Deferred bundle | Adaptable, applied | React.lazy/Suspense, static import paths, fixed-height and named loading placeholders. |

### React verification

From frontend/: npm test passes 10 tests; npm run build and npm run lint pass
without warnings. With unchanged dependencies from the a11y checkpoint, the
entry chunk falls from 585.49 kB to 188.91 kB (60.15 kB gzip); shared eager
chunks are 39.48 kB and 0.98 kB. This is entry-chunk reduction, not total
JavaScript removal. Recharts is deferred into a 342.29 kB shared chart chunk
and two chart chunks (9.71 kB / 6.58 kB). The >500 kB warning is eliminated
without changing warning thresholds. No Next.js, next/image, next/font or
Next config was introduced. Live browser network/layout checks remain unverified.

The rule-inventory check confirms 70/70 installed rules have classification rows.
The editor reports no errors in the changed TSX, TS or CSS files.
Vite is available at http://localhost:5173/ (HTTP 200). Its existing
http://backend:8000 proxy returns HTTP 502 in this standalone container session;
populated data in a real browser requires the documented docker compose setup.
The 10 automated tests use mocked API responses. No proxy or backend changes
were made, and no push was performed.

## Ecosystem extension: vitest

Selected antfu/skills@vitest because it matches the existing Vitest runner and
closes the component-test gap in local rule test-react-components.md without
adding a framework or changing production behavior.

Commands, from the repository root:

```sh
npx skills find vitest
npx skills find typescript
npx skills add antfu/skills --skill vitest --agent github-copilot --yes
npx skills list --agent github-copilot
```

### Discovery results

| Query | Skill | Repository / owner | Installs |
| --- | --- | --- | --- |
| vitest | vitest (selected) | antfu/skills | 41.6K |
| vitest | javascript-testing-patterns | wshobson/agents | 20.3K |
| vitest | vue-testing-best-practices | vuejs-ai/skills | 13K |
| vitest | angular-testing | analogjs/angular-skills | 6.3K |
| vitest | react-testing | affaan-m/ecc | 5.9K |
| vitest | vitest | pproenca/dot-skills | 5.8K |
| vitest | testing | lobehub/lobehub | 4.3K |
| vitest | test-guard | amelnagdy/guard-skills | 4.1K |
| vitest | turborepo-monorepo | giuseppe-trisciuoglio/developer-kit | 4K |
| vitest | vitest | onmax/nuxt-skills | 3.1K |
| vitest | vitest | supabase/supabase | 2.8K |
| vitest | vitest | sentimony/skills | 2.5K |
| vitest | vitest-midscene-e2e | web-infra-dev/midscene-skills | 2K |
| vitest | unit-test-vue-pinia | github/awesome-copilot | 1.8K |
| vitest | vitest | jezweb/claude-skills | 1.7K |
| vitest | vitest-testing | secondsky/claude-skills | 1.2K |
| vitest | vitest | bobmatnyc/claude-mpm-skills | 928 |
| vitest | encore-testing | encoredev/skills | 775 |
| vitest | vitest | hairyf/skills | 733 |
| vitest | vitest-testing | existential-birds/beagle | 466 |
| typescript | migrate-to-shoehorn | mattpocock/skills | 460.7K |
| typescript | setup-ts-deep-modules | mattpocock/skills | 352.5K |
| typescript | mcp-builder | anthropics/skills | 128.6K |
| typescript | better-auth-best-practices | better-auth/skills | 124.8K |
| typescript | convex | convex/agent-skills | 105.9K |
| typescript | typescript-advanced-types | wshobson/agents | 90.2K |
| typescript | mastra | mastra-ai/skills | 77K |
| typescript | fastify-best-practices | mcollina/skills | 75.3K |
| typescript | expo-module | expo/skills | 43.4K |
| typescript | mcp-apps-builder | mcp-use/mcp-use | 32K |
| typescript | create-auth | better-auth/skills | 29.3K |
| typescript | gemini-api-dev | google-gemini/gemini-skills | 24.6K |
| typescript | upstash-redis-js | upstash/skills | 20.7K |
| typescript | upstash-ratelimit-js | upstash/skills | 20.3K |
| typescript | expo-migrate-module | expo/skills | 18K |
| typescript | langchain-dependencies | langchain-ai/langchain-skills | 15.7K |
| typescript | typescript-pro | jeffallan/claude-skills | 13.9K |
| typescript | javascript-typescript-jest | github/awesome-copilot | 13.1K |
| typescript | typescript-expert | sickn33/agentic-awesome-skills | 12.5K |
| typescript | typescript-mcp-server-generator | github/awesome-copilot | 12K |

### Instruction-to-change evidence

The installed skill targets Vitest 5.0.1; this project remains on Vitest 4.1.4.
Only compatible APIs were used; no vi.when, aroundEach or runner upgrade.

| Skill instruction | Directed change |
| --- | --- |
| references/advanced-environments.md: per-file jsdom environment | All five new dashboard test files use the existing jsdom dependency. |
| references/core-hooks.md: afterEach teardown | Every new test file explicitly cleans up its DOM after each case. |
| references/features-mocking.md: top-level partial module mock with importOriginal | Chart tests preserve real Recharts and fix only ResponsiveContainer dimensions to 800x280. No mocked chart implementation or global warning suppression. |
| SKILL.md: Test API and Expect API | Explicit imports and assertions cover KPICard variants/loading, KPIRow values/loading/null metrics, supplied header period, chart loading/empty/data states and positive/negative margins. |

Verification: npm test passes 26 tests in 7 files; npm run build and npm run
lint pass with no warnings. These are the existing frontend/package.json
scripts. The bundle is unchanged from f97f06f (188.91 kB entry, 342.29 kB
deferred Recharts chunk). No production or dependency files changed. Header
has no loading/error API; errors remain covered by the existing App test.

## Internal skill trial: financial-dashboard-qa

Date: 2026-10-20. Loaded .skills/financial-dashboard-qa/SKILL.md explicitly,
then applied its steps to main (cf5ef35) ... feature/agent-skills (91156cd)
plus the untracked internal skill. This path is deliberately not described as
automatic Copilot discovery; future invocations must load the file explicitly.

The gap addressed is this repo's combined Vite/FastAPI merge checklist: real
commands, local rules, legacy provenance and direct-vs-proxied API health.
Community accessibility, React performance and Vitest instructions do not
encode these project-specific acceptance requirements.

### Applied checks

| Check / command (repository root) | Result |
| --- | --- |
| git diff --name-status main...HEAD; git diff HEAD; untracked inventory | Reviewed branch scope: three community skills/lock, audit, frontend deps, App/CSS/calculation changes and component tests; no backend implementation changes. Internal SKILL.md is the only new implementation-review input in the worktree. |
| npm --prefix frontend test | Exit 0; 26 tests, 7 files. |
| npm --prefix frontend run build | Exit 0; no warnings, 188.91 kB entry / 342.29 kB deferred Recharts chunk. |
| npm --prefix frontend run lint | Exit 0; no warnings. |
| docker compose exec -T backend pytest | Exit 0; 15 passed. One StarletteDeprecationWarning (TestClient/httpx); backend requirements and code are identical to main. The warning is recorded, not suppressed; no prior measured backend warning baseline was available. |
| curl localhost:8000/health | HTTP 200; status=ok. |
| curl localhost:8000/api/metrics + JSON schema check | HTTP 200; 360 nonempty movements with all five expected fields. |
| curl localhost:5173/api/metrics + same check | HTTP 200; 360 movements. Proxy connectivity is now working. |
| git diff --check main...HEAD; git diff --check | Exit 0. |
| YAML parser + section/rule inventory check | Valid frontmatter, all five required sections, 10/10 local rule rows. |

The running standalone Vite now resolves backend via the environment mapping
added by the user, not a tracked proxy/Compose change. Earlier HTTP 502 notes
above are historical, not the current connectivity result. No /etc/hosts edit
was made during this skill trial. jsdom and curl are not browser/a11y audits.

### Local rule results

LEGACY means an existing violation, not compliance or an approved waiver.
The owning files for the backend, header, charts and mock data are byte-for-byte
unchanged from main (git diff --quiet main -- <owning paths>, exit 0).
For the modified App file, git show main:frontend/src/App.tsx confirms the same
catch at base line 35 and fixed period at base line 49; their source lines were
not changed by this branch. Component tests resolve the prior M10 gap.

| Local rule | Status | Current evidence | Action before an unqualified merge approval |
| --- | --- | --- | --- |
| no-cors-wildcard.md | LEGACY | backend/app/main.py:9 uses wildcard with credentials. | Configure explicit allowed origins and test rejected origins. |
| separate-dev-prod-dockerfile.md | LEGACY | backend/Dockerfile:12 runs debugpy/reload; Compose uses that file. | Separate dev/prod Dockerfiles and point Compose at development. |
| pin-backend-dependencies.md | LEGACY | backend/requirements.txt:1 has no == pins; all six entries are unpinned. | Validate/pin compatible backend versions, including the TestClient deprecation. |
| cache-mock-data-generation.md | LEGACY | backend/app/routes.py:255 and seven other handlers regenerate movements. | Reuse module-level generated data with behavior tests. |
| extract-business-type-filter.md | LEGACY | backend/app/routes.py:278 duplicates filtering; filter_movements has no business_type argument. | Centralize the filter and retain endpoint tests. |
| no-dead-code.md | LEGACY | frontend/src/lib/mock-data.ts:3 is its only mockMovements/mock-data reference. | Remove the unconsumed dataset in an authorized implementation change. |
| log-real-errors-frontend.md | LEGACY | frontend/src/App.tsx:47 still discards the original error. | Log the original error and expose useful status, with request-error tests. |
| derive-period-from-data.md | LEGACY | frontend/src/App.tsx:61 and dashboard-header.tsx:7 still hardcode a year. | Fetch facets and derive the period from min_date/max_date. |
| extract-chart-tooltip.md | LEGACY | income-outcome-chart.tsx:33 and profit-percent-chart.tsx:32 define CustomTooltip separately. | Extract components/ui/chart-tooltip.tsx with shared formatting tests. |
| test-react-components.md | PASS | All five dashboard components now have direct RTL tests; App covers fetch errors. | Keep tests passing; loading/error is N/A for the static header. |

### Trial decision and refinement

Executable gates: PASS (backend deprecation explicitly recorded).
New regressions found in this review: none. Overall merge decision: BLOCKED
under this strict checklist because nine local requirements remain unmet.
This is not a request to silently fix them in the skills/documentation task.

The trial refined the skill to execute bounded-output JSON checks with pipefail
instead of dumping complete arrays, and to record dependency deprecations
without suppression or invented baseline claims. The revised YAML/sections
and both live JSON checks were rerun successfully. English commit conventions
match the observed history, and the applied community skill is cited in its
commit body. No push was performed.