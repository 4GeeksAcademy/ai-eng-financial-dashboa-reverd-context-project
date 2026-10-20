// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { KPIRow } from './kpi-row'

afterEach(cleanup)

describe('KPIRow', () => {
  it('formats all four financial metrics', () => {
    render(<KPIRow metrics={{ totalIncome: 1000, totalOutcome: 250, profit: 750, profitPercent: 75 }} />)

    for (const label of ['Total Income', 'Total Outcome', 'Profit', 'Profit Margin']) {
      expect(screen.getByText(label)).not.toBeNull()
    }
    for (const value of ['$1,000', '$250', '$750', '75.0%']) {
      expect(screen.getByText(value)).not.toBeNull()
    }
  })

  it('shows placeholders instead of invented values when metrics are absent', () => {
    render(<KPIRow metrics={null} />)

    expect(screen.getAllByText('\u2014')).toHaveLength(4)
    expect(screen.queryByText('$0')).toBeNull()
  })

  it('passes the loading state to every card', () => {
    const { container } = render(<KPIRow metrics={null} loading />)

    expect(container.querySelectorAll('[data-slot="card"]')).toHaveLength(4)
    expect(container.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(16)
    expect(screen.queryByText('Total Income')).toBeNull()
  })
})
