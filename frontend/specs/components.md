# Component Specifications

## Scope and Conventions

✅ Proposed UI contract, grounded in [verification.md](verification.md). No component, router, request handler, or backend change is implemented here. All API facts are verified there; component names, props, messages, routes, and derived values below are explicit design decisions, not purported OpenAPI fields. There are no unresolved API assumptions.

✅ Preserve the current dashboard's Tailwind/shadcn styling, Lucide icons, KPI utilities, responsive content width, and Recharts conventions. Home remains `/`; the proposed comparison view is `/comparison` (a frontend route, not an API endpoint). A two-item navigation exposes `Overview` and `B2B vs B2C` with an active state. Both pages reuse the same applied date range while navigating; an empty initial range means the complete dataset. Threshold belongs only to home.

✅ All date-filtered resources are identified by a request key containing the normalized applied range and all endpoint-specific parameters. Ignore superseded responses. Never present results for different ranges or thresholds as one snapshot. After a valid range change, immediately replace affected old results with loading states. Keep unaffected facets available. Loading, successful empty data, and errors are distinct states.

## Typed Props

✅ This single TypeScript block defines the proposed props, not implementations. Imports refer to the Phase 2 types. UI-only identifiers such as `status`, `onApply`, and `facets` are not serialized. All exported interfaces are compile-checkable together with the types.

```typescript
import type {
  AlertsResponse,
  BusinessType,
  Category,
  FacetsResponse,
  MovementsResponse,
  SummaryResponse,
  TopCategoriesResponse,
} from "./api-types";
import type {
  AlertsParams,
  DateRangeFilter,
  SummaryParams,
  TopCategoriesParams,
} from "./param-types";

export type Resource<T> =
  | {
      /** UI-only pending request discriminator. */
      status: "loading";
    }
  | {
      /** UI-only failed request discriminator; never interpreted as empty data. */
      status: "error";
      /** Original request error, including HTTP status in its message when available. */
      error: Error;
    }
  | {
      /** UI-only successful request discriminator; data may be an empty array. */
      status: "success";
      /** Exact typed successful endpoint response. */
      data: T;
    };

export type HomeAlertsParams = AlertsParams & {
  /** Applied finite ratio in the inclusive UI range 0.01..1.0. */
  threshold: number;
  /** F2 always aggregates monthly. */
  group_by: "month";
  /** F2 combines groups; do not send a group parameter. */
  business_type?: never;
};

export type GroupTopParams = TopCategoriesParams & {
  /** F3 always ranks income, overriding the endpoint's outcome default. */
  operation_type: "income";
  /** F3 requests at most five category rows. */
  limit: 5;
  /** Explicit group for this panel, B2B or B2C. */
  business_type: BusinessType;
};

export type GroupSummaryParams = SummaryParams & {
  /** F3 sums the monthly income values. */
  group_by: "month";
  /** F3 totals income only. */
  operation_type: "income";
  /** Explicit group matching the corresponding top request. */
  business_type: BusinessType;
  /** Never restrict the percentage denominator to a category. */
  category?: never;
};

export interface DateRangeFilterProps {
  /** Current normalized applied bounds; an absent bound is open-ended. */
  value: DateRangeFilter;
  /** Global metadata resource; dates and available range are never hardcoded. */
  facets: Resource<FacetsResponse>;
  /** Apply a validated range; {} clears both bounds and requests all data. */
  onApply: (range: DateRangeFilter) => void;
}

export interface AvailableDateRangeProps {
  /** Global metadata, including required YYYY-MM-DD min_date and max_date. */
  facets: Resource<FacetsResponse>;
}

export interface HomeDashboardProps {
  /** Shared date controls and unfiltered available-range reference. */
  dateFilter: DateRangeFilterProps;
  /** Filtered movements feeding every existing KPI and both monthly charts. */
  movements: Resource<MovementsResponse>;
  /** Alert section for the same applied range. */
  alerts: AlertsSectionProps;
}

export interface AlertsSectionProps {
  /** Applied monthly parameters; bounds must equal home dateFilter.value. */
  params: HomeAlertsParams;
  /** Exact alerts response for params. */
  alerts: Resource<AlertsResponse>;
  /** Apply valid parameters, preserving the shared range and monthly grouping. */
  onApply: (params: HomeAlertsParams) => void;
}

export interface ThresholdControlProps {
  /** Last valid applied ratio, initially 0.3, inclusive 0.01..1.0. */
  value: number;
  /** Apply only a finite valid ratio; invalid drafts never invoke this callback. */
  onApply: (threshold: number) => void;
}

export interface AlertsTableProps {
  /** Successful response rows, chronological; [] renders the explicit empty row. */
  entries: AlertsResponse;
}

export interface ComparisonPanelProps {
  /** Top request identifying the panel's group and selected bounds. */
  params: GroupTopParams;
  /** Top-five resource for the exact panel group/range. */
  top: Resource<TopCategoriesResponse>;
  /** Complete monthly income summary for the same group/range, no category filter. */
  summary: Resource<SummaryResponse>;
  /** Group-specific date-filtered movements, without operation/category filters. */
  movements: Resource<MovementsResponse>;
  /** Global facets used as category vocabulary, not as per-group facets. */
  facets: Resource<FacetsResponse>;
}

export interface ComparisonPageProps {
  /** Same shared applied range used by home and both panels. */
  dateFilter: DateRangeFilterProps;
  /** B2B panel; params.business_type must be B2B. */
  b2b: ComparisonPanelProps;
  /** B2C panel; params.business_type must be B2C. */
  b2c: ComparisonPanelProps;
}

export interface TopCategoriesTableProps {
  /** Descending successful API rows; render at most five without padding. */
  entries: TopCategoriesResponse;
  /** Complete matching summary; sum income for the percentage denominator. */
  summary: SummaryResponse;
  /** Request context for empty text and accessible group labels. */
  business_type: BusinessType;
}

export interface GroupCategoriesProps {
  /** B2B or B2C context, not a field supplied by global facets. */
  business_type: BusinessType;
  /** Facets vocabulary intersected with this group's observed movement categories. */
  categories: Category[];
}

export interface GroupIncomeChartProps {
  /** All B2B monthly income rows for the shared range. */
  b2b: Resource<SummaryResponse>;
  /** All B2C monthly income rows for the shared range. */
  b2c: Resource<SummaryResponse>;
}

export interface DashboardNavigationProps {
  /** Proposed frontend path, never sent to the backend as a parameter. */
  currentPath: "/" | "/comparison";
  /** Navigate without discarding the shared applied date range. */
  onNavigate: (path: "/" | "/comparison") => void;
}
```

## F1: Home Date Range

✅ `HomeDashboard` is the specification boundary around the existing home orchestration. Layout order: `DashboardNavigation`, existing `DashboardHeader`, `DateRangeFilter`, existing KPI row, existing two-chart row, then `AlertsSection`. `DateRangeFilter` uses `DateRangeFilterProps`; `AvailableDateRange` uses `AvailableDateRangeProps`. Controls sit in an unframed wrapping row on desktop and stack on mobile. Labels are `Start date` and `End date`; both inputs are optional native date inputs. `Apply` commits both drafts together; `Clear` clears both drafts, commits `{}`, and reloads all date-aware resources.

✅ `AvailableDateRange` appears beside the inputs as `Available data: {min_date} to {max_date}` using successful unfiltered facets. While pending: `Loading available dates...`. On failure: `Available date range could not be loaded.` Keep valid manual date entry usable; never invent min/max dates. A facets failure must not discard independently successful metric data.

✅ Decision from [derive-period-from-data.md](../../.agents/rules/derive-period-from-data.md): `DashboardHeader` receives its period derived from facets `min_date`/`max_date`, formatted in en-US month/year notation (including both years if different); no literal year or fallback year. While facets loads use `Loading period...`; on failure use `Period unavailable`. The separate range controls show the applied user selection: `All available dates`, `From {start_date}`, `Through {end_date}`, or `{start_date} to {end_date}`. Global facets never masquerades as metadata for the filtered subset.

✅ Draft normalization/validation before applying:

1. Empty input becomes an omitted property, not `""`. If only start is filled, send only `start_date` (inclusive lower bound); if only end is filled, send only `end_date` (inclusive upper bound). Both blank means no date params. This matches the live single-bound probes.
2. Validate a real calendar date in `YYYY-MM-DD` form, not only a regex. Invalid input shows `Enter a valid date in YYYY-MM-DD format.` and makes no request. Do not convert through local time zones or serialize a datetime.
3. If both valid dates exist, require start <= end; equal dates are allowed. Otherwise show `Start date must be on or before end date.` Make no requests, retain the previous applied range, and leave its labeled results visible. On initial invalid drafts the applied range remains `{}`.
4. Dates outside facets bounds are allowed, not clamped or blocked. Show `Selected dates extend beyond the available data range.` as nonblocking text. Bounds are reference information, not restrictive input min/max. A partially overlapping range returns the intersection; a completely disjoint range returns successful empty data.

✅ On valid apply, replace the shared applied range and use it for `/api/metrics` and `/api/metrics/alerts`, as well as all F3 date-aware requests when that page is opened. Recompute all KPIs and both monthly charts from the same `MovementsResponse`; do not retain unfiltered KPIs beside filtered charts. Facets stays unfiltered so its global availability reference does not shrink. The existing utility type shapes match `MovementsResponse` structurally; no second mock dataset is introduced.

✅ Home movement rendering: pending => existing KPI/chart skeletons; nonempty success => existing KPI and chart displays; `[]` => zero KPI values (including zero profit margin) plus `No financial data for the selected date range.` in the chart region instead of fabricated zero months. Request failure => `Financial data could not be loaded.` plus useful HTTP status; render neither zero KPIs nor success-empty charts. Alert requests have independent loading/error states under the same applied range.

## F2: Outcome Alerts

✅ `AlertsSection` uses `AlertsSectionProps` and always occupies a full-width section below the home charts, titled `Outcome alerts`. Its `ThresholdControl` uses `ThresholdControlProps`; successful rows go to `AlertsTable` using `AlertsTableProps`. The control label is `Increase threshold (ratio)` with numeric input attributes `min=0.01`, `max=1`, `step=0.01`; step is an editing aid, not a requirement that values be multiples of 0.01. Initial applied value is `0.3`. An explicit `Apply` commits a valid draft. No sliders or preset percentage chips replace the numeric ratio input.

✅ A blank, nonnumeric, nonfinite, below-0.01, or above-1.0 threshold draft shows `Enter a threshold ratio from 0.01 to 1.0.` with `aria-invalid=true`; do not call alerts, clamp, or reset silently. Keep the last valid applied ratio and matching results (initially `0.3`). Label them `Applied threshold: {ratio}` so an invalid draft is not mistaken for the active filter. A valid new date range still uses that last valid threshold, never the invalid draft. Valid threshold changes affect only alerts, not movement requests or facets.

✅ Every alerts request sends `group_by=month`, the applied `threshold`, and the same optional date bounds as F1; omit `business_type`. Never reuse alerts from another range. API `baseline_average` is the mean of all earlier populated monthly periods within the selected range, not a rolling three-month mean. Do not synthesize missing months, fetch earlier history, or recalculate anomalies locally. Detection is strictly above the threshold before response rounding.

| Status | Column label | Wire field and TypeScript type | Presentation |
| --- | --- | --- | --- |
| ✅ | `Period` | `AlertEntry.period: string` | Parse monthly `YYYY-MM` as calendar month; display en-US `Mon YYYY` |
| ✅ | `Recorded outcome` | `AlertEntry.outcome_total: number` | en-US USD currency, exactly two decimals |
| ✅ | `Historical average` | `AlertEntry.baseline_average: number` | en-US USD currency, exactly two decimals; never label it a three-period moving average |
| ✅ | `Increase` | `AlertEntry.increase_ratio: number` | Multiply by 100; exactly two decimal places and `%`, e.g. `0.5601` => `56.01%`, `1.0201` => `102.01%` |

✅ Currency is an explicit presentation convention inherited from the existing frontend's USD formatter; the API does not supply a currency code. Use two decimals in the new monetary tables and chart tooltips even though existing KPI cards round to whole dollars. Do not add a currency field to response types.

✅ Conditional rendering: pending => retain section title/controls and a four-column skeleton; error => `Alerts could not be loaded.` with available HTTP status, no success-empty row; success `[]` => keep table headers and one row spanning four columns with exact text `No anomalies found for the selected date range and threshold.` Nonempty success => chronological rows exactly as returned. A one-period selection may have outcomes and no alerts because there is no prior baseline. No dismiss controls or unsupported pagination are specified.

## F3: B2B vs B2C Comparison

✅ `ComparisonPage` uses `ComparisonPageProps`. Layout: shared navigation, page heading `B2B vs B2C`, shared `DateRangeFilter`, two unframed `ComparisonPanel` sections (`B2B` left, `B2C` right), then exactly one full-width `GroupIncomeChart`. Panels use equal grid columns on desktop and stack B2B then B2C on mobile. Tables may scroll horizontally within the content width; text and numeric columns must not overlap. Date behavior, available-range reference, and validation are identical to F1.

✅ `ComparisonPanel` uses `ComparisonPanelProps`; each panel receives its own `params.business_type`. For each group and one applied range, obtain:

1. `TopCategoriesResponse` from `/api/metrics/categories/top` with `GroupTopParams`: `operation_type=income`, `limit=5`, explicit `business_type`, optional dates.
2. `SummaryResponse` from `/api/metrics/summary` with `GroupSummaryParams`: `operation_type=income`, `group_by=month`, the same group/dates, no category filter. `totalIncome = sum(entry.income)` across the complete array, round the final sum to two decimals; `[]` means zero.
3. `MovementsResponse` from `/api/metrics/b2b` or `/api/metrics/b2c` with only the same optional dates. Do not add `business_type` to these paths or filter to income: these rows establish all category membership in that group and selected range.
4. Reuse the successful global `FacetsResponse` from `/api/metrics/facets`. Never send unsupported date or business filters to facets.

✅ `GroupCategories` uses `GroupCategoriesProps`. Derive its `categories` by preserving `facets.categories` order and retaining entries observed in this group's movements. Render a plain `Categories` list under the panel heading. This explicitly resolves the lack of group-scoped facets: allowed identifiers originate in facets; membership originates in group movements, not a fabricated facets property. Do not imply every group has every global category. Empty intersection => `No categories in this group for the selected date range.` Metadata pending => `Loading categories...`; facets or membership failure => `Categories could not be loaded.` Top tables and summary totals may still render independently; no fallback to global membership.

✅ `TopCategoriesTable` uses `TopCategoriesTableProps`. Three columns: `Category` (`CategoryEntry.category`, literal identifier), `Total income` (`CategoryEntry.total_amount`, USD two decimals), `Share of group income` (derived `100 * total_amount / totalIncome`, two decimals plus `%`). Preserve descending API row order, never pad to five rows. The percentage denominator includes every category in the same group/date range, not just the displayed rows. Partial percentages need not sum to 100%. Round presentation last. Never add a `percentage`, `total`, or `business_type` field to `CategoryEntry`.

✅ If total income is zero, show `0.00%` for shares and avoid division by zero; successful zero totals are not errors. Nonempty positive top data with zero/missing successful summary is an inconsistent dataset: show `Income data is inconsistent. Reload this comparison.` and do not display fabricated shares. If summary is pending, show loading in the share column; if it fails, show `Share unavailable` while retaining successful category amounts. If top fails, show `Top categories could not be loaded.` The other panel remains independently usable.

✅ If top succeeds as `[]`, keep that panel heading, table headers, and metadata; show one spanning row `No income categories for B2B in the selected date range.` or `No income categories for B2C in the selected date range.` The panel never disappears. A loading top uses a three-column skeleton, not the empty message. Totals and the shared chart depend on summaries, not on top success; a failed top request must not force successful income totals to zero.

✅ `GroupIncomeChart` uses `GroupIncomeChartProps`. It is one categorical two-bar chart, not a timeline and not two separate charts: first point labeled `B2B` equals the sum of all B2B summary `income`; second point labeled `B2C` equals the analogous B2C sum. Both summaries use exactly the same applied range. The vertical axis is income in the existing USD presentation convention. A tooltip and a visible text total for each group expose exact two-decimal values; the chart is not the sole accessible representation.

✅ Chart conditions: either summary pending => one chart skeleton; either summary failed => `Income comparison could not be loaded.` (do not turn a failed group into zero); both summaries successful => render exactly two labeled values including a real zero. If both are zero, retain both group labels and visible `$0.00` totals plus `No income for either group in the selected date range.` With only one zero, show its label and zero total alongside the other's bar. The full-range verification snapshot yields B2B `$615,540.72` and B2C `$642,606.15`; these are examples, never hardcoded values.

## Implementation Acceptance Boundaries

✅ From [extract-business-type-filter.md](../../.agents/rules/extract-business-type-filter.md): group filtering is a shared backend abstraction concern. No backend consolidation is included or presumed; clients use existing declared group queries/paths and do not duplicate a new backend filter implementation. Do not extend `/api/metrics` or facets with ignored parameters.

✅ From [log-real-errors-frontend.md](../../.agents/rules/log-real-errors-frontend.md): future request handlers log original errors and expose useful HTTP status information. Each resource has an explicit error branch; validation errors cause no request. Retry uses the current applied parameters, never invalid drafts or previous request keys.

✅ From [extract-chart-tooltip.md](../../.agents/rules/extract-chart-tooltip.md): future chart implementation shares a parameterized `ChartTooltip`, including currency formatting, instead of defining another private duplicate. From [test-react-components.md](../../.agents/rules/test-react-components.md): future component tests cover applicable loading, data, empty, error, validation, and shared-range behavior. This delivery defines those expectations without creating components or tests.

✅ Controls have associated labels, errors linked with `aria-describedby`, and disabled submit behavior while drafts are invalid. Request updates expose loading status without removing section headings. Tables retain semantic headers and accessible group names. All visible status messages above are exact English copy; validation details and API status text may be appended without replacing the primary message.