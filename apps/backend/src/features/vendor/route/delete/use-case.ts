import * as tsr from 'ts-results'
import { StatusCodes } from '@/features/http'
import { Vendor } from '@/features/vendor/types'
import type { VendorRepository } from '@/features/vendor/repository'

export default class DeleteVendorUseCase {
  constructor(private vendorRepository: VendorRepository) {}

  async execute(user_id: string): Promise<tsr.Result<Vendor, { code: StatusCodes; message: string }>> {
    try {
      const deletedVendor = await this.vendorRepository.delete(user_id)

      if (!deletedVendor) {
        return tsr.Err({
          code: StatusCodes.NOT_FOUND,
          message: 'Vendor not found.'
        })
      }

      return tsr.Ok(deletedVendor)
    } catch (error) {
      console.error('Error deleting vendor:', error)
      return tsr.Err({
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Failed to delete vendor.'
      })
    }
  }
}
