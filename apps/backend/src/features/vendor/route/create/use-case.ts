import type { Request, Response } from './types'
import { Result } from 'true-myth'
import type { VendorRepository } from '../../repository'
import type { User } from '@/types'
import { ulid } from 'ulidx'

class CreateVendorUseCase {
  constructor(private vendorRepository: VendorRepository) {}

  async execute(
    payload: Request.Body,
    user: User.Selectable
  ): Promise<Result<Response.Success, Response.Error>> {
    const createVendorResult = await this.vendorRepository.create({
      ...payload,
      user_id: user.id,
      is_verified: true,
      is_banned: true,
      rating: 0,
      id: ulid()
    })

    if (createVendorResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    return Result.ok({
      code: 'VENDOR_PROFILE_CREATED'
    })
  }
}

export default CreateVendorUseCase
