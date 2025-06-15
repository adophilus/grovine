import { logger } from '@/features/food/logger'
import type { Request, Response } from './types'
import Repository from '../../repository'
import { Result } from 'true-myth'
import { PaymentService } from '@/features/payment'
import type { User } from '@/types'
import { ulid } from 'ulidx'

export default async function service(
  payload: Request.Body,
  user: User.Selectable
): Promise<Result<Response.Success, Response.Error>> {
  const cartResult = await Repository.findCartByUserId(user.id)

  if (cartResult.isErr) {
    return Result.err({ code: 'ERR_UNEXPECTED' })
  }

  const cart = cartResult.value

  if (!cart || cart.items.length === 0) {
    logger.error('Cart is empty:', user.id)
    return Result.err({ code: 'ERR_CART_EMPTY' })
  }

  const orderId = ulid()

  let paymentUrl: string | undefined

  if (payload.payment_method === 'ONLINE') {
    const paymentResult = await PaymentService.createPaymentInvoice({
      amount: Number.parseFloat(cart.price),
      email: user.email,
      reference: orderId
    })

    if (paymentResult.isErr) {
      return Result.err({ code: 'ERR_UNEXPECTED' })
    }

    paymentUrl = paymentResult.value.url
  } else {
    throw new Error('Unimplemented')
  }

  const orderCreationResult = await Repository.createOrderFromCart({
    id: orderId,
    status: 'AWAITING_PAYMENT',
    payment_method: payload.payment_method,
    price: cart.price,
    cart_id: cart.id,
    user_id: user.id
  })

  if (orderCreationResult.isErr) {
    return Result.err({ code: 'ERR_UNEXPECTED' })
  }

  const order = orderCreationResult.value

  const clearCartResult = await Repository.clearCartById(cart.id)

  if (clearCartResult.isErr) {
    return Result.err({ code: 'ERR_UNEXPECTED' })
  }

  return Result.ok({
    code: 'CHECKOUT_SUCCESSFUL',
    data: {
      order_id: order.id,
      url: paymentUrl
    }
  })
}
