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
import type { ReferralRepository } from '@/features/referral/repository'
import type { WalletRepository } from '@/features/wallet/repository'
import { SIGN_UP_VERIFICATION_TOKEN_PURPOSE_KEY } from '@/types'
import SignUpVerificationMail from './mail/sign-up-verification'
import type { Request, Response } from './types'

class SendSignUpVerificationEmailUseCase {
  constructor(
    private authUserRepository: AuthUserRepository,
    private authTokenRepository: AuthTokenRepository,
    private walletRepository: WalletRepository,
    private referralRepository: ReferralRepository,
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

    const userId = ulid()

    const referralResult = await this.handleReferral(
      userId,
      payload.referral_code
    )

    if (referralResult.isErr) {
      return Result.err({ code: 'ERR_UNEXPECTED' })
    }

    const referralCode = referralResult.value

    const userCreationResult = await this.authUserRepository.create({
      ...payload,
      role: 'USER',
      referral_code: referralCode,
      id: userId
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
      config.auth.token.signup.expiry
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

  private async generateReferralCode(): Promise<
    Result<string, Response.Error>
  > {
    return Result.ok(ulid())
  }

  private async handleReferral(
    referredUserId: string,
    referralCode?: string
  ): Promise<Result<string, Response.Error>> {
    const newReferralCodeResult = await this.generateReferralCode()
    if (newReferralCodeResult.isErr) {
      return Result.err({ code: 'ERR_UNEXPECTED' })
    }

    const newReferralCode = newReferralCodeResult.value

    if (!referralCode) return Result.ok(newReferralCode)

    const findUserByReferralCodeResult =
      await this.authUserRepository.findByReferralCode(referralCode)
    if (findUserByReferralCodeResult.isErr) {
      return Result.err({ code: 'ERR_UNEXPECTED' })
    }

    const referringUser = findUserByReferralCodeResult.value

    if (!referringUser) {
      return Result.ok(newReferralCode)
    }

    const newReferral = await this.referralRepository.create({
      id: ulid(),
      code: referralCode,
      referrer_id: referringUser.id,
      referred_id: referredUserId
    })

    if (newReferral.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    return Result.ok(newReferralCode)
  }
}

export default SendSignUpVerificationEmailUseCase
