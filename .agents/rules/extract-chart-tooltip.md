# Extraer CustomTooltip compartido

## Alcance
`frontend/src/components/dashboard/income-outcome-chart.tsx`, `frontend/src/components/dashboard/profit-percent-chart.tsx`.

## Regla
Crear un componente `ChartTooltip` parametrizable en `frontend/src/components/ui/chart-tooltip.tsx` y reutilizarlo en ambos charts. No definir `CustomTooltip` de forma independiente en cada componente de chart.

## Razón
Hallazgo M9: Ambos archivos definen su propio `CustomTooltip` (income-outcome-chart.tsx líneas 24-43, profit-percent-chart.tsx líneas 24-42) con estructura JSX casi idéntica. La única diferencia es que uno muestra múltiples entradas del payload y otro una sola. Un componente compartido reduce duplicación y asegura consistencia visual.

## Ejemplo

```tsx
// ❌ Incorrecto — tooltip duplicado en cada chart
// income-outcome-chart.tsx
function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-lg text-sm">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((entry) => ( /* ... */ ))}
    </div>
  )
}

// profit-percent-chart.tsx — misma estructura, otro contenido
function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  // casi idéntico...
}

// ✅ Correcto — componente compartido
// components/ui/chart-tooltip.tsx
interface ChartTooltipEntry {
  name: string
  value: number
  color: string
  format?: (v: number) => string
}

interface ChartTooltipProps {
  active?: boolean
  label?: string
  entries: ChartTooltipEntry[]
}

export function ChartTooltip({ active, label, entries }: ChartTooltipProps) {
  if (!active || !entries.length) return null
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-lg text-sm">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {entries.map((e) => (
        <div key={e.name} className="flex items-center gap-2 py-0.5">
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: e.color }} />
          <span className="text-muted-foreground capitalize">{e.name}:</span>
          <span className="font-medium text-foreground ml-auto pl-4">
            {e.format ? e.format(e.value) : e.value}
          </span>
        </div>
      ))}
    </div>
  )
}
```
