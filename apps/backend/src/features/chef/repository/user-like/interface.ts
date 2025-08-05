import type { Pagination } from '@/features/pagination'
import type { ChefUserLike } from '@/types'
import type { Result, Unit } from 'true-myth'

export type ChefRepositoryError = 'ERR_UNEXPECTED'

abstract class ChefUserLikeRepository {
  public abstract create(
    payload: ChefUserLike.Insertable
  ): Promise<Result<ChefUserLike.Selectable, ChefRepositoryError>>

  public abstract findById(
    id: string
  ): Promise<Result<ChefUserLike.Selectable | null, ChefRepositoryError>>

  public abstract findByChefIdAndUserId(
    chefId: string,
    userId: string
  ): Promise<Result<ChefUserLike.Selectable, ChefRepositoryError>>

  public abstract findManyByUserId(
    userId: string,
    options: Pagination.Options
  ): Promise<
    Result<Pagination.Paginated<ChefUserLike.Selectable>, ChefRepositoryError>
  >

  public abstract updateById(
    id: string,
    payload: ChefUserLike.Updateable
  ): Promise<Result<ChefUserLike.Selectable, ChefRepositoryError>>

  public abstract deleteById(
    id: string
  ): Promise<Result<Unit, ChefRepositoryError>>

  public abstract toggleLikeById(
    chefId: string,
    userId: string
  ): Promise<Result<Unit, ChefRepositoryError>>

  public abstract toggleDislikeById(
    chefId: string,
    userId: string
  ): Promise<Result<Unit, ChefRepositoryError>>
}

export default ChefUserLikeRepository
