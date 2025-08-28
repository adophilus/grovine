import { Hono } from 'hono'
import CreateFoodRecipeRoute from './create'
import ListFoodRecipeRoute from './list'
import GetFoodRecipeRoute from './get'
import UpdateFoodRecipeRoute from './update'
import DeleteFoodRecipeRoute from './delete'
import LikeRecipeByIdRoute from './by-id/like'
import DislikeRecipeByIdRoute from './by-id/dislike'
import RateRecipeByIdRoute from './by-id/rate'

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
