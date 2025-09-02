import { Result } from 'true-myth'
import type { Response } from './types'
import { AuthUserRepository } from '@/features/auth/repository'

export default class MakeUserAdminUseCase {
  constructor(private authUserRepository: AuthUserRepository) {}

  public async execute(
    userId: string
  ): Promise<Result<Response.Success, Response.Error>> {
    const updateUserResult = await this.authUserRepository.updateById(userId, {
      role: 'ADMIN'
    })

    if (updateUserResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    return Result.ok({
      code: 'USER_ROLE_UPDATED'
    })
  }
}
