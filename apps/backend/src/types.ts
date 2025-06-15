import type { Insertable, Selectable, Updateable } from 'kysely'
import type { Database } from './features/database/types'
// type Extendables =
// 	| Selectable<EcommerceProductsTable>
// 	| Insertable<EcommerceProductsTable>
// 	| Updateable<EcommerceProductsTable>;

// type ApiCompatibility<T extends Extendables> =
// 	T extends Selectable<EcommerceProductsTable>
// 		? Omit<T, "media"> & { media: Types.Media[] }
// 		: T extends Insertable<EcommerceProductsTable>
// 			? Omit<T, "media"> & { media: Types.Media[] }
// 			: Omit<T, "media"> & { media?: Types.Media[] };

type ApiCompatibility<T> = T
type KSelectable<T> = Selectable<T>
type KInsertable<T> = Insertable<T>
type KUpdateable<T> = Updateable<T>

type GenerateTypes<T> = {
  Selectable: ApiCompatibility<KSelectable<T>>
  Insertable: ApiCompatibility<KInsertable<T>>
  Updateable: ApiCompatibility<KUpdateable<T>>
}

export namespace User {
  type T = GenerateTypes<Database['users']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export namespace Token {
  type T = GenerateTypes<Database['tokens']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export namespace UserPreference {
  type T = GenerateTypes<Database['user_preferences']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export namespace FoodItem {
  type T = GenerateTypes<Database['food_items']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export namespace Wallet {
  type T = GenerateTypes<Database['wallets']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export namespace Cart {
  type T = GenerateTypes<Database['carts']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export namespace CartItem {
  type T = GenerateTypes<Database['cart_items']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export namespace Order {
  type T = GenerateTypes<Database['orders']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export namespace OrderItem {
  type T = GenerateTypes<Database['order_items']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export const SIGN_UP_VERIFICATION_TOKEN_PURPOSE_KEY = 'SIGN_UP_VERIFICATION'
export const SIGN_IN_VERIFICATION_TOKEN_PURPOSE_KEY = 'SIGN_IN_VERIFICATION'
