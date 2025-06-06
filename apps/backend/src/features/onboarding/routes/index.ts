import { Hono } from 'hono'
import preferencesRouter from './preferences'

export default new Hono().route('/preferences', preferencesRouter)
