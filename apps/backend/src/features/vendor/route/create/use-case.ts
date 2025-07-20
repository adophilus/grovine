import type { Request, Response } from './types'
import { Result } from 'true-myth'
import type { VendorRepository } from '../../repository'

class CreateVendorUseCase {
  constructor(private vendorRepository: VendorRepository) {}

  async execute(
    payload: Request.Body,
    user_id: string
  ): Promise<Result<Response.Success, Response.Error>> {
    const createVendorResult = await this.vendorRepository.create({
      ...payload,
      user_id
    })

    if (createVendorResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    return Result.ok({
      code: 'VENDOR_ACCOUNT_CREATED',
      data: {
        id: createVendorResult.value.user_id
      }
    })
  }
}

export default CreateVendorUseCase
