import { globalLogger } from '@/features/logger'

const logger = globalLogger.getSubLogger({
  name: 'PaymentLogger'
})

export default logger
