/**
 * Optional API client for score, leaderboard, and order notify.
 * Set VITE_API_URL to your backend URL (e.g. https://your-api.com).
 */

const API_URL = import.meta.env.VITE_API_URL ?? ''

export async function submitScore(initData: string, game: string, score: number): Promise<{ ok: boolean }> {
  if (!API_URL) return { ok: false }
  const res = await fetch(`${API_URL}/api/score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Telegram-Init-Data': initData },
    body: JSON.stringify({ game, score, initData }),
  })
  if (!res.ok) throw new Error('Failed to submit score')
  return res.json()
}

export async function getLeaderboard(game?: string): Promise<Record<string, { username: string; score: number }[]>> {
  if (!API_URL) return {}
  const url = game ? `${API_URL}/api/leaderboard?game=${encodeURIComponent(game)}` : `${API_URL}/api/leaderboard`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch leaderboard')
  return res.json()
}

/** Buyurtma Supabase ga yozilgach, botga xabar yuborish uchun serverni chaqiradi */
export async function notifyOrderToBot(initData: string, orderId: string): Promise<{ ok: boolean }> {
  if (!API_URL) {
    console.warn('VITE_API_URL sozlanmagan — admin xabar olmaydi. Loyiha .env da VITE_API_URL=backend manzil qo\'ying.')
    return { ok: false }
  }
  const res = await fetch(`${API_URL}/api/order-notify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Telegram-Init-Data': initData },
    body: JSON.stringify({ orderId, initData }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string; details?: string }
    const msg = err.details || err.error || res.statusText
    throw new Error(msg || 'Xabar yuborilmadi')
  }
  return res.json()
}

/** Admin: menyuga yangi taom qo‘shish */
export async function addMenuItem(
  initData: string,
  item: { name: string; price: number; emoji: string }
): Promise<{ ok: boolean; item?: { id: string; name: string; price: number; emoji: string } }> {
  if (!API_URL) throw new Error('API URL not set')
  const res = await fetch(`${API_URL}/api/admin/menu/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Telegram-Init-Data': initData },
    body: JSON.stringify(item),
  })
  if (!res.ok) {
    const e = await res.json().catch(() => ({}))
    throw new Error(e.error || 'Failed to add item')
  }
  return res.json()
}

/** Admin: menyudan taomni o‘chirish */
export async function deleteMenuItem(initData: string, id: string): Promise<{ ok: boolean }> {
  if (!API_URL) throw new Error('API URL not set')
  const res = await fetch(`${API_URL}/api/admin/menu/items/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { 'X-Telegram-Init-Data': initData },
  })
  if (!res.ok) {
    const e = await res.json().catch(() => ({}))
    throw new Error(e.error || 'Failed to delete item')
  }
  return res.json()
}
