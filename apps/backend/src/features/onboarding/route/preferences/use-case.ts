import { Result } from 'true-myth'
import { ulid } from 'ulidx'
import type { User } from '@/types'
import type { OnboardingRepository } from '../../repository/interface'
import type { Request, Response } from './types'

type Payload = Request.Body

class SetUserPreferencesUseCase {
  constructor(private repository: OnboardingRepository) {}

  async execute(
    payload: Payload,
    user: User.Selectable
  ): Promise<Result<Response.Success, Response.Error>> {
    const findPreferencesResult =
      await this.repository.findUserPreferencesByUserId(user.id)

    if (findPreferencesResult.isErr) {
      return Result.err({ code: 'ERR_UNEXPECTED' })
    }

    if (findPreferencesResult.value !== null) {
      return Result.err({ code: 'ERR_USER_ALREADY_ONBOARDED' })
    }

    // TODO: check if `payload.foods` is valid
    // TODO: check if `payload.regions` is valid

    const createUserPreferencesResult =
      await this.repository.createUserPreferences({
        ...payload,
        id: ulid(),
        user_id: user.id
      })

    if (createUserPreferencesResult.isErr) {
      return Result.err({ code: 'ERR_UNEXPECTED' })
    }

    return Result.ok({ code: 'PREFERENCES_SET' })
  }
}

export default SetUserPreferencesUseCase
