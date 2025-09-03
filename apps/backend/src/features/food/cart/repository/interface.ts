import type { Result, Unit } from 'true-myth'
import type { Cart, CartItem } from '@/types'

export type FoodCartRepositoryError = 'ERR_UNEXPECTED'

export type CartWithGroupedItems = Cart.Selectable & {
  items: {
    image: CartItem.Selectable['image']
    items: CartItem.Selectable[]
    total_price: number
  }[]
}

abstract class FoodCartRepository {
  public abstract findByUserId(
    userId: string
  ): Promise<Result<CartWithGroupedItems | null, FoodCartRepositoryError>>

  public abstract addItem(payload: {
    userId: string
    itemId: string
    quantity: number
  }): Promise<
    Result<
      Cart.Selectable,
      'ERR_ITEM_NOT_FOUND' | 'ERR_UNEXPECTED' | 'ERR_ITEM_NOT_FOUND'
    >
  >

  public abstract clearById(
    id: string
  ): Promise<Result<Unit, FoodCartRepositoryError>>
}

export default FoodCartRepository
