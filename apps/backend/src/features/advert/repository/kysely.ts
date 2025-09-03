import { Result, type Unit } from 'true-myth'
import type { KyselyClient } from '@/features/database/kysely/interface'
import type { Logger } from '@/features/logger'
import { Pagination } from '@/features/pagination'
import type { Adverts } from '@/types'
import type AdvertRepository from './interface'
import type { AdvertRepositoryError } from './interface'

class KyselyAdvertRepository implements AdvertRepository {
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
      // Separate media from other fields since it needs special handling
      const { media, ...otherFields } = payload

      // Prepare update object
      const updateFields: Record<string, any> = {
        ...otherFields,
        updated_at: new Date().toISOString()
      }

      // If media is provided, include it in the update
      if (media !== undefined) {
        updateFields.media = media
      }

      const advert = await this.client
        .updateTable('adverts')
        .set(updateFields)
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow()
      return Result.ok(advert)
    } catch (err) {
      this.logger.error('failed to update advert by id:', id, err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async deleteById(id: string): Promise<Result<Unit, AdvertRepositoryError>> {
    try {
      await this.client
        .updateTable('adverts')
        .set({
          deleted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .where('id', '=', id)
        .execute()
      return Result.ok()
    } catch (err) {
      this.logger.error('failed to delete the specified advert: ', id, err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async list(
    payload: Pagination.Options
  ): Promise<
    Result<Pagination.Paginated<Adverts.Selectable>, AdvertRepositoryError>
  > {
    try {
      const adverts = await this.client
        .selectFrom('adverts')
        .selectAll()
        .where('expires_at', '>', new Date().toISOString())
        .where('is_active', '=', true)
        .where('deleted_at', 'is', null)
        .orderBy('priority', 'desc')
        .orderBy('created_at', 'desc')
        .limit(payload.per_page)
        .offset((payload.page - 1) * payload.per_page)
        .execute()

      const { total } = await this.client
        .selectFrom('adverts')
        .select((eb) => eb.fn.countAll().as('total'))
        .where('expires_at', '>', new Date().toISOString())
        .where('is_active', '=', true)
        .where('deleted_at', 'is', null)
        .executeTakeFirstOrThrow()

      const paginatedAdverts = Pagination.paginate(adverts, {
        ...payload,
        total: Number(total)
      })

      return Result.ok(paginatedAdverts)
    } catch (err) {
      this.logger.error('failed to list adverts:', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }
}

export default KyselyAdvertRepository
