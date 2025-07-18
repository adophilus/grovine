import { Result } from 'true-myth'
import type { Response } from './types'
import type FoodCartRepository from '../../repository/interface'
import type { User } from '@/types'
import type { CartWithGroupedItems } from '../../repository/interface'

class GetCartUseCase {
  constructor(private cartRepository: FoodCartRepository) {}

  async execute(
    user: User.Selectable
  ): Promise<Result<Response.Success, Response.Error>> {
    const result = await this.cartRepository.findByUserId(user.id)

    if (result.isErr) {
      return Result.err({ code: 'ERR_UNEXPECTED' })
    }

    const cart = result.value

    if (!cart) {
      return Result.ok({
        code: 'CART_FOUND',
        data: {
          id: '',
          user_id: user.id,
          items: [],
          created_at: new Date().toISOString(),
          updated_at: null
        }
      })
    }

    return Result.ok({
      code: 'CART_FOUND',
      data: serializeCartWithGroupedItems(cart)
    })
  }
}

type SerializedCartWithGroupedItems = Omit<CartWithGroupedItems, 'items'> & {
  items: (Omit<
    CartWithGroupedItems['items'][number],
    'total_price' | 'items'
  > & {
    total_price: number
    items: (Omit<
      CartWithGroupedItems['items'][number]['items'][number],
      'price'
    > & { price: number })[]
  })[]
}

const serializeCartWithGroupedItems = (
  cart: CartWithGroupedItems
): SerializedCartWithGroupedItems => {
  return {
    ...cart,
    items: cart.items.map((item) => ({
      ...item,
      total_price: Number(item.total_price),
      items: item.items.map((item) => ({
        ...item,
        price: Number(item.price)
      }))
    }))
  }
}

export default GetCartUseCase
