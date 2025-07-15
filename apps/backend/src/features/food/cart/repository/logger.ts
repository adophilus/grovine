import { logger as foodCartLogger } from '../logger'

export const logger = foodCartLogger.getSubLogger({
  name: 'FoodCartRepositoryLogger'
})
