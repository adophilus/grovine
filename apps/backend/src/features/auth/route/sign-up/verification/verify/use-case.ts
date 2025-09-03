import { compareAsc } from 'date-fns'
import { Result } from 'true-myth'
import type {
  AuthTokenRepository,
  AuthUserRepository
} from '@/features/auth/repository'
import { generateTokens } from '@/features/auth/utils/token'
import type { Mailer } from '@/features/mailer'
import { SIGN_UP_VERIFICATION_TOKEN_PURPOSE_KEY } from '@/types'
import VerificationSuccessful from './mail/verification-successful'
import type { Request, Response } from './types'

class VerifySignUpVerificationEmailUseCase {
  constructor(
    private authUserRepository: AuthUserRepository,
    private authTokenRepository: AuthTokenRepository,
    private mailer: Mailer
  ) {}

  async execute(
    payload: Request.Body
  ): Promise<Result<Response.Success, Response.Error>> {
    const existingUserResult = await this.authUserRepository.findByEmail(
      payload.email
    )
    if (existingUserResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    const existingUser = existingUserResult.value
    if (!existingUser) {
      return Result.err({
        code: 'ERR_INVALID_OR_EXPIRED_TOKEN'
      })
    }

    const existingTokenResult =
      await this.authTokenRepository.findByUserIdAndPurpose({
        purpose: SIGN_UP_VERIFICATION_TOKEN_PURPOSE_KEY,
        user_id: existingUser.id
      })

    if (existingTokenResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    const existingToken = existingTokenResult.value

    if (
      !existingToken ||
      existingToken.token !== payload.otp ||
      compareAsc(new Date(), existingToken.expires_at) === 1
    ) {
      return Result.err({
        code: 'ERR_INVALID_OR_EXPIRED_TOKEN'
      })
    }

    const userUpdateResult = await this.authUserRepository.updateById(
      existingUser.id,
      {
        verified_at: new Date().toISOString()
      }
    )

    if (userUpdateResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    const user = userUpdateResult.value

    await this.mailer.send({
      recipients: [user.email],
      subject: 'Verification Successful',
      email: VerificationSuccessful()
    })

    const tokens = await generateTokens(user)

    return Result.ok({
      code: 'AUTH_CREDENTIALS',
      data: tokens
    })
  }
}

export default VerifySignUpVerificationEmailUseCase
