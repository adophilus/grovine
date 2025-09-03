import { Hono } from 'hono'
import DislikeRecipeByIdRoute from './by-id/dislike'
import LikeRecipeByIdRoute from './by-id/like'
import RateRecipeByIdRoute from './by-id/rate'
import CreateFoodRecipeRoute from './create'
import DeleteFoodRecipeRoute from './delete'
import GetFoodRecipeRoute from './get'
import ListFoodRecipeRoute from './list'
import UpdateFoodRecipeRoute from './update'

const FoodRecipeRouter = new Hono()
  .route('/', CreateFoodRecipeRoute)
  .route('/', ListFoodRecipeRoute)
  .route('/', GetFoodRecipeRoute)
  .route('/', UpdateFoodRecipeRoute)
  .route('/', DeleteFoodRecipeRoute)
  .route('/:id/like', LikeRecipeByIdRoute)
  .route('/:id/dislike', DislikeRecipeByIdRoute)
  .route('/:id/rate', RateRecipeByIdRoute)

export default FoodRecipeRouter
