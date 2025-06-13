import { Result } from 'true-myth'
import Repository from '../../repository'
import type { Response } from './types'

export default async (
  user_id: string
): Promise<Result<Response.Success, Response.Error>> => {
  const result = await Repository.findCartByUserId(user_id)

  if (result.isErr) {
    return Result.err({ code: 'ERR_UNEXPECTED' })
  }

  const cart = result.value

  if (!cart) {
    return Result.ok({
      code: 'CART_FOUND',
      data: {
        id: '',
        user_id,
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

type SerializedCartWithGroupedItems = Omit<
  Repository.CartWithGroupedItems,
  'items'
> & {
  items: (Omit<
    Repository.CartWithGroupedItems['items'][number],
    'total_price' | 'items'
  > & {
    total_price: number
    items: (Omit<
      Repository.CartWithGroupedItems['items'][number]['items'][number],
      'price'
    > & { price: number })[]
  })[]
}

const serializeCartWithGroupedItems = (
  cart: Repository.CartWithGroupedItems
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
