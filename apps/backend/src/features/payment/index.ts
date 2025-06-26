import { default as service } from './service'
export { default as PaymentService } from './service'
export { default as paymentRouter } from './routes'
import * as utils from './utils'

const Payment = {
  service,
  utils
}

export default Payment
