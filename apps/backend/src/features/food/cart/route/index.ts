import { Hono } from 'hono'
import CheckoutCartRoute from './checkout'
import GetCartRoute from './get'
import CartSetItemRoute from './set-item'

const FoodCartRouter = new Hono()
  .route('/', CartSetItemRoute)
  .route('/', GetCartRoute)
  .route('/checkout', CheckoutCartRoute)

export default FoodCartRouter
