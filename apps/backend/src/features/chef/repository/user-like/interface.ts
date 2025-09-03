import type { Result, Unit } from 'true-myth'
import type { Pagination } from '@/features/pagination'
import type { ChefUserLike } from '@/types'

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

  public abstract findManyByChefId(
    chefId: string
  ): Promise<Result<ChefUserLike.Selectable[], ChefRepositoryError>>

  public abstract countLikesByChefId(
    chefId: string
  ): Promise<Result<number, ChefRepositoryError>>

  public abstract countDislikesByChefId(
    chefId: string
  ): Promise<Result<number, ChefRepositoryError>>
}

export default ChefUserLikeRepository
