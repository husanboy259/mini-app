import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useLang } from '../contexts/LangContext'
import { getTelegramUser } from '../lib/telegram'
import { getTelegramInitData } from '../lib/telegram'
import { supabase } from '../lib/supabase'
import { notifyOrderToBot } from '../api/client'
import styles from './SavatPage.module.css'

export function SavatPage() {
  const { items, totalPrice, totalItems, updateQuantity, removeFromCart, clearCart } = useCart()
  const { t } = useLang()
  const [sending, setSending] = useState(false)

  const handlePlaceOrder = async () => {
    if (totalItems === 0) return
    const user = getTelegramUser()
    const initData = getTelegramInitData()
    const itemsPayload = items.map((it) => ({
      name: it.name,
      price: it.price,
      emoji: it.emoji,
      quantity: it.quantity,
    }))
    setSending(true)
    try {
      if (!supabase) {
        alert('Supabase sozlanmagan. Zakaz saqlanmaydi.')
        return
      }
      const { data, error } = await supabase.from('orders').insert({
        telegram_user_id: user?.id ?? 0,
        telegram_username: user?.username ?? null,
        first_name: user?.first_name ?? null,
        items: itemsPayload,
        total_price: totalPrice,
      }).select('id').single()
      if (error) throw new Error(error.message)
      if (data?.id) {
        await notifyOrderToBot(initData ?? '', data.id)
        clearCart()
        alert(t('cart.success'))
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error'
      alert(msg)
    } finally {
      setSending(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>{t('nav.cart')}</h1>
        <p className={styles.empty}>{t('cart.empty')}</p>
        <Link to="/katalog" className={styles.linkToCatalog}>{t('nav.catalog')}</Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{t('nav.cart')}</h1>
      <ul className={styles.list}>
        {items.map((it) => (
          <li key={it.id} className={styles.row}>
            <span className={styles.emoji}>{it.emoji}</span>
            <span className={styles.name}>{it.name}</span>
            <span className={styles.price}>${(it.price * it.quantity).toFixed(2)}</span>
            <div className={styles.qty}>
              <button type="button" onClick={() => updateQuantity(it.id, -1)}>−</button>
              <span>{it.quantity}</span>
              <button type="button" onClick={() => updateQuantity(it.id, 1)}>+</button>
            </div>
            <button type="button" className={styles.remove} onClick={() => removeFromCart(it.id)} aria-label="O'chirish">×</button>
          </li>
        ))}
      </ul>
      <p className={styles.botHint}>{t('cart.botHint')}</p>
      <div className={styles.footer}>
        <p className={styles.total}>{t('cart.total')}: ${totalPrice.toFixed(2)}</p>
        <button
          type="button"
          className={styles.placeOrder}
          onClick={handlePlaceOrder}
          disabled={sending}
          aria-label="Yuborish"
        >
          {sending ? t('cart.sending') : t('cart.sendOrder')}
        </button>
      </div>
    </div>
  )
}
