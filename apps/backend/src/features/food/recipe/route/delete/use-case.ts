import type { Request, Response } from './types'
import { Result } from 'true-myth'
import type { FoodRecipeRepository } from '../../repository'
import type { User } from '@/types'
import type { ChefRepository } from '@/features/chef/repository'

class DeleteFoodRecipeUseCase {
  constructor(
    private readonly recipeRepository: FoodRecipeRepository,
    private readonly chefRepository: ChefRepository
  ) {}

  async execute(
    payload: Request.Params,
    user: User.Selectable
  ): Promise<Result<Response.Success, Response.Error>> {
    const findRecipeResult = await this.recipeRepository.findById(payload.id)
    if (findRecipeResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    const recipe = findRecipeResult.value
    if (!recipe) {
      return Result.err({
        code: 'ERR_RECIPE_NOT_FOUND'
      })
    }

    const findChefResult = await this.chefRepository.findByUserId(user.id)

    if (findChefResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    const chef = findChefResult.value
    if (!chef || chef.id !== recipe.chef_id) {
      return Result.err({
        code: 'ERR_UNAUTHORIZED'
      })
    }

    const deleteRecipeResult = await this.recipeRepository.deleteById(
      payload.id
    )

    if (deleteRecipeResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    return Result.ok({ code: 'RECIPE_DELETED' })
  }
}

export default DeleteFoodRecipeUseCase
