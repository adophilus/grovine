import type { Adverts } from '@/types'
import { Result, type Unit } from 'true-myth'
import type { Pagination } from '@/features/pagination'
import type { AdvertRepository, AdvertRepositoryError } from './interface'
import type { KyselyClient } from '@/features/database/kysely/interface'
import type { Logger } from '@/features/logger'

export class AdvertKyselyRepository implements AdvertRepository {
  constructor(
    private client: KyselyClient,
    private logger: Logger
  ) {}

  async create(
    payload: Adverts.Insertable
  ): Promise<Result<Adverts.Selectable, AdvertRepositoryError>> {
    try {
      const advert = await this.client
        .insertInto('adverts')
        .values(payload)
        .returningAll()
        .executeTakeFirstOrThrow()
      return Result.ok(advert)
    } catch (err) {
      this.logger.error('failed to create advert', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async findById(
    id: string
  ): Promise<Result<Adverts.Selectable | null, AdvertRepositoryError>> {
    try {
      const advert = await this.client
        .selectFrom('adverts')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst()
      return Result.ok(advert ?? null)
    } catch (err) {
      this.logger.error('failed to get advert by id', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async updateById(
    id: string,
    payload: Adverts.Updateable
  ): Promise<Result<Adverts.Selectable, AdvertRepositoryError>> {
    try {
      const advert = await this.client
        .updateTable('adverts')
        .set({
          ...payload,
          updated_at: new Date().toISOString()
        })
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow()
      return Result.ok(advert)
    } catch (err) {
      this.logger.error('failde to update advert by id:', id, err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async deleteById(id: string): Promise<Result<Unit, AdvertRepositoryError>> {
    try {
      await this.client.deleteFrom('adverts').where('id', '=', id).execute()
      return Result.ok()
    } catch (err) {
      this.logger.error('failed to delete the specified advert: ', id, err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async list(
    payload: Pagination.Options
  ): Promise<Result<Adverts.Selectable[], AdvertRepositoryError>> {
    try {
      const adverts = await this.client
        .selectFrom('adverts')
        .selectAll()
        .limit(payload.per_page)
        .offset(payload.per_page)
        .execute()
      return Result.ok(adverts)
    } catch (err) {
      this.logger.error('failed to list adverts:', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }
}
