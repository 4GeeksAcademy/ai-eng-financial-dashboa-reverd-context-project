// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";

vi.mock("@/components/dashboard/income-outcome-chart", () => ({
  IncomeOutcomeChart: () => null,
}));
vi.mock("@/components/dashboard/profit-percent-chart", () => ({
  ProfitPercentChart: () => null,
}));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("dashboard accessibility", () => {
  it("announces loading and marks data regions busy", () => {
    vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})));
    const { container } = render(<App />);

    expect(screen.getByRole("status", { name: "Financial data status" }).textContent).toBe("Loading financial data");
    expect(screen.getByRole("region", { name: "Key performance indicators" }).getAttribute("aria-busy")).toBe("true");
    expect(container.querySelector('[data-slot="skeleton"]')).not.toBeNull();
    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("provides a native disclosure and labeled monthly table", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { create_date: "2024-01-10", amount: 1000, operation_type: "income" },
        { create_date: "2024-01-15", amount: 250, operation_type: "outcome" },
      ],
    }));
    render(<App />);

    const summary = await screen.findByText("Monthly financial data");
    fireEvent.click(summary);
    expect(summary.closest("details")?.open).toBe(true);
    const table = screen.getByRole("table", { name: "Monthly income, outcome and profit margin" });
    expect(within(table).getAllByRole("columnheader")).toHaveLength(4);
    expect(within(table).getByRole("rowheader").textContent).toBe("Jan 2024");
    expect(within(table).getByText("$1,000")).toBeTruthy();
    expect(within(table).getByText("$250")).toBeTruthy();
    expect(within(table).getByText("75.0%")).toBeTruthy();
    expect(screen.getByRole("region", { name: "Financial charts" }).getAttribute("aria-busy")).toBe("false");
    expect(screen.getByRole("status", { name: "Financial data status" }).textContent).toBe("Financial data loaded");
  });

  it("announces API failures in their language", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    render(<App />);

    const alert = await screen.findByRole("alert");
    expect(alert.getAttribute("lang")).toBe("es");
    expect(alert.textContent).toContain("No se pudo cargar");
    await waitFor(() => expect(screen.getByRole("status", { name: "Financial data status" }).textContent).toBe("Financial data unavailable"));
    expect(screen.queryByText("Monthly financial data")).toBeNull();
  });

  it("does not expose an empty table", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => [] }));
    render(<App />);

    await waitFor(() => expect(screen.getByRole("status", { name: "Financial data status" }).textContent).toBe("Financial data loaded"));
    expect(screen.queryByRole("table", { hidden: true })).toBeNull();
  });
});