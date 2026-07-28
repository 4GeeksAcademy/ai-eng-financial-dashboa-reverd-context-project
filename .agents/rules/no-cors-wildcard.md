# No CORS wildcard en producción

## Alcance
`backend/app/main.py` — configuración de CORS middleware.

## Regla
El backend NUNCA debe configurar `allow_origins=["*"]`. Usar una lista explícita de dominios permitidos leída de variable de entorno (ej: `CORS_ORIGINS`). En development, confiar en el proxy de Vite (`frontend/vite.config.ts`, bloque `server.proxy`) en lugar de CORS abierto.

## Razón
Hallazgo M1: `backend/app/main.py` (líneas 7-11) configura `allow_origins=["*"]` con `allow_credentials=True`. Esta combinación es incompatible (los navegadores rechazan `*` con credenciales) y si se cambia a orígenes específicos sin darse cuenta, se expondría el backend a peticiones CSRF desde cualquier dominio.

## Ejemplo

```python
# ❌ Incorrecto
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Correcto
import os

CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)
```
