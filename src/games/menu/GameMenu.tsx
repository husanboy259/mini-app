import { Link } from 'react-router-dom'
import styles from './GameMenu.module.css'

const GAMES = [
  { path: '/games/snake', name: 'Snake', desc: 'Classic', icon: '🐍' },
  { path: '/games/tictactoe', name: 'Tic-Tac-Toe', desc: 'X va O', icon: '⭕' },
  { path: '/games/memory', name: 'Memory', desc: 'Juftlik top', icon: '🧠' },
  { path: '/games/quiz', name: 'Quiz', desc: 'Savollar', icon: '❓' },
] as const

export function GameMenu() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.hero}>
        <span className={styles.emoji} aria-hidden>🎮</span>
        <h1 className={styles.title}>Keling, o‘ynaymiz!</h1>
        <p className={styles.subtitle}>
          Quyidagi o‘yinlardan birini tanlang va boshlang.
        </p>
      </div>
      <div className={styles.grid}>
        {GAMES.map(({ path, name, desc, icon }) => (
          <Link key={path} to={path} className={styles.card}>
            <span className={styles.cardIcon}>{icon}</span>
            <span className={styles.cardName}>{name}</span>
            <span className={styles.cardDesc}>{desc}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
