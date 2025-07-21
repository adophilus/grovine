import type { Request, Response } from './types'
import { Result } from 'true-myth'
import type { VendorRepository } from '../../repository'
import type { StorageService, UploadedData } from '@/features/storage/service'

class UpdateVendorUseCase {
  constructor(
    private vendorRepository: VendorRepository,
    private storageService: StorageService
  ) {}

  async execute(
    id: string,
    payload: Request.Body
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

    const updateVendorResult = await this.vendorRepository.updateById(id, {
      ..._payload,
      profile_picture: updatedProfilePicture
    })

    if (updateVendorResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    return Result.ok({
      code: 'VENDOR_UPDATED',
      data: updateVendorResult.value
    })
  }
}

export default UpdateVendorUseCase
