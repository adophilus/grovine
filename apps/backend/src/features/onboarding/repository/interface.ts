import type { UserPreference } from '@/types'
import type { Result } from 'true-myth'

export type OnboardingRepositoryError = 'ERR_UNEXPECTED'

export abstract class OnboardingRepository {
  abstract createUserPreferences(
    payload: UserPreference.Insertable
  ): Promise<Result<UserPreference.Selectable, OnboardingRepositoryError>>

  abstract findUserPreferencesByUserId(
    id: string
  ): Promise<
    Result<UserPreference.Selectable | null, OnboardingRepositoryError>
  >
}
