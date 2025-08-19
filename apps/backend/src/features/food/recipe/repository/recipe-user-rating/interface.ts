import type { Pagination } from '@/features/pagination'
import type { RecipeUserRating } from '@/types'
import type { Result, Unit } from 'true-myth'

export type RecipeRepositoryError = 'ERR_UNEXPECTED'

abstract class RecipeUserRatingRepository {
  public abstract create(
    payload: RecipeUserRating.Insertable
  ): Promise<Result<RecipeUserRating.Selectable, RecipeRepositoryError>>

  public abstract findById(
    id: string
  ): Promise<Result<RecipeUserRating.Selectable | null, RecipeRepositoryError>>

  public abstract findByRecipeIdAndUserId(
    recipeId: string,
    userId: string
  ): Promise<Result<RecipeUserRating.Selectable, RecipeRepositoryError>>

  public abstract findManyByUserId(
    userId: string,
    options: Pagination.Options
  ): Promise<
    Result<Pagination.Paginated<RecipeUserRating.Selectable>, RecipeRepositoryError>
  >

  public abstract updateById(
    id: string,
    payload: RecipeUserRating.Updateable
  ): Promise<Result<RecipeUserRating.Selectable, RecipeRepositoryError>>

  public abstract deleteById(
    id: string
  ): Promise<Result<Unit, RecipeRepositoryError>>

  public abstract rateById(
    recipeId: string,
    userId: string,
    rating: number
  ): Promise<Result<Unit, RecipeRepositoryError>>

  public abstract getAverageRatingByRecipeId(
    recipeId: string
  ): Promise<Result<number, RecipeRepositoryError>>

  public abstract countRatingsByRecipeId(
    recipeId: string
  ): Promise<Result<number, RecipeRepositoryError>>
}

export default RecipeUserRatingRepository
