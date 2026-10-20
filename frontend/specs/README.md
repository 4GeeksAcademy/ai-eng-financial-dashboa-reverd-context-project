# Financial Dashboard Data Contract

## Start Here

✅ This directory is a Spec Driven Development contract for three future features: a shared optional date range, home outcome alerts, and a B2B/B2C income comparison page. It contains specifications and TypeScript declarations only. No React implementation, frontend network code, or backend changes are part of this delivery.

✅ Read [verification.md](verification.md) first for live OpenAPI evidence, exact response samples, boundary probes, and the complete **PM Wording vs API Real** discrepancy table. Then use [api-types.ts](api-types.ts) for wire responses, [param-types.ts](param-types.ts) for requests, and [components.md](components.md) for typed component props, exact copy, layout, and conditional rendering. The existing memory bank and rules remain authoritative and unchanged.

✅ Status convention: ✅ denotes verified API facts or explicit specification decisions tied to verified evidence. ❌ denotes a rejected assumption with its correction in the verification trail; ❓ would denote an unresolved assumption. No unresolved claims are adopted. Proposed UI behavior is not claimed to exist already.

## Transport and Types

✅ Backend base for verification: `http://localhost:8000`; Swagger UI: `/docs`; schema: `/openapi.json`. All feature endpoints are GET and return JSON. In a future frontend implementation preserve the existing `VITE_API_BASE_URL ?? ""` convention: relative `/api/...` requests use the Vite proxy. Do not hardcode localhost in client components. No authentication or pagination parameters exist on these routes.

✅ Each optional filter is omitted when absent. Empty date input means no query parameter, not `start_date=`, a datetime, or the literal text `null`. OpenAPI allows null for optional filter schemas, but this UI's parameter types deliberately model omission with `undefined` instead. All response properties listed below are required and non-null; collection responses are bare arrays, not envelopes.

| Status | Export / OpenAPI source | Response properties or meaning |
| --- | --- | --- |
| ✅ | `FacetsResponse` / `MetricsFacets` | `operation_types: OperationType[]`, `business_types: BusinessType[]`, `categories: Category[]`, `min_date: string`, `max_date: string` |
| ✅ | `AlertEntry` / `MetricsAlert` | `period: string`, `outcome_total: number`, `baseline_average: number`, `increase_ratio: number` |
| ✅ | `AlertsResponse` | `AlertEntry[]`, chronological |
| ✅ | `CategoryEntry` / `TopCategoryItem` | `category: Category`, `operation_type: OperationType`, `total_amount: number` |
| ✅ | `TopCategoriesResponse` | `CategoryEntry[]`, descending amount, at most `limit` rows |
| ✅ | `SummaryEntry` / `MetricsSummaryItem` | `period: string`, `income: number`, `outcome: number`, `net: number` |
| ✅ | `SummaryResponse` | `SummaryEntry[]`, chronological populated periods only |
| ✅ | `FinancialMovement` | `create_date: string`, `amount: number`, `operation_type: OperationType`, `category: Category`, `business_type: BusinessType` |
| ✅ | `MovementsResponse` | `FinancialMovement[]`, chronological |

✅ Exact enum values: `OperationType = income | outcome`; `BusinessType = B2B | B2C`; `Category = suppliers | sales | operational | administrative | others`; `GroupBy = day | week | month`. Strings are case-sensitive. Date strings are calendar `YYYY-MM-DD`. Monthly period strings are `YYYY-MM`, weekly strings are ISO `YYYY-Www`, and daily strings are `YYYY-MM-DD`.

### Endpoint Matrix

| Status | Path | Request type | Response type | Feature purpose |
| --- | --- | --- | --- | --- |
| ✅ | `/api/metrics/facets` | No parameters | `FacetsResponse` | F1 available dates/header; F3 global category vocabulary |
| ✅ | `/api/metrics` | `MovementsParams` | `MovementsResponse` | F1 all KPIs and both home charts |
| ✅ | `/api/metrics/alerts` | `AlertsParams` | `AlertsResponse` | F2 monthly outcome anomalies |
| ✅ | `/api/metrics/categories/top` | `TopCategoriesParams` | `TopCategoriesResponse` | F3 top-five income categories per explicit group |
| ✅ | `/api/metrics/summary` | `SummaryParams` | `SummaryResponse` | F3 complete income totals per group |
| ✅ | `/api/metrics/b2b` | `MovementsParams` | `MovementsResponse` | F3 observed B2B category membership |
| ✅ | `/api/metrics/b2c` | `MovementsParams` | `MovementsResponse` | F3 observed B2C category membership |

### Parameter Constraints

✅ Every declared query parameter on these paths is optional at the API level. The UI applies the stricter feature rules below at runtime; TypeScript `string` and `number` do not themselves enforce calendar validity or numeric bounds.

| Status | Parameter | API restriction / default | Required UI usage |
| --- | --- | --- | --- |
| ✅ | `start_date` | Optional nullable date, inclusive lower bound; no default bound | `DateRangeFilter.start_date?: string`, valid `YYYY-MM-DD`, omit blank |
| ✅ | `end_date` | Optional nullable date, inclusive upper bound; no default bound | `DateRangeFilter.end_date?: string`, valid `YYYY-MM-DD`, omit blank |
| ✅ | Date ordering | API accepts reversed bounds and returns `200 []` | Require start <= end when both supplied; do not request an invalid draft |
| ✅ | `threshold` | Number >= 0, default 0.3, no maximum | F2 explicitly sends a finite ratio in inclusive 0.01..1.0; initial 0.3 |
| ✅ | `group_by` | `day`, `week`, or `month`, default `month` | F2 alerts and F3 summary explicitly use `month` |
| ✅ | `operation_type` | `income` or `outcome`; top defaults to `outcome`; movements/summary omit by default | F3 top/summary explicitly use `income`; F1 and group-membership movements omit |
| ✅ | `limit` | Integer 1..20 inclusive, default 5 | F3 top always sends 5, without assuming five rows exist |
| ✅ | `business_type` | Optional `B2B` or `B2C` on alerts/top/summary | F3 top/summary send the panel's explicit group; F2 omits; never send to metrics/facets |
| ✅ | `category` | Optional verified category enum on metrics/group movements/summary | These features omit it, particularly on the full-income denominator |

✅ Parameter availability matters: facets accepts none; metrics and `/b2b`/`/b2c` accept dates, category, and operation only; top accepts dates, operation, limit, and business; alerts accepts dates, threshold, grouping, and business; summary accepts dates, grouping, category, operation, and business. Unknown query parameters can be silently ignored, not rejected. Never interpret a successful request with an undeclared filter as evidence it was applied.

## F1: Shared Date Range

✅ Fetch global facets without filters. Show `Available data: {min_date} to {max_date}` beside optional `Start date` and `End date` inputs. Derive the header period from facets, per [derive-period-from-data.md](../../.agents/rules/derive-period-from-data.md); never use a literal year or infer global availability from filtered movements. Keep the global available period distinct from the user's requested range.

✅ Apply valid normalized `DateRangeFilter` bounds to `/api/metrics` and `/api/metrics/alerts`; use the same bounds for every F3 date-aware request when comparing groups. All home KPIs and both monthly charts consume the same filtered movement response through the existing KPI/monthly utilities. Facets remains unfiltered. A cleared range omits both parameters and shows the full dataset. Shared applied bounds persist across home/comparison navigation; incomplete input drafts do not change them.

| Status | Edge case | Required behavior |
| --- | --- | --- |
| ✅ | Only start filled | Send only `start_date`; inclusive lower bound with no upper bound; label `From {start_date}` |
| ✅ | Only end filled | Send only `end_date`; inclusive upper bound with no lower bound; label `Through {end_date}` |
| ✅ | Both blank | No date query params; label `All available dates` |
| ✅ | Start after end | No calls; `Start date must be on or before end date.`; preserve previous applied range and its labeled results |
| ✅ | Impossible date or wrong format | No calls; `Enter a valid date in YYYY-MM-DD format.` |
| ✅ | Same start and end | Valid, inclusive single-day selection, not an error |
| ✅ | Valid dates outside facets bounds | Allow, do not clamp; show `Selected dates extend beyond the available data range.`; request the chosen bounds |
| ✅ | Successful empty movements | Zero KPIs; chart-region message `No financial data for the selected date range.`; do not fabricate months |
| ✅ | Facets fails, metrics succeeds | `Available date range could not be loaded.` and `Period unavailable`; retain manual date entry and successful metrics |

## F2: Monthly Outcome Alerts

✅ Request `/api/metrics/alerts` using the shared bounds, `group_by=month`, and the last valid applied `threshold`, initially `0.3`. Do not send a business group. Display a full-width section below the home charts with a numeric ratio input and a four-column table:

| Status | Column | Source | Format |
| --- | --- | --- | --- |
| ✅ | `Period` | `period` | en-US month/year from monthly `YYYY-MM` |
| ✅ | `Recorded outcome` | `outcome_total` | USD, two decimals |
| ✅ | `Historical average` | `baseline_average` | USD, two decimals |
| ✅ | `Increase` | `increase_ratio` | Ratio multiplied by 100, two decimals, `%` |

✅ Important departure from the PM brief: the server averages **all previous populated periods inside the selected range**, not the previous three. Keep the honest label `Historical average`. The first returned period has no baseline and cannot produce an alert; a nonpositive baseline is skipped. An alert requires an unrounded ratio strictly greater than threshold. Returned ratios are rounded to four decimals and can exceed 1.0; `1.0201` displays as `102.01%`. Never recalculate or apply another detection filter to the returned alerts.

| Status | Edge case | Required behavior |
| --- | --- | --- |
| ✅ | Threshold below 0.01, above 1.0, blank, nonnumeric, or nonfinite | No alert call; `Enter a threshold ratio from 0.01 to 1.0.`; retain last valid applied threshold and matching results, initially 0.3 |
| ✅ | Date changes while threshold draft is invalid | Apply valid new range with last valid threshold, not the invalid draft |
| ✅ | `200 []`, including a single populated period | Keep section and all four headers; spanning row `No anomalies found for the selected date range and threshold.` |
| ✅ | Threshold exactly 0.01 or 1.0 | Valid UI values; send the ratio unchanged |
| ✅ | Request pending or failed | Skeleton while pending; `Alerts could not be loaded.` plus useful status on failure, never the success-empty row |

## F3: B2B vs B2C Income

✅ Proposed frontend route: `/comparison`, not a backend path. Two equal-width panels are side by side on desktop and stacked on mobile, followed by **one** two-bar income comparison chart. Shared date controls have exactly F1 semantics. Each group's response context supplies the group label: `CategoryEntry` has no group field.

✅ For each group `B2B` and `B2C`, send these requests with identical optional dates:

1. `/api/metrics/categories/top?operation_type=income&limit=5&business_type=<group>` => `TopCategoriesResponse` for table rows.
2. `/api/metrics/summary?operation_type=income&group_by=month&business_type=<group>` => `SummaryResponse`. Sum **all** returned `income` amounts, rounding the final sum to two decimals, for the complete group income total. No category filter. Do not use `net` or a top-five sum as the denominator.
3. `/api/metrics/b2b` or `/api/metrics/b2c` with only the date filters => `MovementsResponse`. Use all operations to establish which categories occur in this group within the range.
4. Reuse unfiltered `/api/metrics/facets` => `FacetsResponse`. The per-panel category list is the intersection of `facets.categories` with that group's observed movement categories, in facets order.

✅ Facets has neither group filtering nor per-group category arrays. The intersection is the explicit specification fallback, not a claim that group facets exists. Never call `/api/metrics/facets?business_type=...` or `/api/metrics?business_type=...` for group isolation: the live backend ignored those queries. From [extract-business-type-filter.md](../../.agents/rules/extract-business-type-filter.md), future backend consolidation must reuse `filter_movements(..., business_type=...)`; this contract does not implement or assume that refactor.

✅ Table columns are `Category` (`category`), `Total income` (`total_amount`, USD two decimals), and `Share of group income` (derived `100 * total_amount / completeGroupIncome`, two decimals plus `%`). Show up to five actual rows in API order, no padding. No response has a percentage or group-total property. Displayed category shares are not guaranteed to sum to 100% when only a subset is shown.

✅ The single chart has exactly two categorical points, `B2B` then `B2C`, representing each group's complete filtered income sum from summary. These are not monthly points, net values, top-five subtotals, or values from `/api/metrics/comparison`. The latter is a different net period comparison API and is not used. Both chart totals have visible accessible text and a two-decimal currency tooltip. The current full-range evidence is B2B `615540.72` and B2C `642606.15`, not constants to put into components.

| Status | Edge case | Required behavior |
| --- | --- | --- |
| ✅ | Top array has two rows | Show two real rows, not five; this occurs in both verified full-range income groups |
| ✅ | One group's top is `[]` | Keep panel and headers; `No income categories for B2B in the selected date range.` or the corresponding exact B2C message |
| ✅ | Successful summary is `[]` | Income total is zero; never divide by zero; zero-total shares use `0.00%` |
| ✅ | Positive top amount but successful zero summary | `Income data is inconsistent. Reload this comparison.`; do not fabricate percentages |
| ✅ | Both group totals are zero | Keep both labels and visible `$0.00` totals; `No income for either group in the selected date range.` |
| ✅ | Only one total is zero | Keep its label and zero total alongside the other group's bar |
| ✅ | One summary fails | `Share unavailable` for affected percentages; chart `Income comparison could not be loaded.`; never substitute zero for failure |
| ✅ | Top fails but summary succeeds | Panel `Top categories could not be loaded.`; chart may still use both successful summaries |
| ✅ | Group membership/facets fails | `Categories could not be loaded.`; do not substitute global category membership; independent successful tables/totals may render |
| ✅ | Category intersection is empty | `No categories in this group for the selected date range.`; do not infer a global category belongs to the group |

## Shared Rendering and Error Contract

✅ The currency code is not an API field. USD and en-US formatting are explicit presentation choices consistent with the existing frontend; new tables/tooltips use two decimals. Existing KPI formatting can retain its current whole-dollar convention. No invented currency, percentage, group-total, or group-facets fields may be added to the wire types.

✅ On a valid applied-range change, all affected old results become loading states. Ignore superseded responses and never combine summaries, top rows, or alerts from different applied parameters. Keep facets independent and globally scoped. Failed calls are not successful empty arrays. Invalid drafts make no calls and leave the last applied selection/results clearly labeled.

✅ From [log-real-errors-frontend.md](../../.agents/rules/log-real-errors-frontend.md), future handlers must log the original request error and expose useful HTTP status information. Invalid typed dates/numbers/enums can receive HTTP 422 with `detail[]`; known input failures should already be blocked by UI validation. Network/HTTP failures use the resource-specific messages in [components.md](components.md), not fabricated zero data.

✅ From [extract-chart-tooltip.md](../../.agents/rules/extract-chart-tooltip.md), future chart tooltips must share the parameterized tooltip abstraction. From [test-react-components.md](../../.agents/rules/test-react-components.md), future component implementation must test applicable skeleton, populated, empty, error, and validation states. No runtime cleanup, mock-cache, CORS, Docker, dependency-pin, or dead-code changes are included in this specification delivery.

## Type Verification

✅ Run from `frontend/`:

```bash
npx tsc --noEmit -p specs/tsconfig.json
```

✅ [tsconfig.json](tsconfig.json) extends `../tsconfig.app.json`, explicitly enables `strict`, and includes `./*.ts`. The root frontend solution config and the application's `src/` include do not validate this directory on their own. The contract requires exit code 0 and zero TypeScript errors. Every interface property has JSDoc; no `any` or `object` keyword is used in the type declarations. The component-props block was also compiled in memory against these types without writing implementation files.

✅ The verification trail's 17 real JSON examples were replayed against the running backend; all matched. Snapshot dates reflect the server's generated dataset and must be re-obtained when its date changes. No production behavior is claimed implemented by this successful specification check.