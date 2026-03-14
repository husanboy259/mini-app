/**
 * Optional API client for score and leaderboard.
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
