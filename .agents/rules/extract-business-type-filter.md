# Extraer filtro de business_type a filter_movements

## Alcance
`backend/app/routes.py` — función `filter_movements()` y endpoints que filtran por business type.

## Regla
Agregar el parámetro `business_type: BusinessType | None = None` a la función `filter_movements()` y reusarlo en todos los endpoints (`/api/metrics/b2b`, `/api/metrics/b2c`, `/api/metrics/summary`). No duplicar lógica de filtrado con list comprehensions inline en cada endpoint.

## Razón
Hallazgo M5: `get_b2b_metrics` (línea 370), `get_b2c_metrics` (línea 386) y `get_metrics_summary` (línea 281) filtran por `business_type` con list comprehensions casi idénticas, pero `filter_movements()` no soporta este parámetro. Si cambia la lógica de filtrado, hay que actualizarlo en múltiples lugares.

## Ejemplo

```python
# ❌ Incorrecto — filtrado inline duplicado en cada endpoint
def get_b2b_metrics(...):
    movements = [
        movement for movement in generate_mock_movements(seed=42)
        if movement.business_type == "B2B"
    ]
    filtered = filter_movements(movements, start_date, end_date, category, operation_type)

# ✅ Correcto — filter_movements acepta business_type
def filter_movements(
    movements: list[FinancialMovement],
    start_date: date | None,
    end_date: date | None,
    category: Category | None,
    operation_type: OperationType | None,
    business_type: BusinessType | None = None,  # ← nuevo parámetro
) -> list[FinancialMovement]:
    filtered = filter_movements_by_date(movements, start_date, end_date)
    if category is not None:
        filtered = [m for m in filtered if m.category == category]
    if operation_type is not None:
        filtered = [m for m in filtered if m.operation_type == operation_type]
    if business_type is not None:
        filtered = [m for m in filtered if m.business_type == business_type]
    return filtered
```
