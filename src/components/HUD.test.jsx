import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { HUD } from './HUD'
import { useGameStore } from '../store/gameStore'

beforeEach(() => useGameStore.getState().reset())

describe('HUD', () => {
  it('shows initial player HP as 100', () => {
    render(<HUD />)
    expect(screen.getAllByText('100')[0]).toBeInTheDocument()
  })

  it('reflects HP after damage', () => {
    useGameStore.getState().applyDamageToPlayer(30)
    render(<HUD />)
    expect(screen.getByText('70')).toBeInTheDocument()
  })

  it('timer pulses red when <= 5', () => {
    useGameStore.setState({ timer: 3 })
    render(<HUD />)
    const timerEl = screen.getByText('3s')
    expect(timerEl).toHaveClass('text-red-400')
  })
})
