import { logger as foodOrderLogger } from '../logger'

export const logger = foodOrderLogger.getSubLogger({
  name: 'FoodOrderRepositoryLogger'
})
