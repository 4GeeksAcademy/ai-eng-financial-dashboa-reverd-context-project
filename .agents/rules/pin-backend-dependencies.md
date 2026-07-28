# Pinneare dependencias en requirements.txt

## Alcance
`backend/requirements.txt`.

## Regla
Todas las dependencias en `backend/requirements.txt` deben usar versiones pinneadas con `==`. Regenerar con `pip freeze` después de validar compatibilidad. No dejar dependencias sin versión.

## Razón
Hallazgo M8: `backend/requirements.txt` lista `fastapi`, `uvicorn[standard]`, `pytest`, `pytest-cov`, `httpx` y `debugpy` sin ninguna versión especificada. Un `pip install` en diferente momento puede instalar versiones incompatibles, causando "works on my machine".

## Ejemplo

```
# ❌ Incorrecto — sin versiones
fastapi
uvicorn[standard]
debugpy
pytest
pytest-cov
httpx

# ✅ Correcto — versiones pinneadas
fastapi==0.115.12
uvicorn[standard]==0.34.2
debugpy==1.8.14
pytest==8.4.1
pytest-cov==6.2.1
httpx==0.28.1
```
