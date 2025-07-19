import { Result } from 'true-myth'
import type { Request, Response } from './types'
import { serializeOrderWithItems } from '../../utils'
import type { OrderRepository } from '../../repository'

class GetOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(
    payload: Request.Path
  ): Promise<Result<Response.Success, Response.Error>> {
    const result = await this.orderRepository.findById(payload.id)

    if (result.isErr) {
      return Result.err({ code: 'ERR_UNEXPECTED' })
    }

    const order = result.value

    if (!order) {
      return Result.err({ code: 'ERR_ORDER_NOT_FOUND' })
    }

    return Result.ok({
      code: 'ORDER_FOUND',
      data: serializeOrderWithItems(order)
    })
  }
}

export default GetOrderUseCase
