import type { ColumnType } from 'kysely'

type TimestampModel = {
  created_at: ColumnType<string, never, never>
  updated_at: ColumnType<string, never, string>
}

type TimestampWithDeletedAtModel = TimestampModel & {
  deleted_at: ColumnType<string | null, string | undefined, string | null>
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
  role: 'USER' | 'ADMIN' | 'CHEF'
}

type ReferralsTable = TimestampModel & {
  id: string
  code: string
  referrer_id: string
  referred_id: string
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

type FoodItemsTable = TimestampWithDeletedAtModel & {
  id: string
  name: string
  video_url: string
  price: string
  image: Media
  deleted_at?: ColumnType<string | null, string | undefined, string | null>
}

type FoodRecipesTable = TimestampModel & {
  id: string
  title: string
  description: string
  ingredients: {
    quantity: number
    id: string
  }[]
  instructions: {
    title: string
    content: string
  }[]
  video: Media
  cover_image: Media
  rating: ColumnType<string, string | number, string | number | undefined>
  chef_id: string
  likes: number
  dislikes: number
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

type AdvertsTable = TimestampModel & {
  id: string
  media: Media
  expires_at: string
  title: string | null
  description: string | null
  target_url: string | null
  is_active: boolean
  priority: number
  deleted_at: string | null
}

type OrderItemTable = TimestampModel & {
  id: string
  image: Media
  quantity: number
  price: string
  order_id: string
}

type TransactionsTable = TimestampModel & {
  id: string
  type: 'CREDIT' | 'DEBIT'
  amount: string
  purpose: 'TOPUP' | 'ORDER'
  created_at: string
  updated_at: string
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

type ChefsTable = TimestampModel & {
  id: string
  name: string
  niches: string[]
  profile_picture: Media | null
  rating: ColumnType<string, string | number, string | number | undefined>
  likes: number
  dislikes: number
  is_verified: boolean
  is_banned: boolean
  user_id: string
}

type ChefUserLikeTable = TimestampModel & {
  id: string
  chef_id: string
  user_id: string
  is_liked: boolean
  is_disliked: boolean
}

type ChefUserRatingTable = TimestampModel & {
  id: string
  chef_id: string
  user_id: string
  rating: ColumnType<string, string | number, string | number | undefined>
}

type RecipeUserLikeTable = TimestampModel & {
  id: string
  recipe_id: string
  user_id: string
  is_liked: boolean
  is_disliked: boolean
}

type RecipeUserRatingTable = TimestampModel & {
  id: string
  recipe_id: string
  user_id: string
  rating: ColumnType<string, string | number, string | number | undefined>
}

export type KyselyDatabaseTables = {
  users: UsersTable
  tokens: TokensTable
  user_preferences: UserPreferencesTable
  food_items: FoodItemsTable
  food_recipes: FoodRecipesTable
  wallets: WalletsTable
  cart_items: CartItemsTable
  carts: CartsTable
  foods: FoodsTable
  order_items: OrderItemTable
  orders: OrderTable
  transactions: TransactionsTable
  adverts: AdvertsTable
  chefs: ChefsTable
  chef_user_likes: ChefUserLikeTable
  chef_user_ratings: ChefUserRatingTable
  recipe_user_likes: RecipeUserLikeTable
  recipe_user_ratings: RecipeUserRatingTable
  referrals: ReferralsTable
}
