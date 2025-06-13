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

  // If no cart exists, return empty cart
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
    data: cart
  })
}
