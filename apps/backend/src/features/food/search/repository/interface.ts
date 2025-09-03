import type { Result } from 'true-myth'
import type { Pagination } from '@/features/pagination'
import type { FoodItem } from '@/types'

export type FoodSearchRepositoryError = 'ERR_UNEXPECTED'

export type SearchOptions = Pagination.Options & {
  q?: string
  is_deleted?: boolean
}

abstract class FoodSearchRepository {
  public abstract searchFoodItems(
    options: SearchOptions
  ): Promise<
    Result<Pagination.Paginated<FoodItem.Selectable>, FoodSearchRepositoryError>
  >
}

export default FoodSearchRepository
