import { Hono } from 'hono'
import createRouter from './create'

export default new Hono().route('/', createRouter)
