import type { Response, Request } from './types'
import { Result } from 'true-myth'
import { SearchRepository } from '../../repository'
import { serializeItem } from '../../utils'

class SearchFoodItemsUseCase {
  constructor(private searchRepository: SearchRepository) {}

  async execute(query?: Request.Query): Promise<Result<Response.Success, Response.Error>> {
    const q = query ?? {}

    const result = await this.searchRepository.searchFoodItems({
      page: q.page ?? 1,
      per_page: q.per_page ?? 10,
      q: q.q,
      is_deleted: false,
    })

    if (result.isErr) {
      return Result.err({ code: 'ERR_UNEXPECTED' })
    }

    const data = result.value.data

    return Result.ok({
      code: 'LIST',
      data: {
        data: data.map(serializeItem),
        meta: result.value.meta,
      },
    })
  }
}

export default SearchFoodItemsUseCase
