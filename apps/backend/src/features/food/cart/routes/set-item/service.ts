import { logger } from '@/features/food/logger'
import type { Request, Response } from './types'
import Repository from '../../repository'
import { Result } from 'true-myth'

export default async function service(
  payload: Request.Body,
  user_id: string
): Promise<Result<Response.Success, Response.Error>> {
  const { id, quantity } = payload

  const result = await Repository.addItemToCart({
    userId: user_id,
    itemId: id,
    quantity
  })

  if (result.isErr) {
    switch (result.error) {
      case 'ERR_ITEM_NOT_FOUND': {
        logger.error('Item not found', { food_id: id })
        return Result.err({ code: 'ERR_ITEM_NOT_FOUND' })
      }
      default: {
        logger.error('Failed to add item to cart', { error: result.error })
        return Result.err({ code: 'ERR_UNEXPECTED' })
      }
    }
  }

  return Result.ok({ code: 'ITEM_ADDED_TO_CART' })
}
