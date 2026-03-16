import { Link } from 'react-router-dom'
import { getTelegramUser } from '../lib/telegram'
import { useLang } from '../contexts/LangContext'
import styles from './HomePage.module.css'

const TAOMLAR = [
  { id: '1', name: 'Burger', emoji: '🍔' },
  { id: '2', name: 'Lavash', emoji: '🌯' },
  { id: '3', name: 'Pizza', emoji: '🍕' },
  { id: '4', name: 'Hot Dog', emoji: '🌭' },
  { id: '5', name: 'Donut', emoji: '🍩' },
]

const ICHIMLIKLAR = [
  { id: '1', name: 'Cola', emoji: '🥤' },
  { id: '2', name: 'Pepsi', emoji: '🥤' },
  { id: '3', name: 'Sok', emoji: '🧃' },
  { id: '4', name: 'Choy', emoji: '🍵' },
  { id: '5', name: 'Kofe', emoji: '☕' },
]

const TAVSIYA = [
  { id: '1', name: 'Burger', emoji: '🍔' },
  { id: '2', name: 'Lavash', emoji: '🌯' },
  { id: '3', name: 'Pizza', emoji: '🍕' },
  { id: '4', name: 'Cola', emoji: '🥤' },
]

const OVQAT_REKLAMA = [
  { id: '1', name: 'Burger', emoji: '🍔' },
  { id: '2', name: 'Lavash', emoji: '🌯' },
  { id: '3', name: 'Pizza', emoji: '🍕' },
]

export function HomePage() {
  const user = getTelegramUser()
  const { t, lang, setLang } = useLang()
  const name = user?.first_name || (t('home.greeting') === 'Привет' ? 'Пользователь' : 'Foydalanuvchi')

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.langRow}>
          <div className={styles.langSwitch}>
            <button
              type="button"
              className={`${styles.langBtn} ${lang === 'uz' ? styles.langBtnActive : ''}`}
              onClick={() => setLang('uz')}
            >
              UZ
            </button>
            <button
              type="button"
              className={`${styles.langBtn} ${lang === 'ru' ? styles.langBtnActive : ''}`}
              onClick={() => setLang('ru')}
            >
              RU
            </button>
          </div>
        </div>
        <h1 className={styles.greeting}>{t('home.greeting')}, {name}!</h1>
        <p className={styles.subtitle}>{t('home.subtitle')}</p>
      </header>

      <input
        type="search"
        className={styles.search}
        placeholder={t('home.search')}
        aria-label={t('home.search')}
      />

      {/* Ovqat reklama */}
      <section className={styles.reklamaSection}>
        <h2 className={styles.reklamaTitle}>{t('home.foodAd')}</h2>
        <p className={styles.reklamaDesc}>{t('home.foodAdDesc')}</p>
        <div className={styles.scrollRow}>
          {OVQAT_REKLAMA.map((r) => (
            <Link key={r.id} to="/katalog" className={styles.reklamaCard}>
              <span className={styles.reklamaEmoji}>{r.emoji}</span>
              <span className={styles.reklamaName}>{r.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Ovqatlar — Taomlar */}
      <section>
        <h2 className={styles.sectionTitle}>{t('home.foodSection')}</h2>
        <div className={styles.sectionHead}>
          <h3 className={styles.sectionSubtitle}>{t('home.dishes')}</h3>
          <Link to="/katalog" className={styles.sectionLink}>{t('home.seeAll')} &gt;</Link>
        </div>
        <div className={styles.scrollRow}>
          {TAOMLAR.map((m) => (
            <Link key={m.id} to="/katalog" className={styles.modelCard}>
              <div className={styles.modelImg} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>{m.emoji}</div>
              <span className={styles.modelName}>{m.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Ichimliklar */}
      <section>
        <div className={styles.sectionHead}>
          <h3 className={styles.sectionSubtitle}>{t('home.drinks')}</h3>
          <Link to="/katalog" className={styles.sectionLink}>{t('home.seeAll')} &gt;</Link>
        </div>
        <div className={styles.scrollRow}>
          {ICHIMLIKLAR.map((b) => (
            <Link key={b.id} to="/katalog" className={styles.brandCard}>
              <div className={styles.brandLogo} style={{ fontSize: '1.8rem' }}>{b.emoji}</div>
              <span className={styles.brandName}>{b.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Tavsiya etilgan */}
      <section>
        <div className={styles.sectionHead}>
          <h3 className={styles.sectionSubtitle}>{t('home.recommended')}</h3>
          <Link to="/katalog" className={styles.sectionLink}>{t('home.seeAllMore')} &gt;</Link>
        </div>
        <div className={styles.grid}>
          {TAVSIYA.map((p) => (
            <Link key={p.id} to="/katalog" className={styles.productCard}>
              <div className={styles.productImg} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>{p.emoji}</div>
              <div className={styles.productName}>{p.name}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
