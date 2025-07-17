import { Hono } from 'hono'
import create from './create'
import get from './get'
import list from './list'
import update from './update'
import del from './delete'

export default new Hono()
  .route('/', create)
  .route('/', list)
  .route('/', get)
  .route('/', update)
  .route('/', del)
