import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { showBackButton, hideBackButton, onBackButtonClick } from '@telegram-apps/sdk-react'
import styles from './QuizGame.module.css'

const QUESTIONS = [
  { q: '1 + 2 + 10 × 2 = ?', options: ['23', '24', '25', '26'], correct: 0, topic: 'Arifmetika' },
  { q: '2 + 2 = ?', options: ['3', '4', '5', '6'], correct: 1, topic: 'Arifmetika' },
  { q: 'Fransiya poytaxti?', options: ['London', 'Paris', 'Berlin', 'Madrid'], correct: 1, topic: 'Geografiya' },
  { q: 'Eng katta sayyora?', options: ['Yer', 'Mars', 'Yupiter', 'Saturn'], correct: 2, topic: 'Astronomiya' },
  { q: '2 × 6 = ?', options: ['10', '12', '14', '16'], correct: 1, topic: 'Arifmetika' },
  { q: 'Qit\'alar soni?', options: ['5', '6', '7', '8'], correct: 2, topic: 'Geografiya' },
]

export function QuizGame() {
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [done, setDone] = useState(false)
  const navigate = useNavigate()
  const question = QUESTIONS[index]

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

  const handleAnswer = (optIdx: number) => {
    if (answered) return
    setSelected(optIdx)
    setAnswered(true)
    if (optIdx === question.correct) setScore((s) => s + 1)
  }

  const next = () => {
    if (index + 1 >= QUESTIONS.length) {
      setDone(true)
    } else {
      setIndex((i) => i + 1)
      setAnswered(false)
      setSelected(null)
    }
  }

  if (done) {
    const pct = Math.round((score / QUESTIONS.length) * 100)
    return (
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <Link to="/" className={styles.link}>← Menu</Link>
        </div>
        <div className={styles.result}>
          <span className={styles.resultEmoji}>{pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '💪'}</span>
          <h2>Quiz tugadi!</h2>
          <p className={styles.resultScore}>{score} / {QUESTIONS.length} to‘g‘ri</p>
          <Link to="/" className={styles.button}>Menu ga qaytish</Link>
        </div>
      </div>
    )
  }

  const progress = ((index + (answered ? 1 : 0)) / QUESTIONS.length) * 100

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Link to="/" className={styles.link}>← Menu</Link>
        <span className={styles.progressText}>{index + 1} / {QUESTIONS.length}</span>
      </div>
      <div className={styles.progressWrap}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className={styles.questionCard}>
        <div className={styles.topic}>{question.topic}</div>
        <h2 className={styles.question}>{question.q}</h2>
        <p className={styles.questionMeta}>Savol ({index + 1}/{QUESTIONS.length})</p>
      </div>
      <div className={styles.options}>
        {question.options.map((opt, i) => (
          <button
            key={i}
            type="button"
            className={`${styles.opt} ${
              answered && i === question.correct ? styles.optCorrect : ''
            } ${answered && selected === i && i !== question.correct ? styles.optWrong : ''}`}
            onClick={() => handleAnswer(i)}
            disabled={answered}
          >
            {opt}
          </button>
        ))}
      </div>
      {answered && (
        <button type="button" className={styles.checkBtn} onClick={next}>
          {index + 1 < QUESTIONS.length ? 'Keyingi →' : 'Natijani ko‘rish'}
        </button>
      )}
    </div>
  )
}
