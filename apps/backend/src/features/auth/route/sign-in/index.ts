import { Hono } from 'hono'
import SendSignInVerificationEmailRoute from './send-verification-mail'
import SignInVerificationRoute from './verification'

const SignInRoute = new Hono()
  .route('/', SendSignInVerificationEmailRoute)
  .route('/verification', SignInVerificationRoute)

export default SignInRoute
