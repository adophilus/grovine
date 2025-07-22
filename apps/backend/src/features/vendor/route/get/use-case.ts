import type { Request, Response } from './types'
import { Result } from 'true-myth'
import type { VendorRepository } from '../../repository'

class GetVendorUseCase {
  constructor(private vendorRepository: VendorRepository) {}

  async execute(
    payload: Request.Path
  ): Promise<Result<Response.Success, Response.Error>> {
    const findVendorResult = await this.vendorRepository.findById(payload.id)

    if (findVendorResult.isErr) {
      return Result.err({
        code: 'ERR_VENDOR_PROFILE_NOT_FOUND'
      })
    }

    const vendor = findVendorResult.value
    if (!vendor) {
      return Result.err({
        code: 'ERR_VENDOR_PROFILE_NOT_FOUND'
      })
    }

    return Result.ok({
      code: 'VENDOR_PROFILE_FOUND',
      data: vendor
    })
  }
}

export default GetVendorUseCase
