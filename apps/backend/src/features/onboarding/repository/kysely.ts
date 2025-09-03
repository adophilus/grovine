import { Result } from 'true-myth'
import type { KyselyClient } from '@/features/database/kysely'
import type { Logger } from '@/features/logger'
import type { UserPreference } from '@/types'
import type {
  OnboardingRepository,
  OnboardingRepositoryError
} from './interface'

class KyselyOnboardingRepository implements OnboardingRepository {
  constructor(
    private client: KyselyClient,
    private logger: Logger
  ) {}

  async createUserPreferences(
    payload: UserPreference.Insertable
  ): Promise<Result<UserPreference.Selectable, OnboardingRepositoryError>> {
    try {
      const user = await this.client
        .insertInto('user_preferences')
        .values(payload)
        .returningAll()
        .executeTakeFirstOrThrow()
      return Result.ok(user)
    } catch (err) {
      this.logger.error('failed to create user preference:', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async findUserPreferencesByUserId(
    id: string
  ): Promise<
    Result<UserPreference.Selectable | null, OnboardingRepositoryError>
  > {
    try {
      const userPreferences = await this.client
        .selectFrom('user_preferences')
        .selectAll()
        .where('user_id', '=', id)
        .executeTakeFirst()
      return Result.ok(userPreferences ?? null)
    } catch (err) {
      this.logger.error('failed to find user preferences by user id:', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }
}

export default KyselyOnboardingRepository
