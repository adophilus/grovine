import type { Result, Unit } from 'true-myth'
import type { Pagination } from '@/features/pagination'
import type { ChefUserRating } from '@/types'

export type ChefRepositoryError = 'ERR_UNEXPECTED'

abstract class ChefUserRatingRepository {
  public abstract create(
    payload: ChefUserRating.Insertable
  ): Promise<Result<ChefUserRating.Selectable, ChefRepositoryError>>

  public abstract findById(
    id: string
  ): Promise<Result<ChefUserRating.Selectable | null, ChefRepositoryError>>

  public abstract findByChefIdAndUserId(
    chefId: string,
    userId: string
  ): Promise<Result<ChefUserRating.Selectable, ChefRepositoryError>>

  public abstract findManyByUserId(
    userId: string,
    options: Pagination.Options
  ): Promise<
    Result<Pagination.Paginated<ChefUserRating.Selectable>, ChefRepositoryError>
  >

  public abstract updateById(
    id: string,
    payload: ChefUserRating.Updateable
  ): Promise<Result<ChefUserRating.Selectable, ChefRepositoryError>>

  public abstract deleteById(
    id: string
  ): Promise<Result<Unit, ChefRepositoryError>>

  public abstract rateById(
    chefId: string,
    userId: string,
    rating: number
  ): Promise<Result<Unit, ChefRepositoryError>>

  public abstract findManyByChefId(
    chefId: string
  ): Promise<Result<ChefUserRating.Selectable[], ChefRepositoryError>>

  public abstract getAverageRatingByChefId(
    chefId: string
  ): Promise<Result<number, ChefRepositoryError>>

  public abstract countRatingsByChefId(
    chefId: string
  ): Promise<Result<number, ChefRepositoryError>>
}

export default ChefUserRatingRepository
