// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { cloneElement, type ReactElement } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ProfitPercentChart } from './profit-percent-chart'

vi.mock('recharts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('recharts')>()
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: ReactElement<{ width: number; height: number }> }) =>
      cloneElement(children, { width: 800, height: 280 }),
  }
})

afterEach(cleanup)

describe('ProfitPercentChart', () => {
  it('renders skeletons while loading', () => {
    const { container } = render(<ProfitPercentChart data={[]} loading />)

    expect(container.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(3)
    expect(screen.queryByText('No data available to display')).toBeNull()
  })

  it('renders an empty state when there are no movements', () => {
    render(<ProfitPercentChart data={[]} />)

    expect(screen.getByText('No data available to display')).not.toBeNull()
    expect(screen.queryByRole('application')).toBeNull()
  })

  it.each([25, -25])('renders a real chart for a %s percent margin', (profitPercent) => {
    const { container } = render(
      <ProfitPercentChart data={[
        { month: 'Jan 2026', income: 1000, outcome: 1000 - profitPercent * 10, profitPercent },
        { month: 'Feb 2026', income: 1000, outcome: 1000, profitPercent: 0 },
      ]} />,
    )

    expect(screen.getByRole('application')).not.toBeNull()
    expect(screen.getByText('Jan 2026')).not.toBeNull()
    expect(container.querySelectorAll('.recharts-line')).toHaveLength(1)
    expect(container.querySelector('.recharts-reference-line')).not.toBeNull()
    expect(screen.queryByText('No data available to display')).toBeNull()
  })
})
