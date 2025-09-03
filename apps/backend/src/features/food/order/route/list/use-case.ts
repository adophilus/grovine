import { Result } from 'true-myth'
import { Pagination } from '@/features/pagination'
import type { User } from '@/types'
import type { OrderRepository } from '../../repository'
import { serializeOrderWithItems } from '../../utils'
import type { Request, Response } from './types'

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

    const paginatedItems = listItemsResult.value
    const serializedItems = paginatedItems.data.map(serializeOrderWithItems)

    return Result.ok({
      code: 'LIST',
      data: Pagination.paginate(serializedItems, paginatedItems.meta)
    })
  }
}

export default ListOrdersUseCase
