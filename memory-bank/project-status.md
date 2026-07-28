# Project Status — Financial Dashboard

*Última actualización: 2026-07-28*

---

## Features implementadas

### Dashboard completo (frontend)
- 4 KPIs con iconos, variantes de color y skeleton loading
- 2 gráficos de líneas Recharts (Income vs Outcome, Profit Margin %)
- Estado de carga (Skeleton), estado vacío, estado de error
- Tema oscuro con shadcn/ui + Tailwind v4
- Accesibilidad básica con `aria-label` en secciones
- Evidencia: `frontend/src/App.tsx`, `frontend/src/components/dashboard/`

### API REST completa (backend)
- 9 endpoints con response_model Pydantic
- Filtros: fecha, categoría, tipo de operación, tipo de negocio, agrupación
- Funciones puras separadas de handlers (filtrado, resumen, top categorías, alertas, comparación)
- 15 tests con TestClient cubriendo todos los endpoints
- Evidencia: `backend/app/routes.py`, `backend/tests/test_routes.py`

### Infraestructura funcional
- Docker Compose con hot-reload para ambos servicios
- Proxy inverso Vite configurado para desarrollo
- Puerto de debug remoto (5678) para Python
- Evidencia: `docker-compose.yml`, `frontend/vite.config.ts`

---

## Gaps conocidos

Basados en el audit de ingeniería (`practices-analysis.md`):

### Seguridad
- **CORS wildcard** (`allow_origins=["*"]`): el backend acepta peticiones de cualquier dominio. Peligroso si se añade autenticación. (`backend/app/main.py:7-11`)
- **Debugpy en Dockerfile**: el debugger remoto está expuesto en la imagen Docker. No hay Dockerfile de producción separado. (`backend/Dockerfile:11`)

### Fiabilidad
- **Dependencias sin pin**: `requirements.txt` no especifica versiones. Builds no son reproducibles. (`backend/requirements.txt`)
- **Error handling opaco**: errores de fetch en frontend se descartan, sin log ni info de status code. (`frontend/src/App.tsx:33-37`)

### Mantenibilidad
- **Código muerto**: `mock-data.ts` no es importado por ningún archivo. (`frontend/src/lib/mock-data.ts`)
- **Duplicación de filtrado**: `business_type` se filtra inline en3+ endpoints en lugar de reusar `filter_movements()`. (`backend/app/routes.py:370,386,281`)
- **Duplicación de tooltip**: `CustomTooltip` definido por separado en ambos charts. (`income-outcome-chart.tsx:24-43`, `profit-percent-chart.tsx:24-42`)
- **Período hardcodeado**: "2024 - Full Year" escrito en código, no derivado de datos. (`App.tsx:48`)

### Performance
- **Regeneración redundante**: cada endpoint genera360 registros mock independientemente. (`backend/app/routes.py` —8 llamadas a `generate_mock_movements`)

### Testing
- **Sin tests de componentes React**: solo se testean funciones puras. Un componente puede romper su renderizado sin que se detecte. (`frontend/src/lib/` —único directorio con tests)

---

## Próximas prioridades

Ordenadas por impacto/riesgo, derivadas de las reglas en `.agents/rules/`:

### Prioridad Alta (seguridad / riesgo de producción)

1. **R1 — CORS explícito** (`no-cors-wildcard.md`)
   Reemplazar `allow_origins=["*"]` con lista de orígenes desde variable de entorno. Si se añade auth, un CORS abierto expone a CSRF.

2. **R2 — Separar Dockerfile dev/prod** (`separate-dev-prod-dockerfile.md`)
   Crear `Dockerfile.dev` con debugpy y `Dockerfile` de producción limpio. Evita exponer debugger en despliegues.

3. **R8 — Pinneare dependencias** (`pin-backend-dependencies.md`)
   Agregar `==` con versiones en `requirements.txt`. Sin esto, un build mañana puede romper por dependencia incompatible.

### Prioridad Media (calidad de código / mantenibilidad)

4. **R5 — Cache de datos mock** (`cache-mock-data-generation.md`)
   Generar `_MOVEMENTS` una vez como variable de módulo. Evita regenerar360 registros en cada request.

5. **R4 — Extraer filtro business_type** (`extract-business-type-filter.md`)
   Agregar `business_type` a `filter_movements()`. Elimina duplicación en3+ endpoints.

6. **R3 — Eliminar código muerto** (`no-dead-code.md`)
   Borrar `frontend/src/lib/mock-data.ts`. No es importado y genera confusión.

7. **R6 — Loguear errores reales** (`log-real-errors-frontend.md`)
   Agregar `console.error(error)` en `.catch()`. Facilita debugging en producción.

### Prioridad Baja (DX / polish)

8. **R7 — Derivar período de datos** (`derive-period-from-data.md`)
   Usar `/api/metrics/facets` para obtener min/max dates en lugar de hardcodear "2024".

9. **R9 — Extraer CustomTooltip** (`extract-chart-tooltip.md`)
   Crear `ChartTooltip` compartido. Reduce duplicación entre ambos charts.

10. **R10 — Testear componentes React** (`test-react-components.md`)
    Agregar tests de renderizado con React Testing Library. Cubre gaps de testing visual.
