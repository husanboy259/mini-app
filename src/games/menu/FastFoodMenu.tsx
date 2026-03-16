import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './FastFoodMenu.module.css'
import { supabase, type MenuItemRow } from '../../lib/supabase'
import { getTelegramUser } from '../../lib/telegram'
import { useCart } from '../../contexts/CartContext'
import { useLang } from '../../contexts/LangContext'
import { ADMIN_USER_ID } from '../../constants'

const FALLBACK_MENU: MenuItemRow[] = [
  { id: 'burger', name: 'Burger', price: 5.0, emoji: '🍔' },
  { id: 'fries', name: 'Fries', price: 3.5, emoji: '🍟' },
  { id: 'hotdog', name: 'Hot Dog', price: 4.0, emoji: '🌭' },
  { id: 'pizza', name: 'Pizza', price: 6.0, emoji: '🍕' },
  { id: 'donut', name: 'Donut', price: 2.5, emoji: '🍩' },
  { id: 'icecream', name: 'Ice Cream', price: 3.0, emoji: '🍦' },
  { id: 'soda', name: 'Soda', price: 2.0, emoji: '🥤' },
  { id: 'cake', name: 'Cake', price: 4.5, emoji: '🍰' },
]

export function FastFoodMenu() {
  const [menuItems, setMenuItems] = useState<MenuItemRow[]>(FALLBACK_MENU)
  const [loading, setLoading] = useState(!!supabase)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const { items: cartItems, addToCart, updateQuantity, totalItems } = useCart()
  const { t } = useLang()
  const isAdmin = useMemo(() => {
    const user = getTelegramUser()
    return user?.id ? Number(user.id) === Number(ADMIN_USER_ID) : false
  }, [])

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    supabase
      .from('menu_items')
      .select('id, name, price, emoji')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        setLoading(false)
        if (error) return
        const rows = (data ?? []) as MenuItemRow[]
        if (rows.length > 0) setMenuItems(rows)
      })
  }, [])

  const getQty = (id: string) => cartItems.find((i) => i.id === id)?.quantity ?? 0

  return (
    <div className={styles.wrapper} data-theme={theme}>
      <header className={styles.header}>
        <div className={styles.headerBar}>
          <button
            type="button"
            className={styles.themeToggle}
            onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
            aria-label={theme === 'light' ? 'Dark mode' : 'Light mode'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <h1 className={styles.title}>{t('nav.catalog')}</h1>
          {isAdmin ? (
            <Link to="/admin" className={styles.adminBtn} aria-label="Admin">
              Admin
            </Link>
          ) : (
            <span className={styles.headerRight} />
          )}
        </div>
      </header>

      <main className={styles.main}>
        {loading ? (
          <div className={styles.loadingWrap}>
            <div className={styles.loader} aria-hidden />
            <p className={styles.loading}>{t('catalog.loading')}</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {menuItems.map((item, index) => (
              <div
                key={item.id}
                className={styles.card}
                style={{ animationDelay: `${index * 0.06}s` }}
              >
                <div className={styles.cardLogoWrap}>
                  <span className={styles.cardIcon} aria-hidden>
                    {item.emoji}
                  </span>
                </div>
                <span className={styles.cardName}>{item.name}</span>
                <span className={styles.cardPrice}>${item.price.toFixed(2)}</span>
                <p className={styles.addLabel}>{t('catalog.addToCart')}</p>
                <div className={styles.quantity}>
                  <button
                    type="button"
                    className={styles.qtyBtn}
                    onClick={() => updateQuantity(item.id, -1)}
                    disabled={getQty(item.id) === 0}
                    aria-label={`${item.name} −`}
                  >
                    −
                  </button>
                  <span className={styles.qtyValue} aria-live="polite">
                    {getQty(item.id)}
                  </span>
                  <button
                    type="button"
                    className={styles.qtyBtn}
                    onClick={() => addToCart({ id: item.id, name: item.name, price: item.price, emoji: item.emoji }, 1)}
                    aria-label={`${item.name} +`}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {totalItems > 0 && (
        <footer className={styles.footer}>
          <Link to="/savat" className={styles.cta}>
            {t('catalog.goToCart')} ({totalItems})
          </Link>
        </footer>
      )}
    </div>
  )
}
