import type { Result, Unit } from 'true-myth'
import type { Pagination } from '@/features/pagination'
import type { Adverts } from '@/types'

export type AdvertRepositoryError =
  | 'ERR_UNEXPECTED'
  | 'ERR_ADVERTISEMENT_NOT_FOUND'

abstract class AdvertRepository {
  abstract create(
    payload: Adverts.Insertable
  ): Promise<Result<Adverts.Selectable, AdvertRepositoryError>>

  abstract findById(
    id: string
  ): Promise<Result<Adverts.Selectable | null, AdvertRepositoryError>>

  abstract list(
    options: Pagination.Options
  ): Promise<
    Result<Pagination.Paginated<Adverts.Selectable>, AdvertRepositoryError>
  >

  abstract updateById(
    id: string,
    payload: Adverts.Updateable
  ): Promise<Result<Adverts.Selectable, AdvertRepositoryError>>

  abstract deleteById(id: string): Promise<Result<Unit, AdvertRepositoryError>>
}

export default AdvertRepository
