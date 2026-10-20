// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { cloneElement, type ReactElement } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { IncomeOutcomeChart } from './income-outcome-chart'

vi.mock('recharts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('recharts')>()
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: ReactElement<{ width: number; height: number }> }) =>
      cloneElement(children, { width: 800, height: 280 }),
  }
})

afterEach(cleanup)

describe('IncomeOutcomeChart', () => {
  it('renders skeletons without claiming an empty result while loading', () => {
    const { container } = render(<IncomeOutcomeChart data={[]} loading />)

    expect(container.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(3)
    expect(screen.queryByText('No data available to display')).toBeNull()
  })

  it('renders the empty state when there are no movements', () => {
    render(<IncomeOutcomeChart data={[]} />)

    expect(screen.getByText('No data available to display')).not.toBeNull()
    expect(screen.queryByRole('application')).toBeNull()
  })

  it('renders a real chart with both named series and month labels', () => {
    const { container } = render(
      <IncomeOutcomeChart data={[{ month: 'Jan 2026', income: 1000, outcome: 250, profitPercent: 75 }]} />,
    )

    expect(screen.getByRole('application')).not.toBeNull()
    expect(screen.getByText('Jan 2026')).not.toBeNull()
    expect(screen.getByText('income')).not.toBeNull()
    expect(screen.getByText('outcome')).not.toBeNull()
    expect(container.querySelectorAll('.recharts-line')).toHaveLength(2)
    expect(screen.queryByText('No data available to display')).toBeNull()
  })
})
