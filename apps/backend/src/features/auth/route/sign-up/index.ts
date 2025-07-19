import { Hono } from 'hono'
import SendSignUpVerificationEmailRoute from './send-verification-mail'
import SignUpVerificationRoute from './verification'

const SignUpRoute = new Hono()
  .route('/', SendSignUpVerificationEmailRoute)
  .route('/verification', SignUpVerificationRoute)

export default SignUpRoute
