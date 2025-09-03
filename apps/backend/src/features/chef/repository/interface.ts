import type { Result } from 'true-myth'
import type { Pagination } from '@/features/pagination'
import type { Chef } from '@/types'

export type ChefRepositoryError = 'ERR_UNEXPECTED'

abstract class ChefRepository {
  public abstract create(
    payload: Chef.Insertable
  ): Promise<Result<Chef.Selectable, ChefRepositoryError>>

  public abstract findById(
    id: string
  ): Promise<Result<Chef.Selectable | null, ChefRepositoryError>>

  public abstract findByUserId(
    user_id: string
  ): Promise<Result<Chef.Selectable | null, ChefRepositoryError>>

  public abstract findMany(
    options: Pagination.Options
  ): Promise<Result<Pagination.Paginated<Chef.Selectable>, ChefRepositoryError>>

  public abstract updateById(
    id: string,
    payload: Chef.Updateable
  ): Promise<Result<Chef.Selectable, ChefRepositoryError>>

  public abstract deleteById(
    id: string
  ): Promise<Result<Chef.Selectable, ChefRepositoryError>>
}

export default ChefRepository
