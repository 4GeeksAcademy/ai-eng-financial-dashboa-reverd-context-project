// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { TrendingUp } from 'lucide-react'
import { afterEach, describe, expect, it } from 'vitest'
import { KPICard } from './kpi-card'

afterEach(cleanup)

describe('KPICard', () => {
  it.each(['income', 'outcome', 'profit', 'profitPercent'] as const)(
    'renders the value and decorative icon for %s',
    (variant) => {
      const { container } = render(
        <KPICard label="Revenue" value="$1,000" helperText="Monthly revenue" icon={TrendingUp} variant={variant} />,
      )

      expect(screen.getByText('Revenue')).not.toBeNull()
      expect(screen.getByText('$1,000')).not.toBeNull()
      expect(screen.getByText('Monthly revenue')).not.toBeNull()
      expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true')
      expect(container.querySelector('[data-slot="skeleton"]')).toBeNull()
    },
  )

  it('replaces values with skeletons while loading', () => {
    const { container } = render(
      <KPICard label="Revenue" value="$1,000" helperText="Monthly revenue" icon={TrendingUp} variant="income" loading />,
    )

    expect(container.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0)
    expect(screen.queryByText('$1,000')).toBeNull()
  })
})
