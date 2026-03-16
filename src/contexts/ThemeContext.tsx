import { createContext, useContext, useState, useEffect } from 'react'

const KEY = 'app-theme'

type Theme = 'light' | 'dark'

function getStored(): Theme {
  if (typeof window === 'undefined') return 'light'
  if ((window as Window & { Telegram?: { WebApp?: unknown } }).Telegram?.WebApp) return 'light'
  const t = localStorage.getItem(KEY)
  return t === 'dark' ? 'dark' : 'light'
}

const ThemeContext = createContext<{ theme: Theme; setTheme: (t: Theme) => void } | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getStored)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(KEY, theme)
  }, [theme])

  const setTheme = (t: Theme) => setThemeState(t)

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) return { theme: 'light' as Theme, setTheme: () => {} }
  return ctx
}
