import { env } from './env'
import { parseUrl } from './lib'

const urlScheme = parseUrl(env.MEDIA_SERVER_URL)

const config = {
  server: {
    url: urlScheme.serverUrl,
    port: urlScheme.port
  }
}

export default config
