import { Hono } from 'hono'
import ResendSignUpVerificationEmailRoute from './resend'
import VerifySignUpVerificationEmailRoute from './verify'

const SignUpVerificationRoute = new Hono()
  .route('/', VerifySignUpVerificationEmailRoute)
  .route('/resend', ResendSignUpVerificationEmailRoute)

export default SignUpVerificationRoute
