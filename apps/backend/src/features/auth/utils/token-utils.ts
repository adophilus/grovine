import { SignJWT, jwtVerify } from 'jose'
import type { JWTPayload } from 'jose'

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || 'your-access-token-secret'
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret'

const ACCESS_TOKEN_EXPIRATION = '1y' // Access token expires in 15 minutes
const REFRESH_TOKEN_EXPIRATION = '7d' // Refresh token expires in 7 days

interface TokenPayload extends JWTPayload {
  userId: string
}

export const generateAccessToken = async (userId: string): Promise<string> => {
  const payload: TokenPayload = { userId }
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(ACCESS_TOKEN_EXPIRATION)
    .setIssuedAt()
    .setNotBefore('0s')
    .sign(new TextEncoder().encode(ACCESS_TOKEN_SECRET))
}

export const generateRefreshToken = async (userId: string): Promise<string> => {
  const payload: TokenPayload = { userId }
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(REFRESH_TOKEN_EXPIRATION)
    .setIssuedAt()
    .setNotBefore('0s')
    .sign(new TextEncoder().encode(REFRESH_TOKEN_SECRET))
}

export const verifyAccessToken = async (
  token: string
): Promise<TokenPayload | null> => {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(ACCESS_TOKEN_SECRET)
    )
    return payload as TokenPayload
  } catch (error) {
    return null
  }
}

export const verifyRefreshToken = async (
  token: string
): Promise<TokenPayload | null> => {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(REFRESH_TOKEN_SECRET)
    )
    return payload as TokenPayload
  } catch (error) {
    return null
  }
}
