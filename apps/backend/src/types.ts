import type { Insertable, Selectable, Updateable } from 'kysely'
import type { KyselyDatabaseTables } from './features/database/kysely'

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
  type T = GenerateTypes<KyselyDatabaseTables['users']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export namespace Token {
  type T = GenerateTypes<KyselyDatabaseTables['tokens']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export namespace UserPreference {
  type T = GenerateTypes<KyselyDatabaseTables['user_preferences']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export namespace FoodItem {
  type T = GenerateTypes<KyselyDatabaseTables['food_items']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export namespace FoodRecipe {
  type T = GenerateTypes<KyselyDatabaseTables['food_recipes']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export namespace Wallet {
  type T = GenerateTypes<KyselyDatabaseTables['wallets']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export namespace Cart {
  type T = GenerateTypes<KyselyDatabaseTables['carts']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export namespace Adverts {
  type T = GenerateTypes<KyselyDatabaseTables['adverts']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export namespace CartItem {
  type T = GenerateTypes<KyselyDatabaseTables['cart_items']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export namespace Order {
  type T = GenerateTypes<KyselyDatabaseTables['orders']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export namespace OrderItem {
  type T = GenerateTypes<KyselyDatabaseTables['order_items']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export namespace Transaction {
  type T = GenerateTypes<KyselyDatabaseTables['transactions']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export namespace Chef {
  type T = GenerateTypes<KyselyDatabaseTables['chefs']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export namespace ChefUserLike {
  type T = GenerateTypes<KyselyDatabaseTables['chef_user_likes']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export namespace ChefUserRating {
  type T = GenerateTypes<KyselyDatabaseTables['chef_user_ratings']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export namespace RecipeUserLike {
  type T = GenerateTypes<KyselyDatabaseTables['recipe_user_likes']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export namespace RecipeUserRating {
  type T = GenerateTypes<KyselyDatabaseTables['recipe_user_ratings']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export namespace Referral {
  type T = GenerateTypes<KyselyDatabaseTables['referrals']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export const SIGN_UP_VERIFICATION_TOKEN_PURPOSE_KEY = 'SIGN_UP_VERIFICATION'
export const SIGN_IN_VERIFICATION_TOKEN_PURPOSE_KEY = 'SIGN_IN_VERIFICATION'
