import type { ColumnType } from 'kysely'

type TimestampModel = {
  created_at: ColumnType<string, never, never>
  updated_at: ColumnType<string, never, string>
}

type Media = {
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

type RecipesTable = TimestampModel & {
  id: string
  name: string
  video_url: string
  price: string
  image: Media
}

export type Database = {
  users: UsersTable
  tokens: TokensTable
  user_preferences: UserPreferencesTable
  recipes: RecipesTable
}