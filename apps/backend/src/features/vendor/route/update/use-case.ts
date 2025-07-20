import type { Request, Response } from './types'
import { Result } from 'true-myth'
import type { VendorRepository } from '../../repository'

class UpdateVendorUseCase {
  constructor(private vendorRepository: VendorRepository) {}

  async execute(
    payload: Request.Body,
    user_id: string
  ): Promise<Result<Response.Success, Response.Error>> {
    const updateVendorResult = await this.vendorRepository.update(user_id, payload)

    if (updateVendorResult.isErr) {
      return Result.err({
        code: 'VENDOR_ACCOUNT_NOT_FOUND'
      })
    }

    return Result.ok({
      code: 'VENDOR_ACCOUNT_UPDATED',
      data: updateVendorResult.value
    })
  }
}

export default UpdateVendorUseCase
