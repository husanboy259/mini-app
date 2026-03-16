import { createContext, useContext, useState, useEffect } from 'react'

const KEY = 'app-lang'
export type Lang = 'uz' | 'ru'

const translations: Record<Lang, Record<string, string>> = {
  uz: {
    'nav.home': 'Bosh sahifa',
    'nav.catalog': 'Katalog',
    'nav.cart': 'Savat',
    'nav.services': 'Xizmatlar',
    'nav.profile': 'Profil',
    'nav.management': 'Boshqaruv',
    'home.greeting': 'Salom',
    'home.subtitle': 'Ovqat va ichimliklar',
    'home.search': 'Qidirish...',
    'home.foodAd': 'Ovqat reklama',
    'home.foodAdDesc': 'Mazzali taomlar — endi yetkazib beramiz',
    'home.foodSection': 'Ovqatlar',
    'home.dishes': 'Taomlar',
    'home.drinks': 'Ichimliklar',
    'home.categories': 'Kategoriyalar',
    'home.recommended': 'Tavsiya etilgan',
    'home.seeAll': 'Barchasi',
    'home.seeAllMore': "Barchasini ko'rish",
    'profile.theme': 'Mavzu',
    'profile.light': "Yorug'",
    'profile.dark': "Qorong'u",
    'profile.language': 'Til',
    'profile.myOrders': 'Buyurtmalarim',
    'profile.adminPanel': 'Admin panel',
    'profile.phone': 'Raqam',
    'profile.noPhone': 'Raqam kiritilmagan',
    'profile.addPhone': "Raqam qo'shish",
    'profile.savePhone': 'Saqlash',
    'profile.editPhone': "O'zgartirish",
    'profile.nameLabel': 'Ism familiya',
    'profile.namePlaceholder': 'Ism kiriting',
    'profile.addName': "Ism qo'shish",
    'cart.empty': 'Savat bo‘sh. Katalogdan mahsulot tanlang.',
    'cart.total': 'Jami',
    'cart.placeOrder': 'Zakaz qilish',
    'cart.sendOrder': 'Yuborish',
    'cart.sending': 'Yuborilmoqda…',
    'cart.botHint': 'Zakaz yuborilgach bot sizga buyurtma ro‘yxatini yuboradi.',
    'cart.success': 'Zakaz yuborildi! Bot sizga buyurtma ro‘yxatini Telegram orqali yuboradi.',
    'catalog.addToCart': "Savatga qo'shish",
    'catalog.loading': 'Menyu yuklanmoqda…',
    'catalog.goToCart': 'Savatga o‘tish',
    'orders.title': 'Buyurtmalarim',
    'orders.list': 'Sizning buyurtmalaringiz ro‘yxati.',
    'services.title': 'Xizmatlar',
    'services.soon': 'Xizmatlar bo‘limi tez orada.',
  },
  ru: {
    'nav.home': 'Главная',
    'nav.catalog': 'Каталог',
    'nav.cart': 'Корзина',
    'nav.services': 'Услуги',
    'nav.profile': 'Профиль',
    'nav.management': 'Управление',
    'home.greeting': 'Привет',
    'home.subtitle': 'Еда и напитки',
    'home.search': 'Поиск...',
    'home.foodAd': 'Реклама еды',
    'home.foodAdDesc': 'Вкусные блюда — доставим',
    'home.foodSection': 'Еда',
    'home.dishes': 'Блюда',
    'home.drinks': 'Напитки',
    'home.categories': 'Категории',
    'home.recommended': 'Рекомендуем',
    'home.seeAll': 'Все',
    'home.seeAllMore': 'Смотреть все',
    'profile.theme': 'Тема',
    'profile.light': 'Светлая',
    'profile.dark': 'Тёмная',
    'profile.language': 'Язык',
    'profile.myOrders': 'Мои заказы',
    'profile.adminPanel': 'Админ-панель',
    'profile.phone': 'Номер',
    'profile.noPhone': 'Номер не указан',
    'profile.addPhone': 'Добавить номер',
    'profile.savePhone': 'Сохранить',
    'profile.editPhone': 'Изменить',
    'profile.nameLabel': 'Имя и фамилия',
    'profile.namePlaceholder': 'Введите имя',
    'profile.addName': 'Добавить имя',
    'cart.empty': 'Корзина пуста. Выберите товары в каталоге.',
    'cart.total': 'Итого',
    'cart.placeOrder': 'Оформить заказ',
    'cart.sendOrder': 'Отправить',
    'cart.sending': 'Отправка…',
    'cart.botHint': 'После отправки бот пришлёт вам список заказа.',
    'cart.success': 'Заказ отправлен! Бот пришлёт вам список в Telegram.',
    'catalog.addToCart': 'В корзину',
    'catalog.loading': 'Загрузка меню…',
    'catalog.goToCart': 'В корзину',
    'orders.title': 'Мои заказы',
    'orders.list': 'Список ваших заказов.',
    'services.title': 'Услуги',
    'services.soon': 'Раздел услуг скоро.',
  },
}

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string } | null>(null)

function getStored(): Lang {
  if (typeof window === 'undefined') return 'uz'
  const l = localStorage.getItem(KEY) as Lang | null
  return l === 'ru' ? 'ru' : 'uz'
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getStored)

  useEffect(() => {
    localStorage.setItem(KEY, lang)
  }, [lang])

  const setLang = (l: Lang) => setLangState(l)
  const t = (key: string) => translations[lang][key] ?? key

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) return { lang: 'uz' as Lang, setLang: () => {}, t: (k: string) => k }
  return ctx
}
