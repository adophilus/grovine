import { Result } from 'true-myth'
import { serializeChef } from '@/features/chef/utils'
import type { StorageService, UploadedData } from '@/features/storage/service'
import type { User } from '@/types'
import type { ChefRepository } from '../../../repository'
import type { Request, Response } from './types'

class UpdateActiveChefProfileUseCase {
  constructor(
    private chefRepository: ChefRepository,
    private storageService: StorageService
  ) {}

  async execute(
    payload: Request.Body,
    user: User.Selectable
  ): Promise<Result<Response.Success, Response.Error>> {
    const findChefProfile = await this.chefRepository.findByUserId(user.id)
    if (findChefProfile.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    const chefProfile = findChefProfile.value
    if (!chefProfile) {
      return Result.err({
        code: 'ERR_CHEF_PROFILE_NOT_FOUND'
      })
    }

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

    const updatePayload = {
      ..._payload,
      profile_picture: updatedProfilePicture
    }
    const updateChefResult = await this.chefRepository.updateById(
      chefProfile.id,
      updatePayload
    )

    if (updateChefResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    const updatedChefProfile = updateChefResult.value
    const serializedChefProfile = serializeChef(updatedChefProfile)

    return Result.ok({
      code: 'CHEF_PROFILE_UPDATED',
      data: serializedChefProfile
    })
  }
}

export default UpdateActiveChefProfileUseCase
