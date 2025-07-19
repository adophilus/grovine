import { Hono } from 'hono'
import FoodItemRouter from '../item/route'
import FoodCartRouter from '../cart/route'
import FoodOrderRouter from '../order/routes'

const FoodRouter = new Hono()
  .route('/items', FoodItemRouter)
  .route('/carts', FoodCartRouter)
  .route('/orders', FoodOrderRouter)

export default FoodRouter
