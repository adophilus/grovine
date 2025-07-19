import { Hono } from 'hono'
import CreateFoodItemRoute from './create'
import ListFoodItemsRoute from './list'
import UpdateFoodItemRoute from './update'
import DeleteFoodItemRoute from './delete'
import GetFoodItemRoute from './get'

const FoodItemRouter = new Hono()
  .route('/', CreateFoodItemRoute)
  .route('/', ListFoodItemsRoute)
  .route('/', GetFoodItemRoute)
  .route('/', UpdateFoodItemRoute)
  .route('/', DeleteFoodItemRoute)

export default FoodItemRouter
