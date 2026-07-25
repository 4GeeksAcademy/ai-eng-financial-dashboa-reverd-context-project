# Resumen Técnico del Proyecto — Financial Dashboard

## 1. Propósito funcional de la aplicación

La aplicación es un **dashboard financiero** que visualiza métricas de ingresos y egresos de una empresa. Los datos presentados incluyen:

- **KPIs generales**: ingreso total, egreso total, ganancia neta y margen de ganancia porcentual. (`frontend/src/components/dashboard/kpi-row.tsx`)
- **Evolución mensual**: gráfico de línea comparando ingresos vs. egresos mes a mes. (`frontend/src/components/dashboard/income-outcome-chart.tsx`)
- **Margen de ganancia mensual**: gráfico de línea del porcentaje de ganancia sobre ingresos por mes. (`frontend/src/components/dashboard/profit-percent-chart.tsx`)
- **API de datos financieros**: el backend expone datos mock (simulados) con movimientos de tipo "income" y "outcome", filtrables por rango de fechas, categoría, tipo de operación y tipo de negocio (B2B/B2C). (`backend/app/routes.py`)

**No hay base de datos ni integración real**: toda la información es generada aleatoriamente con semilla fija (`seed=42`) para que sea reproducible. (`backend/app/routes.py`, función `generate_mock_movements`)

---

## 2. Arquitectura general y comunicación frontend-backend

Arquitectura de **dos servicios separados** que se comunican vía HTTP/REST:

- **Backend**: FastAPI corriendo en `http://backend:8000` dentro de Docker. Sirve datos JSON en endpoints bajo `/api/`.
- **Frontend**: Vite + React corriendo en `http://localhost:5173`. En desarrollo, Vite hace proxy inverso: las peticiones a `/api` se reenvían al backend (`http://backend:8000`). (`frontend/vite.config.ts`, bloque `server.proxy`)

En el frontend, la comunicación se realiza mediante `fetch()` a `${API_BASE_URL}/api/metrics` donde `API_BASE_URL` se define desde la variable de entorno `VITE_API_BASE_URL` (vacía por defecto, lo que hace que las rutas sean relativas y use el proxy de Vite). (`frontend/src/App.tsx`, líneas 13-18)

No hay autenticación, ni WebSockets, ni caché intermedia entre frontend y backend.

---

## 3. Entry points clave

### Backend
- **Punto de entrada de la aplicación**: `backend/app/main.py` — crea la instancia de `FastAPI(title="Financial Metrics API")`, configura CORS (orígenes permitidos: `*`) e incluye el router. (`backend/app/main.py`)
- **Router/Rutas principales**: `backend/app/routes.py` — contiene todas las rutas de la API en un `APIRouter`. (`backend/app/routes.py`)

### Endpoints de la API (definidos en `backend/app/routes.py`):

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/health` | Health check simple, retorna `{"status": "ok"}` |
| GET | `/api/metrics` | Lista de movimientos filtrable por fecha, categoría, tipo de operación |
| GET | `/api/metrics/facets` | Metadatos: tipos de operación, tipos de negocio, categorías, rango de fechas |
| GET | `/api/metrics/summary` | Resumen agrupado por día/semana/mes con income/outcome/net |
| GET | `/api/metrics/categories/top` | Top N categorías por tipo de operación |
| GET | `/api/metrics/comparison` | Comparación de valor neto entre dos períodos |
| GET | `/api/metrics/alerts` | Alertas cuando un período supera un umbral de incremento de egresos |
| GET | `/api/metrics/b2b` | Movimientos filtrados solo para B2B |
| GET | `/api/metrics/b2c` | Movimientos filtrados solo para B2C |

### Frontend
- **Entry point de la aplicación React**: `frontend/src/main.tsx` — monta el componente `<App />` en el elemento `#root`. (`frontend/src/main.tsx`)
- **Componente raíz**: `frontend/src/App.tsx` — orquesta la carga de datos desde la API y renderiza los componentes del dashboard. (`frontend/src/App.tsx`)
- **HTML de entrada**: `frontend/index.html` — carga `/src/main.tsx` como módulo. (`frontend/index.html`, línea 11)

---

## 4. Estructura de carpetas

### Backend (`backend/`)

| Ruta | Contenido |
|------|-----------|
| `backend/app/__init__.py` | Archivo vacío, marca el directorio como paquete Python. |
| `backend/app/main.py` | Instancia de FastAPI, configuración CORS, inclusión del router. |
| `backend/app/routes.py` | Modelos Pydantic, generación de datos mock, filtros, y todos los endpoints. |
| `backend/tests/conftest.py` | Configuración de pytest: agrega directorio raíz al `sys.path`. |
| `backend/tests/test_routes.py` | 10 tests funcionales con `TestClient` de FastAPI (generación, filtros, endpoints, B2B/B2C). |
| `backend/Dockerfile` | Imagen Python 3.13-slim con debugpy y uvicorn --reload. |
| `backend/requirements.txt` | Dependencias Python. |

### Frontend (`frontend/`)

| Ruta | Contenido |
|------|-----------|
| `frontend/src/App.tsx` | Componente raíz con fetch de datos y layout del dashboard. |
| `frontend/src/main.tsx` | Punto de entrada React DOM. |
| `frontend/src/index.css` | Estilos Tailwind v4 con variables CSS modo dark/light (shadcn/ui). |
| `frontend/src/lib/financial-types.ts` | Tipos TypeScript (`FinancialMovement`, `KPIMetrics`, `MonthlyDataPoint`). |
| `frontend/src/lib/financial-utils.ts` | Funciones puras: `computeKPIs()`, `computeMonthlyData()`, `formatCurrency()`, `formatPercent()`. |
| `frontend/src/lib/financial-utils.test.ts` | Tests unitarios de financial-utils. |
| `frontend/src/lib/mock-data.ts` | Dataset mock estático (60 movimientos, 5 por mes ene-dic 2024). |
| `frontend/src/lib/utils.ts` | Utilidad `cn()` (clsx + tailwind-merge) para clases condicionales. |
| `frontend/src/components/dashboard/dashboard-header.tsx` | Encabezado "Financial Overview" con badge del período. |
| `frontend/src/components/dashboard/kpi-card.tsx` | Tarjeta individual de KPI con icono y variante de color. |
| `frontend/src/components/dashboard/kpi-row.tsx` | Grid de 4 KPICard (Total Income, Total Outcome, Profit, Profit Margin). |
| `frontend/src/components/dashboard/income-outcome-chart.tsx` | Gráfico de líneas Recharts: ingresos vs egresos mensuales. |
| `frontend/src/components/dashboard/profit-percent-chart.tsx` | Gráfico de línea Recharts: margen de ganancia mensual %. |
| `frontend/src/components/ui/card.tsx` | Componentes base shadcn/ui (Card, CardHeader, CardTitle, etc.). |
| `frontend/src/components/ui/skeleton.tsx` | Componente Skeleton para estado de carga. |
| `frontend/components.json` | Configuración shadcn/ui (estilo "new-york", alias `@`). |

---

## 5. Cómo se ejecuta el proyecto localmente

### Con Docker Compose (principal)

El archivo `docker-compose.yml` en la raíz define dos servicios:

```yaml
services:
  frontend:
    build: ./frontend
    ports: ["5173:5173"]
    volumes: ["./frontend:/app", "/app/node_modules"]
    depends_on: [backend]

  backend:
    build: ./backend
    ports: ["8000:8000", "5678:5678"]
    volumes: ["./backend:/app"]
```

Comando: `docker compose up`

**No se requiere archivo `.env`** para el funcionamiento básico. La variable de entorno `VITE_API_BASE_URL` es opcional (vacía por defecto). (`frontend/src/App.tsx`, línea 13)

**Puertos**:
- `5173` — Frontend (Vite dev server)
- `8000` — Backend (API HTTP con hot-reload via `uvicorn --reload`)
- `5678` — Debug remoto Python (debugpy)

### Sin Docker

**Backend** (ver `backend/Dockerfile`):
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend** (ver `frontend/Dockerfile`):
```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

### Tests
- **Backend**: `pytest` o `pytest --cov` (usando pytest + pytest-cov + httpx). (`backend/requirements.txt`, `backend/tests/`)
- **Frontend**: `npm test` (vitest). (`frontend/package.json`, scripts: `test`, `test:watch`, `test:coverage`)

---

## 6. Dependencias y librerías principales

### Backend (`backend/requirements.txt`)

| Dependencia | Propósito |
|-------------|-----------|
| `fastapi` | Framework web ASGI para APIs REST. |
| `uvicorn[standard]` | Servidor ASGI. |
| `debugpy` | Depurador remoto Python (usado en el CMD del Dockerfile). |
| `pytest` | Framework de testing. |
| `pytest-cov` | Plugin de cobertura de código. |
| `httpx` | Cliente HTTP usado por `TestClient` de FastAPI en tests. |

**No hay dependencias de base de datos, ORM, autenticación, workers en segundo plano, ni caché.**

### Frontend (`frontend/package.json`)

**Producción**:

| Dependencia | Propósito |
|-------------|-----------|
| `react` + `react-dom` ^19.2.4 | Biblioteca UI. |
| `recharts` ^3.8.1 | Gráficos (líneas para Income vs Outcome y Profit Margin). |
| `lucide-react` ^1.8.0 | Iconos (TrendingUp, TrendingDown, DollarSign, BarChart2, LayoutDashboard). |
| `class-variance-authority` + `clsx` + `tailwind-merge` | Manejo de clases CSS condicionales (vía `cn()`). |

**Desarrollo**:

| Dependencia | Propósito |
|-------------|-----------|
| `vite` ^8.0.4 | Bundler y dev server con proxy inverso. |
| `@vitejs/plugin-react` ^6.0.1 | Plugin React Fast Refresh para Vite. |
| `tailwindcss` ^4.2.2 + `@tailwindcss/vite` ^4.2.2 | Framework CSS utility-first v4 con plugin Vite. |
| `typescript` ~6.0.2 | Tipado estático. |
| `vitest` ^4.1.4 + `@vitest/coverage-v8` | Framework de tests unitarios. |
| `eslint` ^9.39.4 + plugins | Linter. |

**UI Framework**: el proyecto usa componentes de **shadcn/ui** en estilo "new-york", basados en Tailwind v4 con variables CSS para tema oscuro. (`frontend/components.json`)