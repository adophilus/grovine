import Repository from '../../repository'
import { addMinutes, compareAsc } from 'date-fns'
import { Result } from 'true-myth'
import { Mailer } from '../../../mailer/lib'
import VerificationEmail from './emails/verification'
import type { Schema } from './schema'
import type { Token } from '../../../database/schema'
import { config } from '../../../config'

export type Error =
  | { code: 'UNEXPECTED_ERROR' }
  | { code: 'USER_NOT_FOUND_ERROR' }
  | { code: 'TOKEN_NOT_EXPIRED'; data: { token: Token } }

const generateOtp = (length: number) =>
  Math.floor(1 * 10 ** (length - 1) + Math.random() * 9 * 10 ** (length - 1))

export type Payload = Schema

export default async (payload: Payload): Promise<Result<Token, Error>> => {
  const findUserResult = await Repository.findUserByEmail(payload.email)
  if (findUserResult.isErr) return Result.err({ code: 'ERR_UNEXPECTED' })

  const user = findUserResult.value

  if (!user) return Result.err({ code: 'USER_NOT_FOUND_ERROR' })

  const findExistingTokenResult =
    await Repository.findVerificationTokenByUserId(user.id)
  if (findExistingTokenResult.isErr)
    return Result.err({ code: 'ERR_UNEXPECTED' })

  const existingToken = findExistingTokenResult.value
  if (existingToken) {
    const hasTokenExpired =
      compareAsc(existingToken.expires_at, Date.now()) === -1
    if (!hasTokenExpired) {
      return Result.err({
        code: 'TOKEN_NOT_EXPIRED',
        data: { token: existingToken }
      })
    }

    const existingTokenDeletionResult =
      await Repository.deleteVerificationTokenById(existingToken.id)
    if (existingTokenDeletionResult.isErr)
      return Result.err({ code: 'ERR_UNEXPECTED' })
  }

  const result = await Repository.createVerificationToken({
    user_id: user.id,
    token: generateOtp(6).toString(),
    expires_at: addMinutes(
      Date.now(),
      config.environment.PRODUCTION ? 30 : 1
    ).toISOString(),
    purpose: 'verification'
  })

  if (result.isErr) return Result.err({ code: 'ERR_UNEXPECTED' })

  const token = result.value

  Mailer.send({
    recipients: [user.email],
    subject: 'Verify Account',
    email: <VerificationEmail user={user} token={token} />
  })

  return Result.ok(token)
}
