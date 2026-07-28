# Loguear errores reales en frontend

## Alcance
`frontend/src/App.tsx` — manejo de errores en `fetchFinancialData()`.

## Regla
En el `.catch()` de toda operación `fetch()`, incluir `console.error(error)` con el objeto de error original antes de setear el mensaje genérico. Mostrar al usuario información útil (status code, mensaje descriptivo) cuando esté disponible en el error.

## Razón
Hallazgo M6: `App.tsx` (líneas 33-37) descarta el error original con `.catch(() => { setError("No se pudo cargar...") })`. No se loggea ni se inspecciona el tipo de error. Depurar problemas de conexión es imposible: el usuario ve "No se pudo cargar" sin saber si es 404, 500, timeout o CORS.

## Ejemplo

```typescript
// ❌ Incorrecto — error silenciado
.catch(() => {
  setError("No se pudo cargar la informacion financiera. Revisa la API de backend.");
})

// ✅ Correcto — error loggeado e informativo
.catch((error) => {
  console.error("Error fetching financial data:", error);
  const message = error instanceof Error
    ? `Error al cargar datos: ${error.message}`
    : "No se pudo cargar la información financiera.";
  setError(message);
})
```
