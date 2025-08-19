import type { FoodItem } from '@/types'
import type { Result } from 'true-myth'
import type { Pagination } from '@/features/pagination'

export type SearchRepositoryError = 'ERR_UNEXPECTED'

export type SearchOptions = Pagination.Options & {
  q?: string
  is_deleted?: boolean
}

abstract class SearchRepository {
  public abstract searchFoodItems(
    options: SearchOptions
  ): Promise<Result<Pagination.Paginated<FoodItem.Selectable>, SearchRepositoryError>>
}

export default SearchRepository