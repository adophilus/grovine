import { Hono } from 'hono'
import CreateFoodRecipeRoute from './create'
import ListFoodRecipeRoute from './list'
import GetFoodRecipeRoute from './get'
import UpdateFoodRecipeRoute from './update'
import DeleteFoodRecipeRoute from './delete'

const FoodRecipeRouter = new Hono()
  .route('/', CreateFoodRecipeRoute)
  .route('/', ListFoodRecipeRoute)
  .route('/', GetFoodRecipeRoute)
  .route('/', UpdateFoodRecipeRoute)
  .route('/', DeleteFoodRecipeRoute)

export default FoodRecipeRouter
