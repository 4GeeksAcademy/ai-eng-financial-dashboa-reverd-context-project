# API Exploration and Verification Trail

## Scope and Evidence Status

✅ Verified on 2026-10-20 against the running FastAPI service at `http://localhost:8000`. This is a specification-only change: no React components, frontend requests, or backend changes are implemented.

✅ Status legend: ✅ verified API fact or explicit specification decision grounded in the cited evidence; ❌ incorrect original assumption, followed by its verified correction; ❓ unverified claim. There are no unresolved ❌ or ❓ claims in the adopted contract. UI decisions below describe future requirements, not observed existing UI behavior.

✅ Read the existing `memory-bank/` and all ten files in `.agents/rules/`; neither directory is changed. `.agents/skills/` does not exist. The backend generates dates relative to its current date: snapshot dates and amounts below are evidence, never constants for the UI.

## Reproduction

✅ The root README and Compose publish port 8000. An isolated temporary environment was used because backend dependencies were absent; the server command uses the same Uvicorn application as `backend/Dockerfile`:

```bash
python -m venv /tmp/financial-specs-venv
/tmp/financial-specs-venv/bin/pip install -r backend/requirements.txt
cd backend
/tmp/financial-specs-venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
```

✅ The server ran in a background terminal. `curl -fsS http://localhost:8000/openapi.json` returned OpenAPI 3.1.0. `curl -fsS http://localhost:8000/docs` returned Swagger UI with `url: '/openapi.json'`. Inspect the same live paths at those URLs.

✅ Every request in this document was executed using curl, including requests invoked through Node's `execFileSync`. Reproduce any query without shell escaping mistakes using:

```bash
curl -i -G http://localhost:8000/api/metrics/categories/top \
  --data-urlencode operation_type=income --data-urlencode limit=5 \
  --data-urlencode business_type=B2B \
  --data-urlencode start_date=2026-01-01 --data-urlencode end_date=2026-03-31
```

## Exact Request Contract

✅ All routes below are GET, all declared parameters are query parameters, and all parameters are optional. Optional date, category, operation, and business filters are nullable in OpenAPI where applicable; the UI omits absent values instead of sending empty strings or `null` text.

| Status | Path | Declared parameters and defaults | OpenAPI 200 schema |
| --- | --- | --- | --- |
| ✅ | `/api/metrics` | `start_date`, `end_date`, `category`, `operation_type`; all default absent | `FinancialMovement[]` |
| ✅ | `/api/metrics/facets` | None; there are no date or group filters | `MetricsFacets` |
| ✅ | `/api/metrics/alerts` | `threshold=0.3`, `group_by=month`, `start_date`, `end_date`, `business_type` | `MetricsAlert[]` |
| ✅ | `/api/metrics/categories/top` | `operation_type=outcome`, `limit=5`, `start_date`, `end_date`, `business_type` | `TopCategoryItem[]` |
| ✅ | `/api/metrics/summary` | `group_by=month`, `start_date`, `end_date`, `category`, `operation_type`, `business_type` | `MetricsSummaryItem[]` |
| ✅ | `/api/metrics/b2b` | `start_date`, `end_date`, `category`, `operation_type`; group fixed by path | `FinancialMovement[]` |
| ✅ | `/api/metrics/b2c` | `start_date`, `end_date`, `category`, `operation_type`; group fixed by path | `FinancialMovement[]` |

| Status | Parameter | Exact wire type and API constraints | Feature usage |
| --- | --- | --- | --- |
| ✅ | `start_date`, `end_date` | `string`, OpenAPI `format: date`; use valid calendar `YYYY-MM-DD` values; inclusive independent bounds | All date-aware requests share the applied range; omit blanks |
| ✅ | `category` | `suppliers`, `sales`, `operational`, `administrative`, `others` | Supported on movements/summary; not sent by these features |
| ✅ | `operation_type` | `income` or `outcome` | F3 always explicitly sends `income`; top defaults to `outcome` otherwise |
| ✅ | `business_type` | `B2B` or `B2C` | F3 top and summary each send one explicit group; not supported by metrics/facets |
| ✅ | `group_by` | `day`, `week`, `month`; default `month` | Alerts and group summaries explicitly use `month` |
| ✅ | `threshold` | Number, minimum `0`, no maximum, default `0.3` | UI contract narrows to finite `0.01 <= threshold <= 1.0` |
| ✅ | `limit` | Integer, minimum `1`, maximum `20`, default `5` | F3 always sends `5`; fewer than five rows are valid |

## Exact Response Shapes

✅ Each listed model property is required and non-null. JSON numbers are represented as TypeScript `number`. Arrays are bare arrays, not `{ data: ... }` envelopes. Local aliases in the types deliverable do not rename any wire properties.

| Status | OpenAPI model / local alias | Required properties |
| --- | --- | --- |
| ✅ | `MetricsFacets` / `FacetsResponse` | `operation_types: OperationType[]`, `business_types: BusinessType[]`, `categories: Category[]`, `min_date: string (date)`, `max_date: string (date)` |
| ✅ | `MetricsAlert` / `AlertEntry` | `period: string`, `outcome_total: number`, `baseline_average: number`, `increase_ratio: number` |
| ✅ | `TopCategoryItem` / `CategoryEntry` | `category: Category`, `operation_type: OperationType`, `total_amount: number` |
| ✅ | `MetricsSummaryItem` / `SummaryEntry` | `period: string`, `income: number`, `outcome: number`, `net: number` |
| ✅ | `FinancialMovement` / `FinancialMovement` | `create_date: string (date)`, `amount: number`, `operation_type: OperationType`, `category: Category`, `business_type: BusinessType` |

### Real Response Examples

✅ The following JSON blocks contain actual response values. Array samples are prefixes of the real response; totals/counts are stated separately. Comments outside JSON identify the exact request for automated replay.

✅ Facets, complete response (the same result was returned with the unsupported filters shown in the second request).

<!-- GET /api/metrics/facets -->
```json
{"operation_types":["income","outcome"],"business_types":["B2B","B2C"],"categories":["administrative","operational","others","sales","suppliers"],"min_date":"2025-10-02","max_date":"2026-09-28"}
```

<!-- GET /api/metrics/facets?business_type=B2B&start_date=2099-01-01 -->
```json
{"operation_types":["income","outcome"],"business_types":["B2B","B2C"],"categories":["administrative","operational","others","sales","suppliers"],"min_date":"2025-10-02","max_date":"2026-09-28"}
```

✅ Metrics: 360 unfiltered rows; 90 rows for the filtered request.

<!-- GET /api/metrics -->
```json
[{"create_date":"2025-10-02","amount":10178.62,"operation_type":"income","category":"sales","business_type":"B2B"}]
```

<!-- GET /api/metrics?start_date=2026-01-01&end_date=2026-03-31 -->
```json
[{"create_date":"2026-01-01","amount":6434.18,"operation_type":"outcome","category":"operational","business_type":"B2C"}]
```

✅ Alerts: four unfiltered alerts; five with the selected dates and lower threshold.

<!-- GET /api/metrics/alerts -->
```json
[{"period":"2025-12","outcome_total":103378.98,"baseline_average":51174.1,"increase_ratio":1.0201},{"period":"2026-03","outcome_total":88076.9,"baseline_average":56456.19,"increase_ratio":0.5601}]
```

<!-- GET /api/metrics/alerts?threshold=0.01&start_date=2026-01-01&end_date=2026-09-30 -->
```json
[{"period":"2026-03","outcome_total":88076.9,"baseline_average":38276.88,"increase_ratio":1.301}]
```

✅ Top categories: four unfiltered outcome categories. Each full-range income group has only two rows; these group responses are complete.

<!-- GET /api/metrics/categories/top -->
```json
[{"category":"others","operation_type":"outcome","total_amount":224428.44}]
```

<!-- GET /api/metrics/categories/top?operation_type=income&limit=5&business_type=B2B -->
```json
[{"category":"sales","operation_type":"income","total_amount":557903.97},{"category":"others","operation_type":"income","total_amount":57636.75}]
```

<!-- GET /api/metrics/categories/top?operation_type=income&limit=5&business_type=B2C -->
```json
[{"category":"sales","operation_type":"income","total_amount":574193.41},{"category":"others","operation_type":"income","total_amount":68412.74}]
```

<!-- GET /api/metrics/categories/top?operation_type=income&limit=5&business_type=B2B&start_date=2026-01-01&end_date=2026-03-31 -->
```json
[{"category":"sales","operation_type":"income","total_amount":131534.81},{"category":"others","operation_type":"income","total_amount":17963.64}]
```

✅ Summary: twelve unfiltered months. Group totals are calculated from all returned `income` values, not `net` and not the top-five sum. Full-range totals: B2B `615540.72`, B2C `642606.15`. January-March totals: B2B `149498.45`, B2C `179962.82`.

<!-- GET /api/metrics/summary -->
```json
[{"period":"2025-10","income":106909.67,"outcome":60943.75,"net":45965.92}]
```

<!-- GET /api/metrics/summary?operation_type=income&business_type=B2B -->
```json
[{"period":"2025-10","income":39038.91,"outcome":0,"net":39038.91}]
```

<!-- GET /api/metrics/summary?operation_type=income&business_type=B2C&start_date=2026-01-01&end_date=2026-03-31&group_by=month -->
```json
[{"period":"2026-01","income":61577.82,"outcome":0,"net":61577.82},{"period":"2026-02","income":79348.38,"outcome":0,"net":79348.38},{"period":"2026-03","income":39036.62,"outcome":0,"net":39036.62}]
```

✅ Group movements: B2B has 203 rows unfiltered and 49 in January-March; B2C has 157 and 41 respectively. Both groups contain all five global categories in these ranges. Category membership must still be derived, never assumed from this snapshot.

<!-- GET /api/metrics/b2b -->
```json
[{"create_date":"2025-10-02","amount":10178.62,"operation_type":"income","category":"sales","business_type":"B2B"}]
```

<!-- GET /api/metrics/b2b?start_date=2026-01-01&end_date=2026-03-31 -->
```json
[{"create_date":"2026-01-02","amount":1682.08,"operation_type":"income","category":"sales","business_type":"B2B"}]
```

<!-- GET /api/metrics/b2c -->
```json
[{"create_date":"2025-10-03","amount":5727.57,"operation_type":"outcome","category":"suppliers","business_type":"B2C"}]
```

<!-- GET /api/metrics/b2c?start_date=2026-01-01&end_date=2026-03-31 -->
```json
[{"create_date":"2026-01-01","amount":6434.18,"operation_type":"outcome","category":"operational","business_type":"B2C"}]
```

## Boundary and Behavior Probes

✅ The following date probes were run on metrics, alerts, top categories, and summary. Counts are in that order; top uses its real default `operation_type=outcome`.

| Status | Query | HTTP | Response counts / behavior |
| --- | --- | --- | --- |
| ✅ | `start_date=2026-07-01` | 200 | `90 / 1 / 4 / 3`; lower bound only |
| ✅ | `end_date=2026-01-31` | 200 | `120 / 1 / 4 / 4`; upper bound only |
| ✅ | `start_date=2026-07-01&end_date=2026-01-01` | 200 | `0 / 0 / 0 / 0`; no API order validation |
| ✅ | `start_date=2099-01-01` | 200 | `0 / 0 / 0 / 0`; out-of-dataset dates accepted |
| ✅ | `start_date=2026-01-01&end_date=2026-01-01` | 200 | `3 / 0 / 2 / 1`; same-day inclusive bounds |
| ✅ | `start_date=2026-02-30` or `start_date=` | 422 | `detail[].loc = ["query", "start_date"]`; `date_from_datetime_parsing` |

✅ The B2B/B2C movement routes also accept single bounds: start-only counts `55 / 35`, end-only `64 / 56`; reversed ranges return empty arrays. All tested rows have the group indicated by the path.

| Status | Probe | Observed result |
| --- | --- | --- |
| ✅ | Alerts `threshold=-0.01` | 422, `greater_than_equal`, `ctx.ge=0` |
| ✅ | Alerts `threshold=0 / 0.009 / 0.01 / 0.3 / 1 / 1.01 / 100` | 200; `6 / 5 / 5 / 4 / 1 / 1 / 0` alerts |
| ✅ | Alerts `threshold=abc` | 422, `float_parsing` |
| ✅ | Alerts absent threshold/grouping vs `threshold=0.3&group_by=month` | Identical responses |
| ✅ | Top `limit=0 / 21 / 1.5` | 422; minimum / maximum / integer parsing |
| ✅ | Top `limit=1 / 5 / 20` | 200; `1 / 4 / 4` outcome categories |
| ✅ | Top `operation_type=income` without group | 200; sales `1132097.38`, others `126049.49` |
| ✅ | Top `operation_type=bad` or `business_type=B2X` | 422, `literal_error` |
| ✅ | Metrics `business_type=B2B` | Identical to unfiltered metrics: unknown query ignored |
| ✅ | Facets with date/group query | Identical to unfiltered facets: unknown queries ignored |
| ✅ | Alerts `group_by=week / day` | Period examples `2025-W42` / `2025-10-10` |
| ✅ | Alerts `business_type=B2B` | First alert `2025-12`, outcome `72778.68`, baseline `30771.29`, ratio `1.3651` |
| ✅ | Alerts `group_by=invalid` | 422, `literal_error` |

✅ Example real error body from `threshold=-0.01`:

```json
{"detail":[{"type":"greater_than_equal","loc":["query","threshold"],"msg":"Input should be greater than or equal to 0","input":"-0.01","ctx":{"ge":0}}]}
```

✅ Alert baseline proof from real summary and alert responses: March 2026 has prior monthly outcomes `[60943.75, 41404.44, 103378.98, 51690.68, 24863.08]`. Their mean is `56456.19`, matching `baseline_average`; the last-three mean is `59977.58` and does not match. Filtering to January-September changes the March baseline to `38276.88`. Inspection of `detect_outcome_alerts()` corroborates: all previous returned periods are averaged, the first has no alert, nonpositive baselines are skipped, and the unrounded increase must be strictly greater than threshold. Returned ratios are rounded to four decimals; comparing the displayed rounded value is not a substitute for API detection.

## PM Wording vs API Real

| Status | PM wording / assumption | API reality and evidence | Adopted resolution |
| --- | --- | --- | --- |
| ❌ corrected ✅ | F1 needs a new metrics filter extension | OpenAPI already declares `start_date`/`end_date`; partial and inclusive requests succeed | Use existing filters; no backend change |
| ❌ corrected ✅ | Invalid date order should produce an API error | Reversed range gives `200 []` on all tested date-filtered routes | Validate `start_date <= end_date` in UI; keep last applied range |
| ❌ corrected ✅ | Three-period moving average | March baseline is `56456.19`, not last-three `59977.58` | Column is `Historical average`; preserve server expanding baseline, not the PM algorithm |
| ❌ corrected ✅ | API threshold bounds are `0.01–1.0` | OpenAPI minimum is `0`, no maximum; `0.009` and `1.01` succeed | Enforce PM bounds only at UI boundary; document the wider wire contract |
| ❌ corrected ✅ | Alert column names can be inferred from PM labels | Actual fields: `period`, `outcome_total`, `baseline_average`, `increase_ratio` | Bind exact fields; display ratio multiplied by 100 |
| ❌ corrected ✅ | Ratios are already percentages or capped at 100% | Real ratio `1.0201` means `102.01%` | Percentage presentation only; no clamping |
| ❌ corrected ✅ | Five category rows always exist | Full-range group income top responses have two rows | Render up to five actual rows; no padding or invented categories |
| ❌ corrected ✅ | Income is the top endpoint default | Default is `outcome` | Always send `operation_type=income` |
| ❌ corrected ✅ | Top response includes group, percentages, and group total | Only `category`, `operation_type`, `total_amount` are returned | Group comes from request context; percentage is derived using summary total |
| ❌ corrected ✅ | Top-five sum is a guaranteed group denominator/chart total | No total field in top; summary returns every populated period | Sum `income` across each group's filtered summary, even if top-five currently happens to match |
| ❌ corrected ✅ | Facets provides per-group categories | No facets params or per-group mapping; unsupported filters ignored | Global facets supplies allowed vocabulary; intersect with categories observed in each group's date-filtered `/b2b` or `/b2c` movements, without operation filter |
| ❌ corrected ✅ | `/api/metrics?business_type=...` separates groups | Not in its OpenAPI; probe returns unfiltered data | Use declared `business_type` on top/summary; dedicated group movement paths for category membership |
| ❌ corrected ✅ | Comparison route necessarily compares B2B/B2C income | `/api/metrics/comparison` is a net period comparison per source/OpenAPI, not the chosen income total route | Do not use it; one chart compares the two summary income sums |
| ❌ corrected ✅ | Filtering alerts preserves out-of-range history | March baseline changes after date filtering | Baseline uses only previous populated periods inside the selected range; no hidden lookback |
| ❌ corrected ✅ | Header year can remain a literal | Real facets spans October 2025-September 2026 | Derive available period from `min_date`/`max_date`, never a fixed year |

## Rule Traceability and Existing Frontend

✅ Decision from [derive-period-from-data.md](../../.agents/rules/derive-period-from-data.md): fetch unfiltered facets for the available-range reference and derive `DashboardHeader`'s period from `min_date` and `max_date`. With active bounds, show the requested open/closed range separately; never relabel the global facets as filtered facets. No hardcoded year or dates in components.

✅ Decision from [extract-business-type-filter.md](../../.agents/rules/extract-business-type-filter.md): any future backend filtering consolidation belongs in the shared `filter_movements(..., business_type=...)` abstraction, not repeated endpoint logic. This specification consumes existing declared endpoints and does not claim that consolidation is implemented; backend work is out of scope.

✅ Existing `frontend/src/App.tsx` uses `VITE_API_BASE_URL ?? ""`, relative `/api/metrics`, an HTTP status check, and `FinancialMovement[]`. Existing `financial-types.ts` enums match live OpenAPI. Existing `computeKPIs` and `computeMonthlyData` consume the same movement list; future F1 must feed both from the same filtered response and pass its range to alerts. Existing month labels and percent formatting are presentation logic, not wire fields.

✅ Decision from [log-real-errors-frontend.md](../../.agents/rules/log-real-errors-frontend.md): future request handlers must retain/log the original error and expose useful HTTP status information. Never render a failed request as an empty success.

✅ Decisions from [extract-chart-tooltip.md](../../.agents/rules/extract-chart-tooltip.md) and [test-react-components.md](../../.agents/rules/test-react-components.md): future implementation must reuse a parameterized shared tooltip and cover applicable loading, populated, empty, and error states. No implementation or test files are created here.

✅ The security, dependency, Docker, mock-cache and dead-code rules were reviewed; no changes to their owning runtime files are authorized by this specifications-only task.