import { env } from '../env'

const OtelConfig = {
  api: {
    key: env.OTEL_API_KEY
  },
  service: {
    name: env.OTEL_SERVICE_NAME
  },
  endpoint: env.OTEL_ENDPOINT
}

export default OtelConfig
