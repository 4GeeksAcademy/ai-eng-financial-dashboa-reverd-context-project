import { lazy, Suspense, useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { KPIRow } from "@/components/dashboard/kpi-row";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type FinancialMovement,
  type KPIMetrics,
  type MonthlyDataPoint,
} from "@/lib/financial-types";
import { computeKPIs, computeMonthlyData, formatCurrency, formatPercent } from "@/lib/financial-utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

const IncomeOutcomeChart = lazy(() =>
  import("@/components/dashboard/income-outcome-chart").then((module) => ({ default: module.IncomeOutcomeChart })),
);
const ProfitPercentChart = lazy(() =>
  import("@/components/dashboard/profit-percent-chart").then((module) => ({ default: module.ProfitPercentChart })),
);
const chartFallback = (
  <>
    <Skeleton role="status" aria-label="Loading income and outcome chart" className="h-[400px] w-full" />
    <Skeleton role="status" aria-label="Loading profit margin chart" className="h-[400px] w-full" />
  </>
);

async function fetchFinancialData(): Promise<FinancialMovement[]> {
  const response = await fetch(`${API_BASE_URL}/api/metrics`);
  if (!response.ok) {
    throw new Error(`Failed to fetch financial data: ${response.status}`);
  }
  return response.json();
}

function App() {
  const [metrics, setMetrics] = useState<KPIMetrics | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFinancialData()
      .then((movements) => {
        setMetrics(computeKPIs(movements));
        setMonthlyData(computeMonthlyData(movements));
      })
      .catch(() => {
        setError(
          "No se pudo cargar la informacion financiera. Revisa la API de backend.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className="dark min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <DashboardHeader period="2024 - Full Year" />

          {error ? (
            <div role="alert" lang="es" className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive-foreground">
              {error}
            </div>
          ) : null}

          <p role="status" aria-label="Financial data status" className="sr-only">
            {loading ? "Loading financial data" : error ? "Financial data unavailable" : "Financial data loaded"}
          </p>

          <section aria-label="Key performance indicators" aria-busy={loading}>
            <KPIRow metrics={metrics} loading={loading} />
          </section>

          <section
            aria-label="Financial charts"
            aria-busy={loading}
            className="grid grid-cols-1 gap-4 xl:grid-cols-2"
          >
            {loading ? chartFallback : (
              <Suspense fallback={chartFallback}>
                <IncomeOutcomeChart data={monthlyData} />
                <ProfitPercentChart data={monthlyData} />
              </Suspense>
            )}
          </section>

          {!loading && !error && monthlyData.length > 0 ? (
            <details>
              <summary className="min-h-6 cursor-pointer">Monthly financial data</summary>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">Monthly income, outcome and profit margin</caption>
                  <thead>
                    <tr>
                      <th scope="col" className="p-2">Month</th>
                      <th scope="col" className="p-2">Income</th>
                      <th scope="col" className="p-2">Outcome</th>
                      <th scope="col" className="p-2">Profit margin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyData.map((point) => (
                      <tr key={point.month}>
                        <th scope="row" className="p-2 whitespace-nowrap">{point.month}</th>
                        <td className="p-2">{formatCurrency(point.income)}</td>
                        <td className="p-2">{formatCurrency(point.outcome)}</td>
                        <td className="p-2">{formatPercent(point.profitPercent)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          ) : null}
        </div>
      </div>
    </main>
  );
}

export default App;
