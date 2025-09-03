import { Hono } from 'hono'
import GetOrderRoute from './get'
import ListOrdersRoute from './list'
import UpdateOrderStatusRoute from './update'

const FoodOrderRouter = new Hono()
  .route('/', ListOrdersRoute)
  .route('/', GetOrderRoute)
  .route('/', UpdateOrderStatusRoute)

export default FoodOrderRouter
