import { Hono } from 'hono'
import { CreateVendorRoute } from './create'
import { GetVendorRoute } from './get'
import { ListVendorRoute } from './list'
import { UpdateVendorRoute } from './update'

const VendorRouter = new Hono()
  .route('/', CreateVendorRoute)
  .route('/', GetVendorRoute)
  .route('/', ListVendorRoute)
  .route('/', UpdateVendorRoute)

export default VendorRouter
