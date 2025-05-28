import Repository from '../../../repository'
import { addMinutes, compareAsc } from 'date-fns'
import { Result } from 'true-myth'
import { Mailer } from '../../../../mailer/lib'
import PasswordResetEmail from './emails/password-reset'
import type { Schema } from './schema'
import type { Token } from '../../../../database/schema'
import { ulid } from 'ulidx'
import { config } from '../../../../config'

export type Error =
  | { code: 'UNEXPECTED_ERROR' }
  | { code: 'USER_NOT_FOUND_ERROR' }
  | { code: 'TOKEN_NOT_EXPIRED'; data: { token: Token } }

export type Payload = Schema

export default async (payload: Payload): Promise<Result<null, Error>> => {
  const findUserResult = await Repository.findUserByEmail(payload.email)
  if (findUserResult.isErr) return Result.err({ code: 'ERR_UNEXPECTED' })

  const user = findUserResult.value

  if (!user) return Result.err({ code: 'USER_NOT_FOUND_ERROR' })

  const findExistingTokenResult =
    await Repository.findPasswordResetTokenByUserId(user.id)

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
    token: ulid(),
    expires_at: addMinutes(Date.now(), 30).toISOString(),
    purpose: 'password_reset'
  })

  if (result.isErr) return Result.err({ code: 'ERR_UNEXPECTED' })

  const token = result.value

  const resetPasswordLink = `${config.frontend.webappUrl}/auth/forgot-password/${token.token}`

  Mailer.send({
    recipients: [user.email],
    subject: 'Verify Account',
    email: (
      <PasswordResetEmail
        user={user}
        resetPasswordLink={resetPasswordLink}
        websiteLink={config.frontend.websiteUrl}
      />
    )
  })

  return Result.ok(null)
}
