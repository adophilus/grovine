import { env } from '../env'

const AuthConfig = {
  token: {
    secret: env.AUTH_TOKEN_SECRET,
    access: {
      expiry: 60 // 1 hour
    },
    refresh: {
      expiry: 60 * 24 * 30 // 30 days
    }
  }
}

export default AuthConfig
