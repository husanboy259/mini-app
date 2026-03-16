import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = url && anonKey ? createClient(url, anonKey) : null

export type MenuItemRow = {
  id: string
  name: string
  price: number
  emoji: string
}

export type OrderItemPayload = {
  name: string
  price: number
  emoji: string
  quantity: number
}

export type OrderInsert = {
  telegram_user_id: number
  telegram_username: string | null
  first_name: string | null
  items: OrderItemPayload[]
  total_price: number
}
