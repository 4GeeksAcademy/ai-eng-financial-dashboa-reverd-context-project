# No regenerar datos en cada request

## Alcance
`backend/app/routes.py` — generación de datos mock en endpoints.

## Regla
Generar los datos mock una sola vez al arrancar el módulo como variable de módulo, y reutilizarla en todos los endpoints. No llamar `generate_mock_movements()` dentro de cada handler.

## Razón
Hallazgo M4: Cada uno de los 8 endpoints llama `generate_mock_movements(seed=42)` de forma independiente (líneas 255, 264, 277, 295, 311, 350, 370, 386). Un request simultáneo a `/api/metrics`, `/api/metrics/summary` y `/api/metrics/facets` genera 360 registros tres veces. En producción con datos reales, esta duplicación sería costosa e innecesaria.

## Ejemplo

```python
# ❌ Incorrecto — regenerar en cada endpoint
@router.get("/api/metrics")
def get_metrics(...):
    movements = generate_mock_movements(seed=42)  # 360 registros
    ...

@router.get("/api/metrics/summary")
def get_metrics_summary(...):
    movements = generate_mock_movements(seed=42)  # otros 360 registros
    ...

# ✅ Correcto — generar una vez al importar el módulo
_MOVEMENTS = generate_mock_movements(seed=42)

@router.get("/api/metrics")
def get_metrics(...):
    filtered = filter_movements(_MOVEMENTS, start_date, end_date, category, operation_type)
    ...
```
