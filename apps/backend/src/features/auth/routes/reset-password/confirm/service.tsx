import Repository from '../../../repository'
import { Result } from 'true-myth'
import type { Schema } from './schema'
import { hashPassword } from '../../../utils/password-utils'

export type Error = 'UNEXPECTED_ERROR' | 'INVALID_OR_EXPIRED_TOKEN'

export type Payload = Schema

export default async (payload: Payload): Promise<Result<null, Error>> => {
  const findTokenResult = await Repository.findPasswordResetTokenByToken(
    payload.token
  )
  if (findTokenResult.isErr) return Result.err('ERR_UNEXPECTED')

  const token = findTokenResult.value

  console.log(token,findTokenResult)

  if (!token) return Result.err('INVALID_OR_EXPIRED_TOKEN')

  const newHashedPassword = await hashPassword(payload.password)

  const findAuthMethodResult =
    await Repository.findAuthenticationMethodByUserId(token.user_id)

  if (findAuthMethodResult.isErr) return Result.err('ERR_UNEXPECTED')

  const authMethod = findAuthMethodResult.value

  if (!authMethod) {
    const createAuthMethodResult = await Repository.createAuthenticationMethod({
      user_id: token.user_id,
      meta: {
        provider: 'credentials',
        data: newHashedPassword
      }
    })

    if (createAuthMethodResult.isErr) return Result.err('ERR_UNEXPECTED')
  } else {
    const updateAuthMethodResult =
      await Repository.updateAuthenticationMethodById(authMethod.id, {
        meta: {
          provider: 'credentials',
          data: newHashedPassword
        }
      })

    if (updateAuthMethodResult.isErr) return Result.err('ERR_UNEXPECTED')
  }

  return Result.ok(null)
}
