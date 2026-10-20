/** Verified OpenAPI operation literals; amounts are not signed by operation. */
export type OperationType = "income" | "outcome";

/** Verified OpenAPI category literals; facets determines available values. */
export type Category =
  | "suppliers"
  | "sales"
  | "operational"
  | "administrative"
  | "others";

/** Verified OpenAPI business-group literals, case-sensitive on the wire. */
export type BusinessType = "B2B" | "B2C";

/** Verified aggregation intervals; these features use month. */
export type GroupBy = "day" | "week" | "month";

/** OpenAPI MetricsFacets; global dataset metadata, never group-filtered. */
export interface FacetsResponse {
  /** Operation values present globally; each value is income or outcome. */
  operation_types: OperationType[];
  /** Business values present globally; each value is B2B or B2C. */
  business_types: BusinessType[];
  /** Global category vocabulary; not a mapping from group to categories. */
  categories: Category[];
  /** Earliest dataset movement date, valid calendar YYYY-MM-DD, inclusive. */
  min_date: string;
  /** Latest dataset movement date, valid calendar YYYY-MM-DD, inclusive. */
  max_date: string;
}

/** OpenAPI MetricsAlert; baseline semantics verified by real response replay. */
export interface AlertEntry {
  /** Period key: YYYY-MM for month, YYYY-Www for ISO week, YYYY-MM-DD for day. */
  period: string;
  /** Recorded outcome sum for this period, numeric amount rounded to 2 decimals. */
  outcome_total: number;
  /** Mean outcome of all earlier populated periods inside the filtered range, 2 decimals. */
  baseline_average: number;
  /** Fractional increase over baseline, rounded to 4 decimals; 0.3 means 30%, not capped at 1. */
  increase_ratio: number;
}

/** Bare OpenAPI MetricsAlert array, chronological; [] is a successful empty result. */
export type AlertsResponse = AlertEntry[];

/** OpenAPI TopCategoryItem; group context comes from the request, not this row. */
export interface CategoryEntry {
  /** Category identifier from the verified category enum. */
  category: Category;
  /** Operation aggregated in this row; income for F3, income or outcome on the API. */
  operation_type: OperationType;
  /** Category amount summed over the selected group/range, rounded to 2 decimals. */
  total_amount: number;
}

/** Bare TopCategoryItem array, descending by total_amount, length at most limit. */
export type TopCategoriesResponse = CategoryEntry[];

/** OpenAPI MetricsSummaryItem; used to derive complete group income totals. */
export interface SummaryEntry {
  /** Aggregation key: YYYY-MM, YYYY-Www, or YYYY-MM-DD according to group_by. */
  period: string;
  /** Sum of income in this populated period, numeric amount rounded to 2 decimals. */
  income: number;
  /** Sum of outcome in this populated period, numeric amount rounded to 2 decimals. */
  outcome: number;
  /** Income minus outcome for this period, numeric amount rounded to 2 decimals. */
  net: number;
}

/** Bare MetricsSummaryItem array, chronological; [] has a derived income sum of 0. */
export type SummaryResponse = SummaryEntry[];

/** OpenAPI FinancialMovement; matches the existing frontend movement wire shape. */
export interface FinancialMovement {
  /** Movement's valid calendar date in YYYY-MM-DD format, without a time zone. */
  create_date: string;
  /** Numeric monetary amount; operation_type identifies income versus outcome. */
  amount: number;
  /** Operation identifier, exactly income or outcome. */
  operation_type: OperationType;
  /** Category identifier from the verified category enum. */
  category: Category;
  /** Business-group identifier, exactly B2B or B2C. */
  business_type: BusinessType;
}

/** Bare FinancialMovement array returned by metrics and dedicated group routes. */
export type MovementsResponse = FinancialMovement[];