# Separar Dockerfile de desarrollo y producción

## Alcance
`backend/Dockerfile`, `docker-compose.yml`.

## Regla
Crear `backend/Dockerfile.dev` (con debugpy y `--reload`) y mantener `backend/Dockerfile` como imagen de producción sin debug tooling. El `CMD` de producción debe ser `["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]`. `docker-compose.yml` debe apuntar explícitamente a `Dockerfile.dev` para desarrollo.

## Razón
Hallazgo M2: `backend/Dockerfile` (línea 11) ejecuta `python -m debugpy --listen 0.0.0.0:5678` y expone el puerto 5678. No existe un Dockerfile distinto para producción. Si esta misma imagen se usara para desplegar, el debugger remoto estaría expuesto a la red, permitiendo ejecución remota de código.

## Ejemplo

```dockerfile
# ❌ Incorrecto — Dockerfile único con debug
CMD ["python", "-m", "debugpy", "--listen", "0.0.0.0:5678", "-m",
     "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# ✅ Correcto — Dockerfile de producción
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```yaml
# docker-compose.yml — apuntar a Dockerfile.dev para desarrollo
backend:
  build:
    context: ./backend
    dockerfile: Dockerfile.dev
```
