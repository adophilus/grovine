import type { Request, Response } from './types'
import { Result } from 'true-myth'
import type { FoodRecipeRepository } from '../../repository'
import type { StorageService } from '@/features/storage/service'
import type { ChefRepository } from '@/features/chef/repository'
import type { User } from '@/types'

class UpdateFoodRecipeUseCase {
  constructor(
    private readonly recipeRepository: FoodRecipeRepository,
    private readonly chefRepository: ChefRepository,
    private readonly storageService: StorageService
  ) {}

  async execute(
    params: Request.Params,
    payload: Request.Body,
    user: User.Selectable
  ): Promise<Result<Response.Success, Response.Error>> {
    const findChefResult = await this.chefRepository.findByUserId(user.id)
    if (findChefResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    const chef = findChefResult.value
    if (!chef) {
      return Result.err({
        code: 'ERR_UNAUTHORIZED'
      })
    }

    const findRecipeResult = await this.recipeRepository.findById(params.id)
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

    if (recipe.chef_id !== chef.id) {
      return Result.err({
        code: 'ERR_UNAUTHORIZED'
      })
    }

    const { cover_image, video, ..._payload } = payload

    if (cover_image) {
      const uploadResult = await this.storageService.upload([cover_image])
      if (uploadResult.isErr) {
        return Result.err({
          code: 'ERR_UNEXPECTED'
        })
      }

      const [uploadedCoverImage] = uploadResult.value
      _payload.cover_image = uploadedCoverImage
    }

    if (video) {
      const uploadResult = await this.storageService.upload([video])
      if (uploadResult.isErr) {
        return Result.err({
          code: 'ERR_UNEXPECTED'
        })
      }

      const [uploadedVideo] = uploadResult.value
      _payload.video = uploadedVideo
    }

    const updateRecipeResult = await this.recipeRepository.updateById(
      params.id,
      _payload
    )

    if (updateRecipeResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    return Result.ok({ code: 'RECIPE_UPDATED' })
  }
}

export default UpdateFoodRecipeUseCase
