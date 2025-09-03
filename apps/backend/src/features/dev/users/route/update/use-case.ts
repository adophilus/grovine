import { Result } from 'true-myth'
import type { AuthUserRepository } from '@/features/auth/repository'
import type { Request, Response } from './types'

export default class UpdateUserRoleUseCase {
  constructor(private authUserRepository: AuthUserRepository) {}

  public async execute(
    payload: Request.Path & Request.Body
  ): Promise<Result<Response.Success, Response.Error>> {
    const { id, ..._payload } = payload

    const updateUserResult = await this.authUserRepository.updateById(
      id,
      _payload
    )

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
