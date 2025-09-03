import { Hono } from 'hono'
import { CreateAdvertRoute } from './create'
import { DeleteAdvertRoute } from './delete'
import { ListAdvertRoute } from './list'
import { UpdateAdvertRoute } from './update'

const AdvertRouter = new Hono()
  .route('/', CreateAdvertRoute)
  .route('/', ListAdvertRoute)
  .route('/', UpdateAdvertRoute)
  .route('/', DeleteAdvertRoute)

export default AdvertRouter
