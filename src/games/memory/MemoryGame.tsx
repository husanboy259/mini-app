import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { showBackButton, hideBackButton, onBackButtonClick } from '@telegram-apps/sdk-react'
import styles from './MemoryGame.module.css'

const EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼']
const PAIRS = 8

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export function MemoryGame() {
  const [cards, setCards] = useState<{ id: number; emoji: string; flipped: boolean; matched: boolean }[]>([])
  const [moves, setMoves] = useState(0)
  const [lastFlipped, setLastFlipped] = useState<number | null>(null)
  const navigate = useNavigate()

  const init = useCallback(() => {
    const emojis = [...EMOJIS.slice(0, PAIRS), ...EMOJIS.slice(0, PAIRS)]
    setCards(shuffle(emojis).map((emoji, id) => ({ id, emoji, flipped: false, matched: false })))
    setMoves(0)
    setLastFlipped(null)
  }, [])

  useEffect(() => {
    init()
  }, [init])

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

  const handleClick = (idx: number) => {
    const card = cards[idx]
    if (card.flipped || card.matched) return
    const twoFlipped = cards.filter((c) => c.flipped && !c.matched).length
    if (twoFlipped >= 2) return

    const next = cards.map((c, i) =>
      i === idx ? { ...c, flipped: true } : c
    )
    setCards(next)
    setMoves((m) => m + 1)

    if (lastFlipped === null) {
      setLastFlipped(idx)
      return
    }
    const other = cards[lastFlipped]
    if (other.emoji === card.emoji) {
      setCards((prev) =>
        prev.map((c, i) =>
          i === idx || i === lastFlipped ? { ...c, matched: true } : c
        )
      )
    } else {
      setTimeout(() => {
        setCards((prev) =>
          prev.map((c, i) =>
            i === idx || i === lastFlipped ? { ...c, flipped: false } : c
          )
        )
      }, 600)
    }
    setLastFlipped(null)
  }

  const allMatched = cards.length > 0 && cards.every((c) => c.matched)

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Link to="/" className={styles.link}>← Menu</Link>
        <span className={styles.moves}>Harakatlar: {moves}</span>
      </div>
      <div className={styles.grid}>
        {cards.map((card, i) => (
          <button
            key={card.id + '-' + i}
            type="button"
            className={`${styles.card} ${card.flipped || card.matched ? styles.flipped : ''} ${card.matched ? styles.matched : ''}`}
            onClick={() => handleClick(i)}
          >
            {card.flipped || card.matched ? card.emoji : '?'}
          </button>
        ))}
      </div>
      {allMatched && (
        <div className={styles.overlay}>
          <span className={styles.overlayEmoji}>🎉</span>
          <p>Barakalla! {moves} harakatda topdingiz.</p>
          <div className={styles.btnRow}>
            <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={init}>
              Qayta o‘ynash
            </button>
            <Link to="/" className={`${styles.btn} ${styles.btnSecondary}`}>Menu</Link>
          </div>
        </div>
      )}
    </div>
  )
}
