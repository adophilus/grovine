import { Hono } from 'hono'
import create from './create'
import get from './get'
import list from './list'
import update from './update'
import del from './delete'

export default new Hono()
  .route('/items', create)
  .route('/items', list)
  .route('/items', get)
  .route('/items', update)
  .route('/items', del)
