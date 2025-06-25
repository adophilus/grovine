import { Hono } from 'hono'
import webhookRouter from './webhook'

export default new Hono().route('/webhook', webhookRouter)
