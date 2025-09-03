import { Result, Unit } from 'true-myth'
import type { ChefRepository } from '../repository'
import type { ChefUserLikeRepository } from '../repository/user-like'
import type { ChefUserRatingRepository } from '../repository/user-rating'
import type ChefService from './interface'
import type { ChefServiceError } from './interface'

class ChefServiceImpl implements ChefService {
  constructor(
    private chefRepository: ChefRepository,
    private chefUserLikeRepository: ChefUserLikeRepository,
    private chefUserRatingRepository: ChefUserRatingRepository
  ) {}

  public async handleLikeToggle(
    chefId: string,
    userId: string
  ): Promise<Result<Unit, ChefServiceError>> {
    const findChef = await this.chefRepository.findById(chefId)
    if (findChef.isErr) {
      return Result.err('ERR_UNEXPECTED')
    }
    if (!findChef.value) {
      return Result.err('ERR_CHEF_PROFILE_NOT_FOUND')
    }

    const toggleResult = await this.chefUserLikeRepository.toggleLikeById(
      chefId,
      userId
    )
    if (toggleResult.isErr) {
      return Result.err('ERR_UNEXPECTED')
    }

    // Update cached likes count
    const likesCount =
      await this.chefUserLikeRepository.countLikesByChefId(chefId)
    if (likesCount.isErr) {
      return Result.err('ERR_UNEXPECTED')
    }
    const dislikesCount =
      await this.chefUserLikeRepository.countDislikesByChefId(chefId)
    if (dislikesCount.isErr) {
      return Result.err('ERR_UNEXPECTED')
    }
    await this.chefRepository.updateById(chefId, {
      likes: likesCount.value,
      dislikes: dislikesCount.value
    })

    return Result.ok(Unit)
  }

  public async handleDislikeToggle(
    chefId: string,
    userId: string
  ): Promise<Result<Unit, ChefServiceError>> {
    const findChef = await this.chefRepository.findById(chefId)
    if (findChef.isErr) {
      return Result.err('ERR_UNEXPECTED')
    }
    if (!findChef.value) {
      return Result.err('ERR_CHEF_PROFILE_NOT_FOUND')
    }

    const toggleResult = await this.chefUserLikeRepository.toggleDislikeById(
      chefId,
      userId
    )
    if (toggleResult.isErr) {
      return Result.err('ERR_UNEXPECTED')
    }

    // Update cached likes count
    const likesCount =
      await this.chefUserLikeRepository.countLikesByChefId(chefId)
    if (likesCount.isErr) {
      return Result.err('ERR_UNEXPECTED')
    }
    const dislikesCount =
      await this.chefUserLikeRepository.countDislikesByChefId(chefId)
    if (dislikesCount.isErr) {
      return Result.err('ERR_UNEXPECTED')
    }
    await this.chefRepository.updateById(chefId, {
      likes: likesCount.value,
      dislikes: dislikesCount.value
    })

    return Result.ok(Unit)
  }

  public async handleRating(
    chefId: string,
    userId: string,
    rating: number
  ): Promise<Result<Unit, ChefServiceError>> {
    const findChef = await this.chefRepository.findById(chefId)
    if (findChef.isErr) {
      return Result.err('ERR_UNEXPECTED')
    }
    if (!findChef.value) {
      return Result.err('ERR_CHEF_PROFILE_NOT_FOUND')
    }

    const rateResult = await this.chefUserRatingRepository.rateById(
      chefId,
      userId,
      rating
    )
    if (rateResult.isErr) {
      return Result.err('ERR_UNEXPECTED')
    }

    // Update cached average rating
    const averageRating =
      await this.chefUserRatingRepository.getAverageRatingByChefId(chefId)
    if (averageRating.isErr) {
      return Result.err('ERR_UNEXPECTED')
    }
    await this.chefRepository.updateById(chefId, {
      rating: averageRating.value
    })

    return Result.ok(Unit)
  }
}

export default ChefServiceImpl
