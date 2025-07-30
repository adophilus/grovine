import type ReferralRepository from './interface'
import type { ReferralRepositoryError } from './interface'
import { Result } from 'true-myth'
import type { KyselyClient } from '@/features/database/kysely'
import type { Referral } from '@/types'
import type { Logger } from '@/features/logger'

class KyselyReferralRepository implements ReferralRepository {
  constructor(
    private readonly client: KyselyClient,
    private readonly logger: Logger
  ) {}

  async create(
    payload: Referral.Insertable
  ): Promise<Result<Referral.Selectable, ReferralRepositoryError>> {
    try {
      const result = await this.client
        .insertInto('referrals')
        .values(payload)
        .returningAll()
        .executeTakeFirstOrThrow()

      return Result.ok(result)
    } catch (err) {
      this.logger.error('failed to create referral', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async findByCode(
    code: string
  ): Promise<Result<Referral.Selectable | null, ReferralRepositoryError>> {
    try {
      const result = await this.client
        .selectFrom('referrals')
        .where('code', '=', code)
        .selectAll()
        .executeTakeFirst()

      return Result.ok(result ?? null)
    } catch (error) {
      this.logger.error('failed to find referral by code', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }
}

export default KyselyReferralRepository
