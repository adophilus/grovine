import { Hono } from 'hono'
import preferencesRouter from './preferences'

const OnboardingRouter = new Hono().route('/preferences', preferencesRouter)

export default OnboardingRouter
