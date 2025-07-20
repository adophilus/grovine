import type { InsertableVendor, SelectableVendor, UpdateableVendor } from '../types'
import type { Result } from 'true-myth'

export interface VendorRepository {
  create(payload: InsertableVendor): Promise<Result<SelectableVendor, Error>>
  find(user_id: string): Promise<Result<SelectableVendor, Error>>
  update(user_id: string, payload: UpdateableVendor): Promise<Result<SelectableVendor, Error>>
  delete(user_id: string): Promise<Result<SelectableVendor, Error>>
}
