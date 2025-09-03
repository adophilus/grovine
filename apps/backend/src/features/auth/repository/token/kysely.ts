import { Result } from 'true-myth'
import type { KyselyClient } from '@/features/database/kysely'
import type { Logger } from '@/features/logger'
import type { Token } from '@/types'
import type AuthTokenRepository from './interface'
import type { AuthTokenRepositoryError } from './interface'

class KyselyAuthTokenRepository implements AuthTokenRepository {
  constructor(
    private client: KyselyClient,
    private logger: Logger
  ) {}

  public async create(
    payload: Token.Insertable
  ): Promise<Result<Token.Selectable, AuthTokenRepositoryError>> {
    try {
      const token = await this.client
        .insertInto('tokens')
        .values(payload)
        .returningAll()
        .executeTakeFirstOrThrow()
      return Result.ok(token)
    } catch (err) {
      this.logger.error('failed to create token:', err)
      this.logger.error((err as any).code)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async findByUserIdAndPurpose(payload: {
    user_id: string
    purpose: string
  }): Promise<Result<Token.Selectable | null, AuthTokenRepositoryError>> {
    try {
      const token = await this.client
        .selectFrom('tokens')
        .selectAll()
        .where('user_id', '=', payload.user_id)
        .where('purpose', '=', payload.purpose)
        .executeTakeFirst()
      return Result.ok(token ?? null)
    } catch (err) {
      this.logger.error(
        'failed to find token by user id and purpose:',
        payload.user_id,
        payload.purpose,
        err
      )
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async updateById(
    id: string,
    payload: Omit<Token.Updateable, 'id' | 'purpose' | 'user_id' | 'updated_at'>
  ): Promise<Result<Token.Selectable, AuthTokenRepositoryError>> {
    try {
      const token = await this.client
        .updateTable('tokens')
        .set(payload)
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow()
      return Result.ok(token)
    } catch (err) {
      this.logger.error('failed to update token by id:', id, err)
      return Result.err('ERR_UNEXPECTED')
    }
  }
}

export default KyselyAuthTokenRepository
