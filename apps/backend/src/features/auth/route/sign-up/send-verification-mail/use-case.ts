import { Result } from 'true-myth'
import { SIGN_UP_VERIFICATION_TOKEN_PURPOSE_KEY } from '@/types'
import { Mailer } from '@/features/mailer'
import SignUpVerificationMail from './mail/sign-up-verification'
import { ulid } from 'ulidx'
import { config } from '@/features/config'
import { addSeconds } from 'date-fns'
import type { Request, Response } from './types'
import { generateToken } from '@/features/auth/utils/token'
import { WalletRepository } from '@/features/wallet/repository'
import type {
  AuthTokenRepository,
  AuthUserRepository
} from '@/features/auth/repository'

class SendSignUpVerificationEmailUseCase {
  constructor(
    private authUserRepository: AuthUserRepository,
    private authTokenRepository: AuthTokenRepository,
    private walletRepository: WalletRepository,
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
    if (existingUser)
      return Result.err({
        code: 'ERR_EMAIL_ALREADY_IN_USE'
      })

    const userCreationResult = await this.authUserRepository.create({
      ...payload,
      id: ulid()
    })

    if (userCreationResult.isErr)
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })

    const user = userCreationResult.value

    const walletCreationResult = await this.walletRepository.create({
      id: ulid(),
      balance: '0',
      user_id: user.id
    })

    if (walletCreationResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    const tokenExpiryTime = addSeconds(
      new Date(),
      config.environment.PRODUCTION || config.environment.STAGING
        ? 5 * 60
        : config.environment.DEVELOPMENT
          ? 60
          : 1
    ).toISOString()

    const tokenCreationResult = await this.authTokenRepository.create({
      id: ulid(),
      token: generateToken(),
      purpose: SIGN_UP_VERIFICATION_TOKEN_PURPOSE_KEY,
      user_id: user.id,
      expires_at: tokenExpiryTime
    })

    if (tokenCreationResult.isErr)
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })

    const token = tokenCreationResult.value

    await this.mailer.send({
      recipients: [user.email],
      subject: 'Verify your account',
      email: SignUpVerificationMail({ token })
    })

    return Result.ok({
      code: 'VERIFICATION_EMAIL_SENT'
    })
  }
}

export default SendSignUpVerificationEmailUseCase
