import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  clientPrefix: '',
  client: {},
  server: {
    NODE_ENV: z.enum(['production', 'staging', 'development', 'test']),
    PORT: z.coerce.number().min(0).max(65535),
    DATABASE_URL: z.string().url(),
    DATABASE_PREFIX: z.string().optional(),
    MEDIA_SERVER_URL: z.string().url(),
    MAIL_URL: z.string().url(),
    MAIL_SENDER_NAME: z.string(),
    MAIL_SENDER_EMAIL: z.string().email(),
    MAIL_SUPPORT_NAME: z.string(),
    MAIL_SUPPORT_EMAIL: z.string().email(),
    BACKEND_URL: z.string(),
    AUTH_TOKEN_SECRET: z.string().min(32),
    PAYSTACK_SECRET_KEY: z.string(),
    OTEL_API_KEY: z.string(),
    OTEL_ENDPOINT: z.string().url(),
    OTEL_SERVICE_NAME: z.string()
  },
  runtimeEnv: process.env
})
