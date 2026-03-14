import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { showBackButton, hideBackButton, onBackButtonClick } from '@telegram-apps/sdk-react'
import styles from './TicTacToeGame.module.css'

type Cell = 'X' | 'O' | null

function getWinner(board: Cell[]): Cell | 'draw' {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ]
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a]
  }
  return board.every(Boolean) ? 'draw' : null
}

export function TicTacToeGame() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null))
  const [isX, setIsX] = useState(true)
  const navigate = useNavigate()
  const winner = getWinner(board)

  useEffect(() => {
    try {
      showBackButton()
      const off = onBackButtonClick(() => navigate('/'))
      return () => {
        try { off?.(); hideBackButton() } catch { /* outside Mini App */ }
      }
    } catch {
      return () => {}
    }
  }, [navigate])

  const handleClick = (i: number) => {
    if (board[i] || winner) return
    const next = [...board]
    next[i] = isX ? 'X' : 'O'
    setBoard(next)
    setIsX(!isX)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Link to="/" className={styles.link}>← Menu</Link>
        <span className={styles.turn}>
          {winner ? (winner === 'draw' ? 'Durrang!' : `G‘olib: ${winner}`) : `${isX ? 'X' : 'O'} navbatchi`}
        </span>
      </div>
      <div className={styles.grid}>
        {board.map((cell, i) => (
          <button
            key={i}
            type="button"
            className={`${styles.cell} ${cell === 'X' ? styles.cellX : ''} ${cell === 'O' ? styles.cellO : ''}`}
            onClick={() => handleClick(i)}
            disabled={!!cell || !!winner}
          >
            {cell}
          </button>
        ))}
      </div>
      {(winner === 'X' || winner === 'O' || winner === 'draw') && (
        <Link to="/" className={styles.button}>Menu ga qaytish</Link>
      )}
    </div>
  )
}
