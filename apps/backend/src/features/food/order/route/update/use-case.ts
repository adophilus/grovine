import { Result } from 'true-myth'
import type { OrderRepository } from '../../repository'
import type { Request, Response } from './types'

type Payload = Request.Body & Request.Path

class UpdateOrderStatusUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(
    payload: Payload
  ): Promise<Result<Response.Success, Response.Error>> {
    const result = await this.orderRepository.updateStatusById(
      payload.id,
      payload.status
    )

    if (result.isErr) {
      return Result.err({ code: 'ERR_UNEXPECTED' })
    }

    if (!result.value) {
      return Result.err({ code: 'ERR_ORDER_NOT_FOUND' })
    }

    return Result.ok({ code: 'ORDER_STATUS_UPDATED' })
  }
}

export default UpdateOrderStatusUseCase
