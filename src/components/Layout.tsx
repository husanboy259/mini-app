import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useLang } from '../contexts/LangContext'
import { useCart } from '../contexts/CartContext'
import styles from './Layout.module.css'

const NAV_ITEMS = [
  { path: '/', labelKey: 'nav.home', icon: '🏠' },
  { path: '/katalog', labelKey: 'nav.catalog', icon: '📦' },
  { path: '/savat', labelKey: 'nav.cart', icon: '🛒' },
  { path: '/xizmatlar', labelKey: 'nav.services', icon: '📍' },
  { path: '/profil', labelKey: 'nav.profile', icon: '👤' },
  { path: '/admin', labelKey: 'nav.management', icon: '⚙️' },
]

export function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme } = useTheme()
  const { t } = useLang()
  const { totalItems } = useCart()
  const path = location.pathname

  return (
    <div className={styles.wrapper} data-theme={theme}>
      <main className={styles.main}>
        <Outlet />
      </main>
      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const isActive = path === item.path || (item.path !== '/' && path.startsWith(item.path))
          return (
            <button
              key={item.path}
              type="button"
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span>{t(item.labelKey)}</span>
              {item.path === '/savat' && totalItems > 0 && (
                <span className={styles.badge}>{totalItems}</span>
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
