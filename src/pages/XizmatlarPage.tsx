import { useLang } from '../contexts/LangContext'
import styles from './PlaceholderPage.module.css'

export function XizmatlarPage() {
  const { t } = useLang()
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{t('services.title')}</h1>
      <p className={styles.text}>{t('services.soon')}</p>
    </div>
  )
}
