import { useLang } from '../contexts/LangContext'
import styles from './PlaceholderPage.module.css'

export function BuyurtmalarimPage() {
  const { t } = useLang()
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{t('orders.title')}</h1>
      <p className={styles.text}>{t('orders.list')}</p>
    </div>
  )
}
