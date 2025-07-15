import { logger as foodItemLogger } from '../logger'

export const logger = foodItemLogger.getSubLogger({
  name: 'FoodItemRepositoryLogger'
})
