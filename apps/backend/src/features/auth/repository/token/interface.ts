import type { Result } from 'true-myth'
import type { Token } from '@/types'

export type AuthTokenRepositoryError = 'ERR_UNEXPECTED'

abstract class AuthTokenRepository {
  public abstract create(
    payload: Token.Insertable
  ): Promise<Result<Token.Selectable, AuthTokenRepositoryError>>

  public abstract findByUserIdAndPurpose(payload: {
    user_id: string
    purpose: string
  }): Promise<Result<Token.Selectable | null, AuthTokenRepositoryError>>

  public abstract updateById(
    id: string,
    payload: Omit<Token.Updateable, 'id' | 'purpose' | 'user_id' | 'updated_at'>
  ): Promise<Result<Token.Selectable, AuthTokenRepositoryError>>
}

export default AuthTokenRepository
