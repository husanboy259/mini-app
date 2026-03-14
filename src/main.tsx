import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { init, mockTelegramEnv } from '@telegram-apps/sdk-react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Launch params yo'q bo'lsa (brauzer yoki Telegram hash siz) — mock qilamiz, init() xato bermasin
declare global {
  interface Window {
    Telegram?: { WebApp?: { initData?: string } }
  }
}
if (typeof window !== 'undefined') {
  const hash = window.location.hash.slice(1)
  const params = new URLSearchParams(hash || undefined)
  if (!params.has('tgWebAppPlatform')) {
    params.set('tgWebAppPlatform', window.Telegram?.WebApp ? 'android' : 'weba')
    params.set('tgWebAppVersion', '6.10')
    if (window.Telegram?.WebApp?.initData) params.set('tgWebAppData', window.Telegram.WebApp.initData)
    try {
      mockTelegramEnv(params.toString())
    } catch {
      // ignore
    }
  }
}

function Root() {
  useEffect(() => {
    try {
      return init({ acceptCustomStyles: true })
    } catch {
      return () => {}
    }
  }, [])
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
