import { Hono } from 'hono'
import VerifySignInVerificationEmailRoute from './verify'
import ResendSignInVerificationEmailRoute from './resend'

const SignInVerificationRoute = new Hono()
  .route('/', VerifySignInVerificationEmailRoute)
  .route('/resend', ResendSignInVerificationEmailRoute)

export default SignInVerificationRoute
