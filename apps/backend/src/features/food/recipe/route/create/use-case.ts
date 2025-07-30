import type { StorageService, UploadedData } from '@/features/storage/service'
import type { Request, Response } from './types'
import { Result } from 'true-myth'
import type { FoodRecipeRepository } from '../../repository'
import { ulid } from 'ulidx'
import type { User } from '@/types'
import type { ChefRepository } from '@/features/chef/repository'

class CreateFoodRecipeUseCase {
  constructor(
    private readonly recipeRepository: FoodRecipeRepository,
    private readonly chefRepository: ChefRepository,
    private readonly storageService: StorageService
  ) {}

  async execute(
    payload: Request.Body,
    creator: User.Selectable
  ): Promise<Result<Response.Success, Response.Error>> {
    const findChefResult = await this.chefRepository.findByUserId(creator.id)
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

    const { cover_image, video, ..._payload } = payload

    const uploadResult = await this.storageService.upload([cover_image, video])
    if (uploadResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    const [uploadedCoverImage, uploadedVideo] = uploadResult.value

    const createRecipeResult = await this.recipeRepository.create({
      ..._payload,
      cover_image: uploadedCoverImage,
      video: uploadedVideo,
      chef_id: chef.id,
      id: ulid()
    })

    if (createRecipeResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    return Result.ok({
      code: 'RECIPE_CREATED'
    })
  }
}

export default CreateFoodRecipeUseCase
