import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { BattleLog } from './BattleLog'
import { useGameStore } from '../store/gameStore'

beforeEach(() => useGameStore.getState().reset())

describe('BattleLog', () => {
  it('renders empty initially', () => {
    const { container } = render(<BattleLog />)
    expect(container.firstChild.children.length).toBe(0)
  })

  it('shows log messages', () => {
    useGameStore.getState().addLog('Add Beam! -20 HP')
    render(<BattleLog />)
    expect(screen.getByText('Add Beam! -20 HP')).toBeInTheDocument()
  })
})
