// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { DashboardHeader } from './dashboard-header'

afterEach(cleanup)

describe('DashboardHeader', () => {
  it('renders the supplied period and a single primary heading', () => {
    const { container } = render(<DashboardHeader period="Oct 2025 - Sep 2026" />)

    expect(screen.getByRole('heading', { level: 1, name: 'Financial Overview' })).not.toBeNull()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByText('Oct 2025 - Sep 2026')).not.toBeNull()
    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true')
  })
})
