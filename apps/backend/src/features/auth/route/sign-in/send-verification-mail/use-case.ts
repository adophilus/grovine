import { addSeconds } from 'date-fns'
import { Result } from 'true-myth'
import { ulid } from 'ulidx'
import type {
  AuthTokenRepository,
  AuthUserRepository
} from '@/features/auth/repository'
import { generateToken } from '@/features/auth/utils/token'
import { config } from '@/features/config'
import type { Mailer } from '@/features/mailer'
import { SIGN_IN_VERIFICATION_TOKEN_PURPOSE_KEY, type Token } from '@/types'
import SignUpVerificationMail from './mail/sign-up-verification'
import type { Request, Response } from './types'
import { generateKey } from 'node:crypto'

class SendSignInVerificationEmailUseCase {
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

    const user = existingUserResult.value
    if (!user)
      return Result.err({
        code: 'ERR_USER_NOT_FOUND'
      })

    const tokenExpiryTime = addSeconds(
      new Date(),
      config.auth.token.signin.expiry
    ).toISOString()

    const existingTokenResult =
      await this.authTokenRepository.findByUserIdAndPurpose({
        user_id: user.id,
        purpose: SIGN_IN_VERIFICATION_TOKEN_PURPOSE_KEY
      })

    if (existingTokenResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    const existingToken = existingTokenResult.value

    let token: Token.Selectable

    if (!existingToken) {
      const tokenCreationResult = await this.authTokenRepository.create({
        id: ulid(),
        token: generateToken(),
        purpose: SIGN_IN_VERIFICATION_TOKEN_PURPOSE_KEY,
        user_id: user.id,
        expires_at: tokenExpiryTime
      })

      if (tokenCreationResult.isErr)
        return Result.err({
          code: 'ERR_UNEXPECTED'
        })

      token = tokenCreationResult.value
    } else {
      const tokenUpdateResult = await this.authTokenRepository.updateById(
        existingToken.id,
        {
          token: generateToken(),
          expires_at: tokenExpiryTime
        }
      )

      if (tokenUpdateResult.isErr) {
        return Result.err({
          code: 'ERR_UNEXPECTED'
        })
      }

      token = tokenUpdateResult.value
    }

    await this.mailer.send({
      recipients: [user.email],
      subject: "Here's your verification code",
      email: SignUpVerificationMail({ token })
    })

    return Result.ok({
      code: 'VERIFICATION_EMAIL_SENT'
    })
  }
}

export default SendSignInVerificationEmailUseCase
