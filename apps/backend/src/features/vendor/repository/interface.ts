import type { Result } from 'true-myth'
import type { Vendor } from '@/types'
import type { Pagination } from '@/features/pagination'

export type VendorRepositoryError = 'ERR_UNEXPECTED'

abstract class VendorRepository {
  public abstract create(
    payload: Vendor.Insertable
  ): Promise<Result<Vendor.Selectable, VendorRepositoryError>>

  public abstract findById(
    id: string
  ): Promise<Result<Vendor.Selectable, VendorRepositoryError>>

  public abstract findByUserId(
    user_id: string
  ): Promise<Result<Vendor.Selectable, VendorRepositoryError>>

  public abstract findMany(
    options: Pagination.Options
  ): Promise<
    Result<Pagination.Paginated<Vendor.Selectable>, VendorRepositoryError>
  >

  public abstract updateById(
    id: string,
    payload: Vendor.Updateable
  ): Promise<Result<Vendor.Selectable, VendorRepositoryError>>

  public abstract deleteById(
    id: string
  ): Promise<Result<Vendor.Selectable, VendorRepositoryError>>
}

export default VendorRepository
