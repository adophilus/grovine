import { Hono } from 'hono'
import ResendSignInVerificationEmailRoute from './resend'
import VerifySignInVerificationEmailRoute from './verify'

const SignInVerificationRoute = new Hono()
  .route('/', VerifySignInVerificationEmailRoute)
  .route('/resend', ResendSignInVerificationEmailRoute)

export default SignInVerificationRoute
