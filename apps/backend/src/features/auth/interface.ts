import type { Result } from 'true-myth'
import type { User } from './types'

export type AuthServiceError =
  | 'FAILED_TO_FETCH_USER'
  | 'USER_NOT_VERIFIED'
  | 'INVALID_OR_EXPIRED_TOKEN'

export interface AuthService {
  getUserWithProfile(token: string): Promise<Result<User, AuthServiceError>>
}
