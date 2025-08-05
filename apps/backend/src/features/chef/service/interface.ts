
import type { Result, Unit } from 'true-myth'

export type ChefServiceError = 'ERR_UNEXPECTED' | 'ERR_CHEF_PROFILE_NOT_FOUND'

abstract class ChefService {
  public abstract handleLikeToggle(
    chefId: string,
    userId: string
  ): Promise<Result<Unit, ChefServiceError>>

  public abstract handleDislikeToggle(
    chefId: string,
    userId: string
  ): Promise<Result<Unit, ChefServiceError>>

  public abstract handleRating(
    chefId: string,
    userId: string,
    rating: number
  ): Promise<Result<Unit, ChefServiceError>>
}

export default ChefService
