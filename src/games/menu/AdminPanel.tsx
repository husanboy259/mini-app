import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { supabase, type MenuItemRow } from '../../lib/supabase'
import { addMenuItem, deleteMenuItem } from '../../api/client'
import { ADMIN_USER_ID } from '../../constants'
import styles from './AdminPanel.module.css'

const win =
  typeof window !== 'undefined'
    ? (window as Window & { Telegram?: { WebApp?: { initData?: string } } })
    : null

function getTelegramUserId(): number | null {
  const raw = win?.Telegram?.WebApp?.initData
  if (!raw) return null
  try {
    const params = new URLSearchParams(raw)
    const userStr = params.get('user')
    if (!userStr) return null
    const user = JSON.parse(decodeURIComponent(userStr)) as { id?: number | string }
    const id = user?.id
    if (id == null) return null
    const num = Number(id)
    return Number.isNaN(num) ? null : num
  } catch {
    return null
  }
}

function getTelegramInitData(): string | null {
  return win?.Telegram?.WebApp?.initData ?? null
}

export function AdminPanel() {
  const [items, setItems] = useState<MenuItemRow[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [emoji, setEmoji] = useState('🍽️')
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const isAdmin = Number(getTelegramUserId()) === Number(ADMIN_USER_ID)

  const fetchItems = useCallback(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    setLoading(true)
    supabase
      .from('menu_items')
      .select('id, name, price, emoji')
      .order('created_at', { ascending: true })
      .then(({ data, error: err }) => {
        setLoading(false)
        if (!err) setItems((data ?? []) as MenuItemRow[])
      })
  }, [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const n = name.trim()
    const p = Number(price)
    if (!n) {
      setError('Nomi bo‘sh bo‘lmasin')
      return
    }
    if (Number.isNaN(p) || p < 0) {
      setError('Narx 0 dan katta bo‘lishi kerak')
      return
    }
    const initData = getTelegramInitData()
    if (!initData) {
      setError('Telegram orqali kirish kerak')
      return
    }
    setSubmitting(true)
    try {
      await addMenuItem(initData, { name: n, price: p, emoji: emoji.trim() || '🍽️' })
      setName('')
      setPrice('')
      setEmoji('🍽️')
      fetchItems()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xatolik')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    const initData = getTelegramInitData()
    if (!initData) return
    setDeletingId(id)
    setError('')
    try {
      await deleteMenuItem(initData, id)
      fetchItems()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'O‘chirishda xatolik')
    } finally {
      setDeletingId(null)
    }
  }

  if (!isAdmin) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.forbidden}>
          <p>Kirish taqiqlangan.</p>
          <Link to="/" className={styles.backLink}>← Menyuga</Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <Link to="/" className={styles.backBtn}>← Menyu</Link>
        <h1 className={styles.title}>Admin — menyu</h1>
      </header>

      <main className={styles.main}>
        <form onSubmit={handleAdd} className={styles.form}>
          <h2 className={styles.formTitle}>Yangi taom qo‘shish</h2>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.field}>
            <label htmlFor="admin-emoji">Emoji</label>
            <input
              id="admin-emoji"
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder="🍔"
              maxLength={4}
              className={styles.emojiInput}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="admin-name">Nomi</label>
            <input
              id="admin-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Burger"
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="admin-price">Narxi ($)</label>
            <input
              id="admin-price"
              type="number"
              min={0}
              step={0.01}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="5.00"
            />
          </div>
          <button type="submit" className={styles.submitBtn} disabled={submitting}>
            {submitting ? 'Qo‘shilmoqda…' : 'Qo‘shish'}
          </button>
        </form>

        <section className={styles.listSection}>
          <h2 className={styles.listTitle}>Menyu ({items.length})</h2>
          {loading ? (
            <p className={styles.loading}>Yuklanmoqda…</p>
          ) : (
            <ul className={styles.list}>
              {items.map((item) => (
                <li key={item.id} className={styles.row}>
                  <span className={styles.rowEmoji}>{item.emoji}</span>
                  <span className={styles.rowName}>{item.name}</span>
                  <span className={styles.rowPrice}>${item.price.toFixed(2)}</span>
                  <button
                    type="button"
                    className={styles.delBtn}
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    aria-label={`${item.name}ni o‘chirish`}
                  >
                    {deletingId === item.id ? '…' : 'O‘chirish'}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {!loading && items.length === 0 && (
            <p className={styles.empty}>Hali taom yo‘q. Yuqoridan qo‘shing.</p>
          )}
        </section>
      </main>
    </div>
  )
}
