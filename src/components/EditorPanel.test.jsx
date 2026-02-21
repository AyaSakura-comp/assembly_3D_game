import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { EditorPanel } from './EditorPanel'
import { useGameStore } from '../store/gameStore'

vi.mock('@monaco-editor/react', () => ({
  default: ({ value, onChange }) => (
    <textarea data-testid="editor" value={value} onChange={e => onChange(e.target.value)} />
  ),
}))

// Mock requestAnimationFrame to run synchronously
global.requestAnimationFrame = (cb) => { cb(); return 0 }

beforeEach(() => useGameStore.getState().reset())

describe('EditorPanel', () => {
  it('Execute button is enabled during editing phase', () => {
    render(<EditorPanel />)
    expect(screen.getByText('▶ Execute')).not.toBeDisabled()
  })

  it('correct a+b program fires Add Beam and reduces boss HP', () => {
    useGameStore.setState({ inputs: { a: 3, b: 4 } })
    render(<EditorPanel />)
    fireEvent.change(screen.getByTestId('editor'), {
      target: { value: 'MOV AX, 3\nMOV BX, 4\nADD AX, BX\nHLT AX' }
    })
    fireEvent.click(screen.getByText('▶ Execute'))
    expect(useGameStore.getState().bossHp).toBe(80)
    expect(useGameStore.getState().battleLog[0]).toMatch(/Add Beam/)
  })

  it('wrong output deals damage to player', () => {
    render(<EditorPanel />)
    fireEvent.change(screen.getByTestId('editor'), {
      target: { value: 'MOV AX, 99\nHLT AX' }
    })
    fireEvent.click(screen.getByText('▶ Execute'))
    expect(useGameStore.getState().playerHp).toBeLessThan(100)
  })
})
