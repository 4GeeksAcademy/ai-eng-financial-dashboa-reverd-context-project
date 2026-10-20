import type { BusinessType, Category, GroupBy, OperationType } from "./api-types";

/** UI request contract: absent optional filters are omitted, never serialized as null or empty text. */
export interface DateRangeFilter {
  /** Inclusive lower bound; wire parameter start_date, valid calendar YYYY-MM-DD; omit if blank. */
  start_date?: string;
  /** Inclusive upper bound; wire parameter end_date, valid calendar YYYY-MM-DD; omit if blank. */
  end_date?: string;
}

/** GET /api/metrics/alerts; numeric/date bounds require runtime UI validation. */
export interface AlertsParams extends DateRangeFilter {
  /** Fractional threshold; API >= 0 with default 0.3, UI finite 0.01..1.0 inclusive. */
  threshold?: number;
  /** Aggregation day, week, or month; API default month, F2 explicitly sends month. */
  group_by?: GroupBy;
  /** Optional API group B2B or B2C; F2 omits it to include both groups. */
  business_type?: BusinessType;
}

/** GET /api/metrics/categories/top; F3 explicitly provides income, 5, and one business group. */
export interface TopCategoriesParams extends DateRangeFilter {
  /** API income or outcome, default outcome; F3 must send income explicitly. */
  operation_type?: OperationType;
  /** Maximum rows; integer 1..20, API default 5; F3 always sends 5. */
  limit?: number;
  /** Optional API group B2B or B2C; omission combines groups, so F3 requires a value. */
  business_type?: BusinessType;
}

/** GET /api/metrics/summary; F3 sums income, not net, across the returned periods. */
export interface SummaryParams extends DateRangeFilter {
  /** Aggregation day, week, or month; default month; F3 explicitly sends month. */
  group_by?: GroupBy;
  /** Optional category enum filter; F3 omits it so the denominator covers all categories. */
  category?: Category;
  /** Optional income or outcome filter; F3 explicitly sends income. */
  operation_type?: OperationType;
  /** Optional B2B or B2C filter; F3 requires the corresponding panel's group. */
  business_type?: BusinessType;
}

/** GET /api/metrics, /api/metrics/b2b, or /api/metrics/b2c; no business_type query parameter. */
export interface MovementsParams extends DateRangeFilter {
  /** Optional category enum filter; F1 and F3 category-membership requests omit it. */
  category?: Category;
  /** Optional income or outcome filter; F1 and F3 category-membership requests omit it. */
  operation_type?: OperationType;
}