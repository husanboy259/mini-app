import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { init, mockTelegramEnv } from '@telegram-apps/sdk-react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { LangProvider } from './contexts/LangContext'
import { CartProvider } from './contexts/CartContext'
import App from './App'
import './index.css'

if (typeof window !== 'undefined') {
  const isTelegram = !!window.Telegram?.WebApp
  if (isTelegram) {
    document.documentElement.setAttribute('data-theme', 'light')
    try {
      window.Telegram?.WebApp?.setBackgroundColor?.('#f5f5f7')
    } catch {
      // ignore
    }
  } else {
    const savedTheme = localStorage.getItem('app-theme')
    if (savedTheme === 'dark' || savedTheme === 'light') {
      document.documentElement.setAttribute('data-theme', savedTheme)
    }
  }
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
    <ThemeProvider>
      <LangProvider>
        <CartProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </CartProvider>
      </LangProvider>
    </ThemeProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
