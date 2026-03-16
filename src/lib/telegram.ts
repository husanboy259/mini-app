const win = typeof window !== 'undefined' ? (window as Window & { Telegram?: { WebApp?: { initData?: string } } }) : null

export function getTelegramUser(): { id: number; first_name?: string; last_name?: string; username?: string } | null {
  const raw = win?.Telegram?.WebApp?.initData
  if (!raw) return null
  try {
    const params = new URLSearchParams(raw)
    const userStr = params.get('user')
    if (!userStr) return null
    const user = JSON.parse(decodeURIComponent(userStr)) as { id?: number | string; first_name?: string; last_name?: string; username?: string }
    const id = user?.id
    if (id == null) return null
    const num = Number(id)
    if (Number.isNaN(num)) return null
    return { ...user, id: num }
  } catch {
    return null
  }
}

export function getTelegramInitData(): string | null {
  return win?.Telegram?.WebApp?.initData ?? null
}
