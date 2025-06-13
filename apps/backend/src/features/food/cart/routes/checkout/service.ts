import { logger } from '@/features/food/logger'
import type { Request, Response } from './types'
import Repository from '../../repository'
import { Result } from 'true-myth'

export default async function service(
  payload: Request.Body,
  user_id: string
): Promise<Result<Response.Success, Response.Error>> {
  // Get user's cart
  const cartResult = await Repository.findCartByUserId(user_id)
  if (cartResult.isErr) {
    logger.error('Failed to find cart', { error: cartResult.error })
    return Result.err({ code: 'ERR_UNEXPECTED' })
  }

  const cart = cartResult.value
  if (!cart || cart.items.length === 0) {
    logger.error('Cart is empty', { user_id })
    return Result.err({ code: 'ERR_CART_EMPTY' })
  }

  // TODO: Implement payment processing based on payment_method
  // TODO: Create order record
  // TODO: Clear cart after successful checkout

  return Result.ok({ code: 'CHECKOUT_SUCCESSFUL' })
}
