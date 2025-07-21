import type { Request, Response } from './types'
import { Result } from 'true-myth'
import type { VendorRepository } from '../../repository'

class ListVendorUseCase {
  constructor(private vendorRepository: VendorRepository) {}

  async execute(
    payload: Request.Query
  ): Promise<Result<Response.Success, Response.Error>> {
    const findVendorsResult = await this.vendorRepository.findMany(payload)

    if (findVendorsResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    return Result.ok({
      code: 'LIST',
      data: findVendorsResult.value
    })
  }
}

export default ListVendorUseCase
