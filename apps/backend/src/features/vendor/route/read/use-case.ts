import type { Request, Response } from './types'
import { Result } from 'true-myth'
import type { VendorRepository } from '../../repository'

class ReadVendorUseCase {
  constructor(private vendorRepository: VendorRepository) {}

  async execute(
    payload: Request.Params
  ): Promise<Result<Response.Success, Response.Error>> {
    const findVendorResult = await this.vendorRepository.find(payload.user_id)

    if (findVendorResult.isErr) {
      return Result.err({
        code: 'VENDOR_ACCOUNT_NOT_FOUND'
      })
    }

    return Result.ok({
      code: 'VENDOR_ACCOUNT_FOUND',
      data: findVendorResult.value
    })
  }
}

export default ReadVendorUseCase
