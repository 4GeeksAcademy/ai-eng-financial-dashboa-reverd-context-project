# Análisis de Calidad de Ingeniería — Financial Dashboard

Audit completo del código real en `backend/` y `frontend/`.

---

## Hallazgos

### ✅ Buenas Prácticas

| # | Categoría | Hallazgo | Ubicación | Por qué importa |
|---|-----------|----------|-----------|-----------------|
| B1 | **Testing** | Backend tiene 15 tests que cubren todos los endpoints, filtros combinados, y respuesta de cada ruta. Incluye validación de status code + estructura del payload. | `backend/tests/test_routes.py` (líneas 6-157) | Cualquier refactor de endpoints se detecta inmediatamente. La cobertura incluye casos B2B/B2C, filtros por categoría, y validación de shapes de respuesta. |
| B2 | **Testing** | Frontend tiene tests unitarios para funciones puras (`computeKPIs`, `computeMonthlyData`, `formatCurrency`, `formatPercent`) con edge cases como ingreso cero y cruzar años. | `frontend/src/lib/financial-utils.test.ts` (líneas 12-95) | Las funciones de cálculo financiero son críticas; testearlas aisladas del componente garantiza corrección sin depender del DOM o API. |
| B3 | **Type Safety** | Tipos TypeScript compartidos como interfaces limpias (`FinancialMovement`, `KPIMetrics`, `MonthlyDataPoint`) con alias de tipo `OperationType`, `Category`, `BusinessType`. | `frontend/src/lib/financial-types.ts` (líneas 1-20) | Un contrato de datos explícito entre la API y los componentes. Cambios en la estructura se propagan como errores de compilación. |
| B4 | **Arquitectura** | Funciones puras separadas de los endpoints: `generate_mock_movements()`, `filter_movements()`, `summarize_movements()`, `build_top_categories()`, `detect_outcome_alerts()`. Los endpoints son wrappers delgados. | `backend/app/routes.py` (líneas 94-235) | Facilita testing unitario del backend sin pasar por HTTP. Cada función tiene una sola responsabilidad. |
| B5 | **UX / DX** | Todos los componentes del dashboard (`KPICard`, `IncomeOutcomeChart`, `ProfitPercentChart`) implementan estados de carga con `<Skeleton>` y manejan `loading` prop. También manejan empty state con mensaje "No data available". | `frontend/src/components/dashboard/kpi-card.tsx` (líneas 38-50), `income-outcome-chart.tsx` (líneas 50-66) | Evita flash de contenido vacío y mejora la percepción de performance. Muestra madurez en el manejo de estados asincrónicos. |
| B6 | **DX** | Configuración de Vite con proxy inverso para `/api` → `http://backend:8000`, eliminando problemas de CORS en desarrollo y reflejando la arquitectura productiva. | `frontend/vite.config.ts` (líneas 10-14) | Los desarrolladores no necesitan configurar CORS manualmente ni usar URLs absolutas. Las rutas son relativas en desarrollo y producción. |
| B7 | **Accesibilidad** | Secciones del dashboard usan `aria-label` descriptivos ("Key performance indicators", "Financial charts"). | `frontend/src/App.tsx` (líneas 55, 60) | Asegura que lectores de pantalla identifiquen correctamente las regiones del dashboard. |

### ❌ Malas Prácticas / Riesgos

| # | Categoría | Hallazgo | Ubicación | Por qué importa |
|---|-----------|----------|-----------|-----------------|
| M1 | **Seguridad** | CORS configurado con `allow_origins=["*"]` y `allow_credentials=True`. Combinación incompatible (los navegadores rechazan `*` con credenciales) y potencialmente peligrosa si se cambia a orígenes específicos sin darse cuenta. | `backend/app/main.py` (líneas 7-11) | En producción, cualquier dominio podría hacer peticiones. Si se añade autenticación (cookies/tokens), se expondría a ataques CSRF. |
| M2 | **DX / Configuración** | El único `Dockerfile` mezcla tooling de desarrollo (debugpy en `0.0.0.0:5678`, hot-reload) sin separación entre dev y prod. El repo no tiene un Dockerfile ni config distinta para producción — si esta misma imagen se usara para desplegar, expondría el debugger. | `backend/Dockerfile` (línea 11) | No hay evidencia de un flujo de deploy en el repo, pero mezclar debug tooling en la única imagen disponible es un riesgo latente si se reutiliza tal cual para producción. |
| M3 | **Código muerto** | `frontend/src/lib/mock-data.ts` exporta `mockMovements` (60 registros hardcodeados) pero **no es importado en ningún archivo** del frontend. Es código muerto que puede confundir sobre la fuente real de datos. | `frontend/src/lib/mock-data.ts` (línea 3), confirmado por grep: solo se referencia a sí mismo | Genera confusión: ¿los datos vienen del backend o de este archivo? Mantener código muerto incrementa la superficie de mantenimiento sin valor. |
| M4 | **Performance / Redundancia** | Cada endpoint llama `generate_mock_movements(seed=42)` de forma independiente. Un request a `/api/metrics` + `/api/metrics/summary` + `/api/metrics/facets` genera 360 registros **tres veces**. | `backend/app/routes.py` (líneas 255, 264, 277, 295, 311, 350, 370, 386) | En producción con datos reales, esta duplicación de trabajo sería costosa. Un cache o generación por request sería más eficiente. |
| M5 | **DRY / Inconsistencia** | `get_b2b_metrics` y `get_b2c_metrics` filtran por `business_type` con list comprehension inline, mientras `get_metrics_summary` también filtra inline. Pero `filter_movements()` no soporta `business_type` como parámetro, forzando la duplicación. | `backend/app/routes.py` (líneas 370-371, 386-387, 281-282) | El filtro por `business_type` se repite en 3+ endpoints con código casi idéntico. Si cambia la lógica de filtrado, hay que actualizarlo en múltiples lugares. |
| M6 | **Error handling** | El `.catch()` en `App.tsx` descarta el error original y muestra un mensaje genérico. No se loggea el error ni se muestra el status code. | `frontend/src/App.tsx` (líneas 33-37) | Depurar problemas de conexión es difícil: el usuario ve "No se pudo cargar" sin saber si es 404, 500, timeout, o CORS. |
| M7 | **Hardcoded values** | El período "2024 - Full Year" está hardcodeado en `App.tsx` y como default en `DashboardHeader`. No se deriva de los datos reales de la API. | `frontend/src/App.tsx` (línea 48), `frontend/src/components/dashboard/dashboard-header.tsx` (línea 8) | Si los datos cambian de rango de fechas, el header seguirá mostrando "2024" incorrectamente. |
| M8 | **Reproducibilidad** | `backend/requirements.txt` no tiene versiones pinneadas (`fastapi`, `uvicorn[standard]`, `pytest`, etc.). Un build futuro podría instalar versiones incompatibles. | `backend/requirements.txt` (todas las líneas) | Un `pip install` hoy puede producir un entorno diferente al de ayer, causando "works on my machine". |
| M9 | **DX / Duplicación** | `CustomTooltip` está definido por separado en `income-outcome-chart.tsx` y `profit-percent-chart.tsx` con estructura casi idéntica (diferencia: uno muestra payload iterado, otro muestra un solo valor). | `frontend/src/components/dashboard/income-outcome-chart.tsx` (líneas 24-43), `profit-percent-chart.tsx` (líneas 24-42) | Dos componentes que hacen lo mismo con variaciones menores. Un componente parametrizable reduciría mantenimiento. |
| M10 | **Testing** | No hay tests para los componentes React del frontend (solo se testean las utilidades puras). No hay tests de integración que validen que el dashboard renderiza correctamente con datos. | `frontend/src/lib/` (único directorio con tests) | Un componente podría romper su renderizado sin que los tests lo detecten. Las utilidades pasan pero el dashboard puede fallar visualmente. |

---

## Reglas Propuestas

Basadas en los hallazgos anteriores, como reglas accionables para `.agents/rules`:

1. **R1 — No CORS wildcard en producción** (mitiga M1)
   > El backend NUNCA debe configurar `allow_origins=["*"]`. Usar una lista explícita de dominios permitidos leída de variable de entorno (ej: `CORS_ORIGINS`). En development, usar el proxy de Vite en lugar de CORS abierto.

2. **R2 — Separar Dockerfile de desarrollo y producción** (mitiga M2)
   > Crear `Dockerfile.dev` (con debugpy y `--reload`) y `Dockerfile` de producción sin debug tooling, con `CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]`. `docker-compose.yml` debe apuntar explícitamente a `Dockerfile.dev`.

3. **R3 — Eliminar código muerto** (mitiga M3)
   > Si un archivo no es importado por ningún módulo activo, eliminarlo en el mismo PR donde se detecta. No mantener archivos mock/backup "por si acaso". El fuente de datos mock debe ser único: el backend.

4. **R4 — Extraer filtro de business_type a `filter_movements`** (mitiga M5)
   > Agregar parámetro `business_type: BusinessType | None = None` a `filter_movements()` y reusarlo en todos los endpoints (`/b2b`, `/b2c`, `/summary`). No duplicar lógica de filtrado con list comprehensions inline.

5. **R5 — No regenerar datos en cada request** (mitiga M4)
   > Generar los datos mock una sola vez al arrancar el módulo (o por request con cache) y reutilizarlos en todos los endpoints. Ejemplo: `_MOVEMENTS = generate_mock_movements(seed=42)` como variable de módulo.

6. **R6 — Loguear errores reales en frontend** (mitiga M6)
   > En el `.catch()` de fetch, incluir `console.error(error)` con el objeto de error original. Mostrar al usuario información útil (status code, mensaje) cuando esté disponible, no solo un mensaje genérico.

7. **R7 — Derivar período de datos, no hardcodear** (mitiga M7)
   > Calcular el rango de fechas desde los datos de la API (usando `/api/metrics/facets` para `min_date`/`max_date`) y pasarlo al `DashboardHeader`. No escribir "2024" en código fuente.

8. **R8 — Pinneare dependencias en requirements.txt** (mitiga M8)
   > Usar `==` con versiones específicas en `requirements.txt` (ej: `fastapi==0.115.0`). Regenerar con `pip freeze` después de validar compatibilidad. Mantener un `requirements.lock` o equivalente.

9. **R9 — Extraer `CustomTooltip` compartido** (mitiga M9)
   > Crear un componente `ChartTooltip` parametrizable en `components/ui/` o `components/dashboard/` que reciba `label`, `entries: Array<{name, value, color}>`, y formateo. Reutilizar en ambos charts.

10. **R10 — Testear componentes con React Testing Library** (mitiga M10)
    > Agregar tests de renderizado para los componentes del dashboard que validen: (a) que muestra Skeleton durante `loading=true`, (b) que renderiza KPIs con datos, (c) que muestra error state cuando hay error. Mínimo un test por componente principal.

---

*Audit generado el 2026-07-28. Pendiente de revisión antes de pasar a `.agents/rules`.*
