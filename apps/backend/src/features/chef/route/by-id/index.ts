import { Hono } from 'hono'
import DislikeChefProfileByIdRoute from './dislike'
import GetChefProfileByIdRoute from './get'
import LikeChefProfileByIdRoute from './like'
import RateChefProfileByIdRoute from './rate'

const ChefByIdRouter = new Hono()
  .route('/', GetChefProfileByIdRoute)
  .route('/like', LikeChefProfileByIdRoute)
  .route('/dislike', DislikeChefProfileByIdRoute)
  .route('/rate', RateChefProfileByIdRoute)

export default ChefByIdRouter
