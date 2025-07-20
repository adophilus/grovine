import type { Kysely } from 'kysely'
import type { KyselyDatabaseTables } from '@/features/database/kysely/tables'
import type { VendorRepository } from '../interface'
import type {
  InsertableVendor,
  SelectableVendor,
  UpdateableVendor,
} from '@/features/vendor/types'
import { Result } from 'true-myth'

export class KyselyVendorRepository implements VendorRepository {
  constructor(private readonly db: Kysely<KyselyDatabaseTables>) {}

  async create(payload: InsertableVendor): Promise<Result<SelectableVendor, Error>> {
    try {
      const result = await this.db
        .insertInto('vendors')
        .values(payload)
        .returningAll()
        .executeTakeFirstOrThrow()

      return Result.ok(result)
    } catch (error) {
      return Result.err(new Error(error as string))
    }
  }

  async find(user_id: string): Promise<Result<SelectableVendor, Error>> {
    try {
      const result = await this.db
        .selectFrom('vendors')
        .where('user_id', '=', user_id)
        .selectAll()
        .executeTakeFirstOrThrow()

      return Result.ok(result)
    } catch (error) {
      return Result.err(new Error(error as string))
    }
  }

  async update(
    user_id: string,
    payload: UpdateableVendor
  ): Promise<Result<SelectableVendor, Error>> {
    try {
      const result = await this.db
        .updateTable('vendors')
        .where('user_id', '=', user_id)
        .set(payload)
        .returningAll()
        .executeTakeFirstOrThrow()

      return Result.ok(result)
    } catch (error) {
      return Result.err(new Error(error as string))
    }
  }

  async delete(user_id: string): Promise<Result<SelectableVendor, Error>> {
    try {
      const result = await this.db
        .deleteFrom('vendors')
        .where('user_id', '=', user_id)
        .returningAll()
        .executeTakeFirstOrThrow()

      return Result.ok(result)
    } catch (error) {
      return Result.err(new Error(error as string))
    }
  }
}
