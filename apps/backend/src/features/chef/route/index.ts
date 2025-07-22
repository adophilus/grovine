import { Hono } from 'hono'
import CreateChefRoute from './create'
import GetChefRoute from './get'
import ListChefRoute from './list'
import ChefProfileRoute from './profile'

const ChefRouter = new Hono()
  .route('/', CreateChefRoute)
  .route('/', GetChefRoute)
  .route('/', ChefProfileRoute)
  .route('/', ListChefRoute)

export default ChefRouter
