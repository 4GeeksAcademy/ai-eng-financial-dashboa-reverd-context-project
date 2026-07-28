/**
 * API Query Parameter Types — Financial Dashboard
 *
 * Tipos TypeScript para los parámetros de query string de la API.
 * Derivados de los parámetros FastAPI Query() en backend/app/routes.py.
 *
 * @module specs/param-types
 */

import type { OperationType } from "./api-types";

// ---------------------------------------------------------------------------
// Shared: date range filter
// ---------------------------------------------------------------------------

/**
 * Filtro de rango de fechas opcional.
 * Usado como base por múltiples endpoints que aceptan
 * `start_date` y `end_date` como query params opcionales.
 */
export interface DateRangeFilter {
  /**
   * Fecha de inicio del rango en formato `YYYY-MM-DD`.
   * Si se omite, no se aplica filtro inferior.
   * @example "2024-01-01"
   */
  startDate?: string;

  /**
   * Fecha de fin del rango en formato `YYYY-MM-DD`.
   * Si se omite, no se aplica filtro superior.
   * @example "2024-06-30"
   */
  endDate?: string;
}

// ---------------------------------------------------------------------------
// GET /api/metrics/alerts query params
// ---------------------------------------------------------------------------

/**
 * Parámetros de query para `GET /api/metrics/alerts`.
 *
 * El endpoint detecta períodos cuyo outcome supera un umbral
 * de incremento respecto al promedio histórico.
 */
export interface AlertsParams extends DateRangeFilter {
  /**
   * Umbral mínimo de incremento para disparar una alerta.
   * Valor entre `0.01` y `1.0` (sin límite superior explícito en backend,
   * pero `ge=0` en Query). Un valor de `0.3` significa que se alerta
   * cuando el outcome supera el promedio histórico en un 30% o más.
   * @default 0.3
   * @example 0.25
   */
  threshold: number;
}

// ---------------------------------------------------------------------------
// GET /api/metrics/categories/top query params
// ---------------------------------------------------------------------------

/**
 * Parámetros de query para `GET /api/metrics/categories/top`.
 *
 * Retorna las categorías con mayor monto total para un tipo de operación.
 */
export interface TopCategoriesParams extends DateRangeFilter {
  /**
   * Tipo de operación para filtrar las categorías.
   * Solo se incluyen movimientos de este tipo en el ranking.
   */
  operationType: OperationType;

  /**
   * Número máximo de categorías a retornar.
   * Rango permitido por el backend: `1` a `20`.
   * @default 5
   * @example 10
   */
  limit: number;
}
