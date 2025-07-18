import type { User } from '@/types'
import type { Request, Response } from './types'
import { Result } from 'true-myth'
import { serializeOrderWithItems } from '../../utils'
import type { OrderRepository } from '../../repository'

class ListOrdersUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(
    query: Request.Query,
    actor: User.Selectable
  ): Promise<Result<Response.Success, Response.Error>> {
    const listItemsResult = await this.orderRepository.findManyByUserId(
      actor.id,
      query
    )

    if (listItemsResult.isErr) {
      return Result.err({ code: 'ERR_UNEXPECTED' })
    }

    const items = listItemsResult.value

    return Result.ok({
      code: 'LIST',
      data: items.map(serializeOrderWithItems),
      meta: {
        page: query.page,
        per_page: query.per_page,
        total: items.length
      }
    })
  }
}

export default ListOrdersUseCase
