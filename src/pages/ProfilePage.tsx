import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getTelegramUser } from '../lib/telegram'
import { useTheme } from '../contexts/ThemeContext'
import { useLang } from '../contexts/LangContext'
import { ADMIN_USER_ID } from '../constants'
import styles from './ProfilePage.module.css'

const PHONE_KEY = 'user_phone'
const USER_NAME_KEY = 'user_display_name'

export function ProfilePage() {
  const user = getTelegramUser()
  const { theme, setTheme } = useTheme()
  const { lang, setLang, t } = useLang()
  const [phone, setPhone] = useState('')
  const [editPhone, setEditPhone] = useState(false)
  const [inputPhone, setInputPhone] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [editName, setEditName] = useState(false)
  const [inputName, setInputName] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem(PHONE_KEY)
    if (saved) {
      setPhone(saved)
      setInputPhone(saved)
    }
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem(USER_NAME_KEY)
    if (saved) setDisplayName(saved)
  }, [])

  const savePhone = () => {
    const trimmed = inputPhone.trim().replace(/\s/g, '')
    if (trimmed) {
      localStorage.setItem(PHONE_KEY, trimmed)
      setPhone(trimmed)
      setEditPhone(false)
    } else {
      localStorage.removeItem(PHONE_KEY)
      setPhone('')
      setEditPhone(false)
    }
  }

  const saveName = () => {
    const trimmed = inputName.trim()
    if (trimmed) {
      localStorage.setItem(USER_NAME_KEY, trimmed)
      setDisplayName(trimmed)
      setEditName(false)
    }
  }

  const fromTelegram = [user?.first_name, user?.last_name].filter(Boolean).join(' ')
  const fullName = fromTelegram || displayName || (lang === 'ru' ? 'Пользователь' : 'Foydalanuvchi')
  const initial = (fullName || 'U').charAt(0).toUpperCase()
  const username = user?.username ? `@${user.username}` : ''
  const isAdmin = user?.id ? Number(user.id) === Number(ADMIN_USER_ID) : false
  const canEditName = !user?.first_name

  return (
    <div className={styles.page}>
      <div className={styles.profileHead}>
        <div className={styles.avatar}>{initial}</div>
        <p className={styles.label}>{t('profile.nameLabel')}</p>
        {editName ? (
          <div className={styles.phoneEdit}>
            <input
              type="text"
              className={styles.phoneInput}
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              placeholder={t('profile.namePlaceholder')}
              autoFocus
            />
            <button type="button" className={styles.phoneSaveBtn} onClick={saveName}>
              {t('profile.savePhone')}
            </button>
          </div>
        ) : (
          <h1 className={styles.fullName}>{fullName}</h1>
        )}
        {canEditName && !editName && (
          <button type="button" className={styles.phoneAddBtn} onClick={() => { setEditName(true); setInputName(fromTelegram ? fullName : displayName) }}>
            {(fullName === 'Foydalanuvchi' || fullName === 'Пользователь') ? t('profile.addName') : t('profile.editPhone')}
          </button>
        )}
        {username && <p className={styles.username}>{username}</p>}
        <p className={styles.label}>{t('profile.phone')}</p>
        {phone ? (
          <p className={styles.phone}>{phone}</p>
        ) : (
          <p className={styles.phoneMuted}>{t('profile.noPhone')}</p>
        )}
        {editPhone ? (
          <div className={styles.phoneEdit}>
            <input
              type="tel"
              className={styles.phoneInput}
              value={inputPhone}
              onChange={(e) => setInputPhone(e.target.value)}
              placeholder="+998 90 123 45 67"
              autoFocus
            />
            <button type="button" className={styles.phoneSaveBtn} onClick={savePhone}>
              {t('profile.savePhone')}
            </button>
          </div>
        ) : (
          <button
            type="button"
            className={styles.phoneAddBtn}
            onClick={() => {
              setEditPhone(true)
              setInputPhone(phone)
            }}
          >
            {phone ? t('profile.editPhone') : t('profile.addPhone')}
          </button>
        )}
      </div>

      <div className={styles.card}>
        <p className={styles.cardTitle}>{t('profile.theme')}</p>
        <div className={styles.segmented}>
          <button
            type="button"
            className={`${styles.segBtn} ${theme === 'light' ? styles.segBtnActive : ''}`}
            onClick={() => setTheme('light')}
          >
            <span>☀️</span>
            {t('profile.light')}
          </button>
          <button
            type="button"
            className={`${styles.segBtn} ${theme === 'dark' ? styles.segBtnActive : ''}`}
            onClick={() => setTheme('dark')}
          >
            <span>🌙</span>
            {t('profile.dark')}
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <p className={styles.cardTitle}>{t('profile.language')}</p>
        <div className={styles.segmented}>
          <button
            type="button"
            className={`${styles.segBtn} ${lang === 'uz' ? styles.segBtnActive : ''}`}
            onClick={() => setLang('uz')}
          >
            O&apos;zbek
          </button>
          <button
            type="button"
            className={`${styles.segBtn} ${lang === 'ru' ? styles.segBtnActive : ''}`}
            onClick={() => setLang('ru')}
          >
            Русский
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <Link to="/buyurtmalarim" className={styles.linkRow}>
          <span className={styles.linkIcon}>📋</span>
          <span className={styles.linkLabel}>{t('profile.myOrders')}</span>
          <span className={styles.linkArrow}>›</span>
        </Link>
        {isAdmin && (
          <Link to="/admin" className={styles.linkRow}>
            <span className={styles.linkIcon}>⚙️</span>
            <span className={styles.linkLabel}>{t('profile.adminPanel')}</span>
            <span className={styles.linkArrow}>›</span>
          </Link>
        )}
      </div>
    </div>
  )
}
