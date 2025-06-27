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

type FoodItemsTable = TimestampModel & {
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

type CartItemsTable = TimestampModel & {
  id: string
  image: Media
  quantity: number
  price: string
  food_item_id: string
  cart_id: string
}

type CartsTable = TimestampModel & {
  id: string
  price: string
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

type OrderItemTable = TimestampModel & {
  id: string
  image: Media
  quantity: number
  price: string
  order_id: string
}

type OrderTable = TimestampModel & {
  id: string
  status:
    | 'AWAITING_PAYMENT'
    | 'PREPARING'
    | 'IN_TRANSIT'
    | 'DELIVERED'
    | 'CANCELLED'
  price: string
  user_id: string
} & (
    | {
        payment_method: 'ONLINE'
        payment_url: string
      }
    | {
        payment_method: 'WALLET' | 'PAY_FOR_ME'
      }
  )

export type Database = {
  users: UsersTable
  tokens: TokensTable
  user_preferences: UserPreferencesTable
  food_items: FoodItemsTable
  wallets: WalletsTable
  cart_items: CartItemsTable
  carts: CartsTable
  foods: FoodsTable
  order_items: OrderItemTable
  orders: OrderTable
}
