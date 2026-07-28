/**
 * API Response Types — Financial Dashboard
 *
 * Tipos TypeScript para las respuestas de la API del backend.
 * Generados a partir de los modelos Pydantic en backend/app/routes.py.
 *
 * @module specs/api-types
 */

// ---------------------------------------------------------------------------
// Shared literal types — mirrors backend/app/routes.py Literal aliases
// ---------------------------------------------------------------------------

/** Tipo de operación financiera. */
export type OperationType = "income" | "outcome";

/** Tipo de negocio. */
export type BusinessType = "B2B" | "B2C";

/** Categoría de movimiento financiero. */
export type Category =
  | "suppliers"
  | "sales"
  | "operational"
  | "administrative"
  | "others";

// ---------------------------------------------------------------------------
// GET /api/metrics/facets → MetricsFacets
// ---------------------------------------------------------------------------

/**
 * Respuesta del endpoint `/api/metrics/facets`.
 * Contiene los valores únicos disponibles para cada dimensión de filtro
 * y el rango de fechas del dataset.
 */
export interface FacetsResponse {
  /** Lista ordenada de tipos de operación disponibles en los datos. */
  operation_types: OperationType[];

  /** Lista ordenada de tipos de negocio disponibles en los datos. */
  business_types: BusinessType[];

  /** Lista ordenada de categorías de movimiento disponibles en los datos. */
  categories: Category[];

  /**
   * Fecha más antigua del dataset en formato `YYYY-MM-DD`.
   * @example "2024-01-01"
   */
  min_date: string;

  /**
   * Fecha más reciente del dataset en formato `YYYY-MM-DD`.
   * @example "2024-12-31"
   */
  max_date: string;
}

// ---------------------------------------------------------------------------
// GET /api/metrics/alerts → MetricsAlert[]
// ---------------------------------------------------------------------------

/**
 * Una entrada individual de alerta de anomalía.
 * Se genera cuando el outcome de un período supera el umbral
 * de incremento respecto al promedio histórico.
 */
export interface AlertEntry {
  /**
   * Identificador del período analizado en formato ISO
   * (ej: `"2024-03"` para agrupación mensual, `"2024-W12"` semanal).
   */
  period: string;

  /**
   * Total acumulado de egresos (outcome) en el período.
   * @example 15000
   */
  outcome_total: number;

  /**
   * Promedio histórico de egresos hasta el período anterior.
   * Se calcula como el promedio de todos los períodos previos.
   * @example 12000
   */
  baseline_average: number;

  /**
   * Ratio de incremento del outcome respecto al baseline.
   * Se calcula como `(outcome_total - baseline_average) / baseline_average`.
   * Un valor de `0.25` significa un 25% de incremento.
   * @example 0.25
   */
  increase_ratio: number;
}

/** Array de alertas de anomalías. Vacío si ningún período supera el umbral. */
export type AlertsResponse = AlertEntry[];

// ---------------------------------------------------------------------------
// GET /api/metrics/categories/top → TopCategoryItem[]
// ---------------------------------------------------------------------------

/**
 * Una entrada del ranking de categorías por monto total.
 */
export interface CategoryEntry {
  /**
   * Categoría del movimiento.
   * Valores posibles: `"suppliers"`, `"sales"`, `"operational"`,
   * `"administrative"`, `"others"`.
   */
  category: Category;

  /** Tipo de operación al que pertenece la categoría. */
  operation_type: OperationType;

  /**
   * Monto total acumulado para esta categoría y tipo de operación.
   * Redondeado a 2 decimales.
   * @example 45000.50
   */
  total_amount: number;
}

/** Array ordenado por `total_amount` descendente. Máximo `limit` entradas. */
export type TopCategoriesResponse = CategoryEntry[];
