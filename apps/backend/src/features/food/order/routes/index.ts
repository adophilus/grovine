import { Hono } from 'hono'
import ListOrdersRoute from './list'
import GetOrderRoute from './get'
import UpdateOrderStatusRoute from './update'

const FoodOrderRouter = new Hono()
  .route('/', ListOrdersRoute)
  .route('/', GetOrderRoute)
  .route('/', UpdateOrderStatusRoute)

export default FoodOrderRouter
