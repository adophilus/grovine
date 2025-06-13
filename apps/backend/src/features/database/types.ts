import type { ColumnType } from 'kysely'

type TimestampModel = {
  created_at: ColumnType<string, never, never>
  updated_at: ColumnType<string, never, string>
}

export type Media = {
  public_id: string
  url: string
}

type UsersTable = TimestampModel & {
  id: string
  full_name: string
  email: string
  phone_number: string
  referral_code: string | null
  verified_at: string | null
}

type TokensTable = TimestampModel & {
  id: string
  token: string
  purpose: string
  expires_at: string
  user_id: string
}

type UserPreferencesTable = TimestampModel & {
  id: string
  foods: string[]
  regions: string[]
  user_id: string
}

type ItemsTable = TimestampModel & {
  id: string
  name: string
  video_url: string
  price: string
  image: Media
}

type WalletsTable = TimestampModel & {
  id: string
  balance: string
  user_id: string
}

type CartItemTable = TimestampModel & {
  id: string
  image: Media
  quantity: number
  price: string
  cart_id: string
}

type CartsTable = TimestampModel & {
  id: string
  user_id: string
}

type FoodsTable = TimestampModel & {
  id: string
  name: string
  description: string
  price: string
  image: Media
  is_available: boolean
}

export type Database = {
  users: UsersTable
  tokens: TokensTable
  user_preferences: UserPreferencesTable
  items: ItemsTable
  wallets: WalletsTable
  cart_items: CartItemTable
  carts: CartsTable
  foods: FoodsTable
}
