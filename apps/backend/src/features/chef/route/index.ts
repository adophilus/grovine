import { Hono } from 'hono'
import CreateChefRoute from './create'
import ListChefRoute from './list'
import ChefProfileRoute from './profile'
import ChefByIdRouter from './by-id'

const ChefRouter = new Hono()
  .route('/', CreateChefRoute)
  .route('/', ChefProfileRoute)
  .route('/', ListChefRoute)
  .route('/:id', ChefByIdRouter)

export default ChefRouter
