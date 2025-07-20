import type { VendorRepository, VendorRepositoryError } from './interface'
import { Result } from 'true-myth'
import type { KyselyClient } from '@/features/database/kysely'
import type { Vendor } from '@/types'
import type { Logger } from '@/features/logger'

class KyselyVendorRepository implements VendorRepository {
  constructor(
    private readonly client: KyselyClient,
    private readonly logger: Logger
  ) {}

  async create(
    payload: Vendor.Insertable
  ): Promise<Result<Vendor.Selectable, VendorRepositoryError>> {
    try {
      const result = await this.client
        .insertInto('vendors')
        .values(payload)
        .returningAll()
        .executeTakeFirstOrThrow()

      return Result.ok(result)
    } catch (err) {
      this.logger.error('failed to create vendor', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async findById(
    id: string
  ): Promise<Result<Vendor.Selectable, VendorRepositoryError>> {
    try {
      const result = await this.client
        .selectFrom('vendors')
        .where('id', '=', id)
        .selectAll()
        .executeTakeFirstOrThrow()

      return Result.ok(result)
    } catch (error) {
      this.logger.error('failed to find vendor by id', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async findByUserId(
    user_id: string
  ): Promise<Result<Vendor.Selectable | null, VendorRepositoryError>> {
    try {
      const result = await this.client
        .selectFrom('vendors')
        .where('user_id', '=', user_id)
        .selectAll()
        .executeTakeFirst()

      return Result.ok(result ?? null)
    } catch (error) {
      this.logger.error('failed to find vendor by user id', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async updateById(
    id: string,
    payload: Vendor.Updateable
  ): Promise<Result<Vendor.Selectable, VendorRepositoryError>> {
    try {
      const result = await this.client
        .updateTable('vendors')
        .where('id', '=', id)
        .set(payload)
        .returningAll()
        .executeTakeFirstOrThrow()

      return Result.ok(result)
    } catch (error) {
      this.logger.error('failed to update vendor by id', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async deleteById(
    id: string
  ): Promise<Result<Vendor.Selectable, VendorRepositoryError>> {
    try {
      const result = await this.client
        .deleteFrom('vendors')
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow()

      return Result.ok(result)
    } catch (error) {
      this.logger.error('failed to delete vendor by id', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }
}

export default KyselyVendorRepository
