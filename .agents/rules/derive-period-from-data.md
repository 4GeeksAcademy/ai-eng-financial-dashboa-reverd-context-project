# Derivar período de datos, no hardcodear

## Alcance
`frontend/src/App.tsx`, `frontend/src/components/dashboard/dashboard-header.tsx`.

## Regla
Calcular el rango de fechas visible desde los datos de la API (usando el endpoint `/api/metrics/facets` para obtener `min_date` y `max_date`) y pasarlo al `DashboardHeader`. No escribir literales como "2024" en el código fuente de componentes.

## Razón
Hallazgo M7: `App.tsx` (línea 48) pasa `period="2024 - Full Year"` como literal hardcodeado a `DashboardHeader`. El default de `DashboardHeader` (línea 8) también contiene `"2024 — Full Year"`. Si los datos cambian de rango de fechas, el header seguirá mostrando "2024" incorrectamente.

## Ejemplo

```typescript
// ❌ Incorrecto — período hardcodeado
<DashboardHeader period="2024 - Full Year" />

// ✅ Correcto — período derivado de facets
const [facets, setFacets] = useState<{ min_date: string; max_date: string } | null>(null);

useEffect(() => {
  fetch(`${API_BASE_URL}/api/metrics/facets`)
    .then(res => res.json())
    .then(setFacets);
}, []);

const periodLabel = facets
  ? `${formatMonthYear(facets.min_date)} – ${formatMonthYear(facets.max_date)}`
  : "Loading...";

<DashboardHeader period={periodLabel} />
```
