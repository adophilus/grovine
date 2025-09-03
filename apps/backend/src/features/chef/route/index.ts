import { Hono } from 'hono'
import ChefByIdRouter from './by-id'
import CreateChefRoute from './create'
import ListChefRoute from './list'
import ChefProfileRoute from './profile'

const ChefRouter = new Hono()
  .route('/', CreateChefRoute)
  .route('/', ChefProfileRoute)
  .route('/', ListChefRoute)
  .route('/:id', ChefByIdRouter)

export default ChefRouter
