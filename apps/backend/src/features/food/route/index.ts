import { Hono } from 'hono'
import FoodItemRouter from '../item/route'
import FoodCartRouter from '../cart/route'
import FoodOrderRouter from '../order/route'
import FoodRecipeRouter from '../recipe/route'

const FoodRouter = new Hono()
  .route('/items', FoodItemRouter)
  .route('/carts', FoodCartRouter)
  .route('/orders', FoodOrderRouter)
  .route('/recipes', FoodRecipeRouter)

export default FoodRouter
