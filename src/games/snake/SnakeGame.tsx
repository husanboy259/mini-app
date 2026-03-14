import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { showBackButton, hideBackButton, onBackButtonClick } from '@telegram-apps/sdk-react'
import styles from './SnakeGame.module.css'

const GRID_SIZE = 15
const CELL_SIZE = 20
const INITIAL_SPEED = 150

type Dir = 'up' | 'down' | 'left' | 'right'

function getRandomCell(): [number, number] {
  return [
    Math.floor(Math.random() * GRID_SIZE),
    Math.floor(Math.random() * GRID_SIZE),
  ]
}

function getRandomCellExcluding(blocked: [number, number][]): [number, number] {
  let cell: [number, number]
  do {
    cell = getRandomCell()
  } while (blocked.some(([x, y]) => x === cell[0] && y === cell[1]))
  return cell
}

export function SnakeGame() {
  const [snake, setSnake] = useState<[number, number][]>([[7, 7]])
  const [food, setFood] = useState<[number, number]>(() => getRandomCell())
  const [dir, setDir] = useState<Dir>('right')
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const navigate = useNavigate()

  const setDirSafe = useCallback((next: Dir) => {
    setDir((d) => {
      if (d === 'up' && next === 'down') return d
      if (d === 'down' && next === 'up') return d
      if (d === 'left' && next === 'right') return d
      if (d === 'right' && next === 'left') return d
      return next
    })
  }, [])

  useEffect(() => {
    if (gameOver) return
    const move = () => {
      setSnake((prev) => {
        const head = prev[0]
        let next: [number, number]
        switch (dir) {
          case 'up': next = [head[0], head[1] - 1]; break
          case 'down': next = [head[0], head[1] + 1]; break
          case 'left': next = [head[0] - 1, head[1]]; break
          default: next = [head[0] + 1, head[1]]
        }
        const wrapped: [number, number] = [
          (next[0] + GRID_SIZE) % GRID_SIZE,
          (next[1] + GRID_SIZE) % GRID_SIZE,
        ]
        if (prev.some(([x, y]) => x === wrapped[0] && y === wrapped[1])) {
          setGameOver(true)
          return prev
        }
        const eaten = wrapped[0] === food[0] && wrapped[1] === food[1]
        if (eaten) {
          setScore((s) => s + 10)
          setFood(getRandomCellExcluding([wrapped, ...prev]))
          return [wrapped, ...prev]
        }
        return [wrapped, ...prev.slice(0, -1)]
      })
    }
    const id = setInterval(move, INITIAL_SPEED)
    return () => clearInterval(id)
  }, [dir, gameOver, food])

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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (gameOver) return
      switch (e.key) {
        case 'ArrowUp': e.preventDefault(); setDirSafe('up'); break
        case 'ArrowDown': e.preventDefault(); setDirSafe('down'); break
        case 'ArrowLeft': e.preventDefault(); setDirSafe('left'); break
        case 'ArrowRight': e.preventDefault(); setDirSafe('right'); break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [gameOver, setDirSafe])

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.score}>Score: {score}</span>
        <Link to="/" className={styles.link}>← Menu</Link>
      </div>
      <div className={styles.gridWrap} style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}>
        {snake.map(([x, y], i) => (
          <div
            key={`${x}-${y}-${i}`}
            className={i === 0 ? styles.head : styles.body}
            style={{ left: x * CELL_SIZE, top: y * CELL_SIZE, width: CELL_SIZE, height: CELL_SIZE }}
          />
        ))}
        <div
          className={styles.food}
          style={{ left: food[0] * CELL_SIZE, top: food[1] * CELL_SIZE, width: CELL_SIZE, height: CELL_SIZE }}
        />
      </div>
      <div className={styles.controls}>
        <button type="button" className={styles.controlBtn} onClick={() => setDirSafe('up')} aria-label="Up">↑</button>
        <button type="button" className={styles.controlBtn} onClick={() => setDirSafe('left')} aria-label="Left">←</button>
        <button type="button" className={styles.controlBtn} onClick={() => setDirSafe('right')} aria-label="Right">→</button>
        <button type="button" className={styles.controlBtn} onClick={() => setDirSafe('down')} aria-label="Down">↓</button>
      </div>
      {gameOver && (
        <div className={styles.overlay}>
          <span className={styles.overlayEmoji}>🐍</span>
          <p className={styles.gameOver}>Game Over</p>
          <p className={styles.finalScore}>Score: {score}</p>
          <Link to="/" className={styles.button}>Menu ga qaytish</Link>
        </div>
      )}
    </div>
  )
}
