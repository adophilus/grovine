import { Hono } from 'hono'
import { CreateChefRoute } from './create'
import { GetChefRoute } from './get'
import { ListChefRoute } from './list'
import { UpdateChefRoute } from './update'

const ChefRouter = new Hono()
  .route('/', CreateChefRoute)
  .route('/', GetChefRoute)
  .route('/', ListChefRoute)
  .route('/', UpdateChefRoute)

export default ChefRouter
