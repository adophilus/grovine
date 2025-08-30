import type { Response, Request } from './types'
import { Result } from 'true-myth'
import type { FoodSearchRepository } from '../../repository'
import { serializeItem } from '../../utils'
import { Pagination } from '@/features/pagination'

class SearchFoodItemsUseCase {
  constructor(private searchRepository: FoodSearchRepository) {}

  async execute(
    query?: Request.Query
  ): Promise<Result<Response.Success, Response.Error>> {
    const q = query ?? {}

    const result = await this.searchRepository.searchFoodItems({
      page: q.page ?? 1,
      per_page: q.per_page ?? 10,
      q: q.q,
      is_deleted: false
    })

    if (result.isErr) {
      return Result.err({ code: 'ERR_UNEXPECTED' })
    }

    const data = result.value.data
    const serializedData = data.map(serializeItem)
    const paginatedData = Pagination.paginate(serializedData, result.value.meta)

    return Result.ok({
      code: 'LIST',
      data: paginatedData
    })
  }
}

export default SearchFoodItemsUseCase
