# Tech Stack — Financial Dashboard

## Frontend

| Capa | Tecnología | Versión | Propósito |
|------|-----------|---------|-----------|
| UI Library | React | ^19.2.4 | Framework de componentes |
| Language | TypeScript | ~6.0.2 | Tipado estático |
| Bundler / Dev Server | Vite | ^8.0.4 | Build tool con proxy inverso a backend |
| Vite Plugin | @vitejs/plugin-react | ^6.0.1 | Fast Refresh para React |
| CSS Framework | Tailwind CSS | ^4.2.2 | Utility-first CSS (v4 con variables CSS) |
| Tailwind Vite Plugin | @tailwindcss/vite | ^4.2.2 | Integración Tailwind con Vite |
| UI Components | shadcn/ui (new-york) | — | Componentes base (Card, Skeleton) con variantes via CVA |
| Charts | Recharts | ^3.8.1 | Gráficos de líneas (Income vs Outcome, Profit Margin) |
| Icons | lucide-react | ^1.8.0 | Iconos SVG (TrendingUp, TrendingDown, DollarSign, etc.) |
| Utility | clsx + tailwind-merge | ^2.1.1 / ^3.5.0 | Función `cn()` para clases condicionales |
| Variant Utility | class-variance-authority | ^0.7.1 | Variantes de estilo en componentes |

### Frontend — Testing & Linting

| Herramienta | Versión | Propósito |
|-------------|---------|-----------|
| Vitest | ^4.1.4 | Framework de tests unitarios |
| @vitest/coverage-v8 | ^4.1.4 | Cobertura de código |
| ESLint | ^9.39.4 | Linter con plugins react-hooks y react-refresh |
| typescript-eslint | ^8.58.0 | Reglas ESLint para TypeScript |

### Frontend — Scripts

| Script | Comando |
|--------|---------|
| `npm run dev` | `vite` |
| `npm run build` | `tsc -b && vite build` |
| `npm test` | `vitest run` |
| `npm run test:watch` | `vitest` |
| `npm run lint` | `eslint .` |

---

## Backend

| Capa | Tecnología | Versión | Propósito |
|------|-----------|---------|-----------|
| Framework | FastAPI | * | API REST ASGI con validación Pydantic |
| Server | uvicorn[standard] | * | Servidor ASGI con hot-reload |
| Validation | Pydantic (via FastAPI) | — | Modelos de request/response con `response_model` |
| Debug | debugpy | * | Depurador remoto Python (dev only) |
| Language | Python | 3.13 | (definido en Dockerfile) |

### Backend — Testing

| Herramienta | Versión | Propósito |
|-------------|---------|-----------|
| pytest | * | Framework de tests |
| pytest-cov | * | Cobertura de código |
| httpx | * | Cliente HTTP para TestClient de FastAPI |

> ⚠ `backend/requirements.txt` no tiene versiones pinneadas (hallazgo M8). Las versiones marcadas con `*` pueden cambiar entre builds.

### Backend — Scripts

| Comando | Propósito |
|---------|-----------|
| `uvicorn app.main:app --reload --port 8000` | Dev server con hot-reload |
| `pytest` | Ejecutar tests |
| `pytest --cov` | Tests con cobertura |

---

## Infraestructura

| Capa | Tecnología | Propósito |
|------|-----------|-----------|
| Containerization | Docker Compose | Orquestación de frontend + backend |
| Frontend Dev Server | Vite (host 0.0.0.0:5173) | Proxy inverso `/api` → `http://backend:8000` |
| Backend Dev Server | uvicorn (0.0.0.0:8000) | API REST con debugpy (0.0.0.0:5678) |

### Puertos

| Puerto | Servicio | Uso |
|--------|----------|-----|
| 5173 | Frontend | Vite dev server |
| 8000 | Backend | API REST |
| 5678 | Backend | Debug remoto Python (debugpy) |

### Variables de entorno

| Variable | Default | Propósito |
|----------|---------|-----------|
| `VITE_API_BASE_URL` | `""` (vacío) | Base URL del backend en frontend. Vacío = usa proxy de Vite |
| `CORS_ORIGINS` | — | (Propuesto, no implementado) Orígenes permitidos para CORS |

### Docker

- `frontend/Dockerfile`: Node.js image, npm install, vite dev server
- `backend/Dockerfile`: Python 3.13-slim, pip install, uvicorn via debugpy
- `docker-compose.yml`:2 servicios, volumes para hot-reload, depends_on backend

---

## Decisiones arquitectónicas clave

1. **Sin base de datos**: datos mock generados con `random.seed(42)`, reproducibles pero no persistentes.
2. **Sin autenticación**: la API es pública, sin tokens ni sesiones.
3. **Proxy inverso en dev**: Vite redirige `/api` al backend, evitando problemas de CORS en desarrollo.
4. **shadcn/ui**: componentes base copiados al proyecto (no instalados como paquete), permitiendo personalización directa.
5. **Tailwind v4**: usa variables CSS para tema oscuro/claro en lugar de configuración JS tradicional.
