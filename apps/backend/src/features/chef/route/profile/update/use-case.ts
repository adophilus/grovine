import type { Request, Response } from './types'
import { Result } from 'true-myth'
import type { ChefRepository } from '../../../repository'
import type { StorageService, UploadedData } from '@/features/storage/service'
import type { User } from '@/types'

class UpdateActiveChefProfileUseCase {
  constructor(
    private chefRepository: ChefRepository,
    private storageService: StorageService
  ) {}

  async execute(
    payload: Request.Body,
    user: User.Selectable
  ): Promise<Result<Response.Success, Response.Error>> {
    const { profile_picture, ..._payload } = payload
    let updatedProfilePicture: UploadedData | undefined

    if (profile_picture) {
      const uploadedResult = await this.storageService.upload(profile_picture)
      if (uploadedResult.isErr) {
        return Result.err({
          code: 'ERR_UNEXPECTED'
        })
      }
      updatedProfilePicture = uploadedResult.value
    }

    const updateChefResult = await this.chefRepository.updateById(user.id, {
      ..._payload,
      profile_picture: updatedProfilePicture
    })

    if (updateChefResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    return Result.ok({
      code: 'CHEF_UPDATED',
      data: updateChefResult.value
    })
  }
}

export default UpdateActiveChefProfileUseCase
