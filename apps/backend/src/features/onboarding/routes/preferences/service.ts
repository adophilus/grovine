import type { User } from '@/types'
import Repository from '../../repository'
import type { Request, Response } from './types'
import { Result } from 'true-myth'
import { ulid } from 'ulidx'

type Payload = Request.Body

export default async (
  payload: Payload,
  user: User.Selectable
): Promise<Result<Response.Success, Response.Error>> => {
  const findPreferencesResult = await Repository.findUserPreferencesByUserId(
    user.id
  )

  if (findPreferencesResult.isErr) {
    return Result.err({ code: 'ERR_UNEXPECTED' })
  }

  if (findPreferencesResult.value !== null) {
    return Result.err({
      code: 'ERR_USER_ALREADY_ONBOARDED'
    })
  }

  // TODO: check if `payload.foods` is valid
  // TODO: check if `payload.regions` is valid

  const createUserPreferencesResult = await Repository.createUserPreferences({
    ...payload,
    id: ulid(),
    user_id: user.id
  })

  if (createUserPreferencesResult.isErr) {
    return Result.err({
      code: 'ERR_UNEXPECTED'
    })
  }

  return Result.ok({
    code: 'PREFERENCES_SET'
  })
}
