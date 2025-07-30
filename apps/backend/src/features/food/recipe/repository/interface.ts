import type { Pagination } from '@/features/pagination'
import type { FoodRecipe } from '@/types'
import type { Result, Unit } from 'true-myth'

export type FoodRecipeRepositoryError = 'ERR_UNEXPECTED'

abstract class FoodRecipeRepository {
  public abstract create(
    payload: FoodRecipe.Insertable
  ): Promise<Result<FoodRecipe.Selectable, FoodRecipeRepositoryError>>

  public abstract findById(
    id: string
  ): Promise<Result<FoodRecipe.Selectable | null, FoodRecipeRepositoryError>>

  public abstract list(
    options: Pagination.Options
  ): Promise<
    Result<
      Pagination.Paginated<FoodRecipe.Selectable>,
      FoodRecipeRepositoryError
    >
  >

  public abstract updateById(
    id: string,
    payload: FoodRecipe.Updateable
  ): Promise<Result<FoodRecipe.Selectable, FoodRecipeRepositoryError>>

  public abstract deleteById(
    id: string
  ): Promise<Result<Unit, FoodRecipeRepositoryError>>
}

export default FoodRecipeRepository
