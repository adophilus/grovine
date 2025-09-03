import { Result } from 'true-myth'
import { ulid } from 'ulidx'
import type { OrderRepository } from '@/features/food/order/repository'
import type { PaymentService } from '@/features/payment/service'
import { createOrderInvoicePayload } from '@/features/payment/utils'
import type { User } from '@/types'
import type FoodCartRepository from '../../repository/interface'
import type { Request, Response } from './types'

class CheckoutCartUseCase {
  constructor(
    private cartRepository: FoodCartRepository,
    private orderRepository: OrderRepository,
    private paymentService: PaymentService
  ) {}

  async execute(
    payload: Request.Body,
    user: User.Selectable
  ): Promise<Result<Response.Success, Response.Error>> {
    const cartResult = await this.cartRepository.findByUserId(user.id)

    if (cartResult.isErr) {
      return Result.err({ code: 'ERR_UNEXPECTED' })
    }

    const cart = cartResult.value

    if (!cart || cart.items.length === 0) {
      return Result.err({ code: 'ERR_CART_EMPTY' })
    }

    const orderId = ulid()

    let paymentUrl: string | undefined

    if (payload.payment_method === 'ONLINE') {
      const paymentResult = await this.paymentService.createInvoice(
        createOrderInvoicePayload({
          amount: Number.parseFloat(cart.price),
          email: user.email,
          reference: orderId,
          order_id: orderId
        })
      )

      if (paymentResult.isErr) {
        return Result.err({ code: 'ERR_UNEXPECTED' })
      }

      paymentUrl = paymentResult.value.url
    } else {
      throw new Error('Unimplemented')
    }

    const orderCreationResult = await this.orderRepository.createFromCart(
      cart.id,
      {
        id: orderId,
        status: 'AWAITING_PAYMENT',
        payment_method: payload.payment_method,
        price: cart.price,
        user_id: user.id
      }
    )

    if (orderCreationResult.isErr) {
      return Result.err({ code: 'ERR_UNEXPECTED' })
    }

    const order = orderCreationResult.value

    const clearCartResult = await this.cartRepository.clearById(cart.id)

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
}

export default CheckoutCartUseCase
