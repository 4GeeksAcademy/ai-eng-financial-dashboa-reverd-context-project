# Testear componentes React con React Testing Library

## Alcance
`frontend/src/components/dashboard/` — todos los componentes del dashboard.

## Regla
Agregar tests de renderizado para cada componente principal del dashboard que validen al menos: (a) que muestra `<Skeleton>` cuando `loading=true`, (b) que renderiza contenido con datos, (c) que muestra estado de error cuando aplica. Mínimo un test file por componente en `__tests__/` o con sufijo `.test.tsx`.

## Razón
Hallazgo M10: Actualmente solo existen tests en `frontend/src/lib/financial-utils.test.ts` (funciones puras). No hay tests para componentes React. Un componente podría romper su renderizado, perder accesibilidad, o mostrar estados incorrectos sin que los tests lo detecten.

## Ejemplo

```tsx
// ❌ Incorrecto — no hay tests para componentes
// Solo existe: frontend/src/lib/financial-utils.test.ts

// ✅ Correcto — test file para KPICard
// frontend/src/components/dashboard/kpi-card.test.tsx
import { render, screen } from "@testing-library/react";
import { KPICard } from "./kpi-card";
import { TrendingUp } from "lucide-react";

describe("KPICard", () => {
  it("shows skeleton when loading", () => {
    const { container } = render(
      <KPICard label="Income" value="$1,000" helperText="Revenue"
               icon={TrendingUp} variant="income" loading={true} />
    );
    expect(container.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0);
  });

  it("renders value and label when data is present", () => {
    render(
      <KPICard label="Income" value="$1,000" helperText="Revenue"
               icon={TrendingUp} variant="income" loading={false} />
    );
    expect(screen.getByText("$1,000")).toBeInTheDocument();
    expect(screen.getByText("Income")).toBeInTheDocument();
  });
});
```
