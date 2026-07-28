# Product Overview — Financial Dashboard

## Qué es

Dashboard financiero que visualiza métricas de ingresos y egresos de una empresa. Aplicación de dos capas (frontend React + backend FastAPI) con datos simulados. No hay base de datos ni integración real — toda la información se genera con `random.seed(42)` para ser reproducible (`backend/app/routes.py:94`, `generate_mock_movements`).

## A quién sirve

Equipos financieros o ejecutivos que necesitan una vista consolidada de movimientos económicos clasificados por tipo de operación (income/outcome), categoría y tipo de negocio (B2B/B2C).

## Features implementadas

### KPIs principales (frontend)
Cuatro tarjetas con valores clave: Total Income, Total Outcome, Profit y Profit Margin. Cada una con icono, variante de color y helper text.
- Evidencia: `frontend/src/components/dashboard/kpi-row.tsx`, `kpi-card.tsx`

### Gráficos de tendencia mensual
- **Income vs. Outcome**: gráfico de líneas Recharts comparando ingresos vs. egresos por mes.
  - Evidencia: `frontend/src/components/dashboard/income-outcome-chart.tsx`
- **Profit Margin %**: gráfico de línea del porcentaje de ganancia mensual.
  - Evidencia: `frontend/src/components/dashboard/profit-percent-chart.tsx`

### Estados de carga y error
Skeleton placeholders durante carga (`loading=true`), empty state "No data available", y banner de error con mensaje genérico.
- Evidencia: `kpi-card.tsx:38-50`, `income-outcome-chart.tsx:50-66`, `App.tsx:50-53`

### API de datos financieros (backend)
9 endpoints REST bajo `/api/`:

| Endpoint | Función |
|----------|---------|
| `GET /health` | Health check |
| `GET /api/metrics` | Movimientos filtrables por fecha, categoría, tipo de operación |
| `GET /api/metrics/facets` | Metadatos: tipos de operación, negocio, categorías, rango de fechas |
| `GET /api/metrics/summary` | Resumen agrupado por día/semana/mes |
| `GET /api/metrics/categories/top` | Top N categorías por tipo de operación |
| `GET /api/metrics/comparison` | Comparación neta entre dos períodos |
| `GET /api/metrics/alerts` | Alertas por incremento de egresos |
| `GET /api/metrics/b2b` | Movimientos B2B |
| `GET /api/metrics/b2c` | Movimientos B2C |

- Evidencia: `backend/app/routes.py:240-400`

### Filtros disponibles en API
Rango de fechas (`start_date`/`end_date`), categoría (`category`), tipo de operación (`operation_type`), tipo de negocio (`business_type`), agrupación (`group_by: day/week/month`), umbral de alerta (`threshold`).
- Evidencia: parámetros Query en `backend/app/routes.py`

### Categorías de movimientos
`sales`, `suppliers`, `operational`, `administrative`, `others`.
- Evidencia: `backend/app/routes.py:8`, tipo `Category`

### Tema visual
Modo oscuro forzado con shadcn/ui (estilo "new-york"), Tailwind CSS v4 con variables CSS para income/outcome/profit.
- Evidencia: `frontend/src/App.tsx:48` (`className="dark"`), `frontend/components.json`

## Lo que NO está implementado (aunque la API lo soporta)

- Los filtros B2B/B2C existen en la API pero el frontend solo consume `/api/metrics` sin parámetros de negocio.
- Los endpoints `/api/metrics/comparison`, `/api/metrics/alerts`, `/api/metrics/categories/top` no se consumen en el frontend.
- No hay autenticación, ni base de datos, ni persistencia.
