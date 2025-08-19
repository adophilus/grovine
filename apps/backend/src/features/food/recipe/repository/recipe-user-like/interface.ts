import type { Pagination } from '@/features/pagination'
import type { RecipeUserLike } from '@/types'
import type { Result, Unit } from 'true-myth'

export type RecipeRepositoryError = 'ERR_UNEXPECTED'

abstract class RecipeUserLikeRepository {
  public abstract create(
    payload: RecipeUserLike.Insertable
  ): Promise<Result<RecipeUserLike.Selectable, RecipeRepositoryError>>

  public abstract findById(
    id: string
  ): Promise<Result<RecipeUserLike.Selectable | null, RecipeRepositoryError>>

  public abstract findByRecipeIdAndUserId(
    recipeId: string,
    userId: string
  ): Promise<Result<RecipeUserLike.Selectable, RecipeRepositoryError>>

  public abstract findManyByUserId(
    userId: string,
    options: Pagination.Options
  ): Promise<
    Result<Pagination.Paginated<RecipeUserLike.Selectable>, RecipeRepositoryError>
  >

  public abstract updateById(
    id: string,
    payload: RecipeUserLike.Updateable
  ): Promise<Result<RecipeUserLike.Selectable, RecipeRepositoryError>>

  public abstract deleteById(
    id: string
  ): Promise<Result<Unit, RecipeRepositoryError>>

  public abstract toggleLikeById(
    recipeId: string,
    userId: string
  ): Promise<Result<Unit, RecipeRepositoryError>>

  public abstract toggleDislikeById(
    recipeId: string,
    userId: string
  ): Promise<Result<Unit, RecipeRepositoryError>>

  public abstract countLikesByRecipeId(
    recipeId: string
  ): Promise<Result<number, RecipeRepositoryError>>

  public abstract countDislikesByRecipeId(
    recipeId: string
  ): Promise<Result<number, RecipeRepositoryError>>
}

export default RecipeUserLikeRepository
