# No mantener código muerto

## Alcance
`frontend/src/` — cualquier archivo que no sea importado por un módulo activo.

## Regla
Si un archivo no es importado por ningún módulo del proyecto, eliminarlo en el mismo PR donde se detecte. Ejecutar `grep -r "<nombre-del-archivo>" frontend/src/` (excluyendo el propio archivo) antes de decidir conservarlo. No mantener archivos mock/backup "por si acaso".

## Razón
Hallazgo M3: `frontend/src/lib/mock-data.ts` exporta `mockMovements` (60 registros hardcodeados) pero no es importado en ningún archivo del frontend (verificado por grep: solo se referencia a sí mismo). El frontend consume datos reales del backend vía `fetch()`. Este archivo muerto genera confusión sobre la fuente de datos y aumenta la superficie de mantenimiento sin aportar valor.

## Ejemplo

```bash
# ❌ Verificar antes de eliminar — buscar referencias al archivo
grep -r "mock-data" frontend/src/ --include="*.ts" --include="*.tsx"
# Resultado: solo lo encuentra a él mismo → es código muerto

# ✅ Acción: eliminar el archivo
rm frontend/src/lib/mock-data.ts
```

```typescript
// ❌ Incorrecto — archivo existe pero nadie lo importa
// frontend/src/lib/mock-data.ts
export const mockMovements: FinancialMovement[] = [...]

// ✅ Correcto — el fuente de datos mock es único: el backend
// backend/app/routes.py
 Movements = generate_mock_movements(seed=42)
```
