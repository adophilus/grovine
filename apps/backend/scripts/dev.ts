import { createServer } from 'node:https'
import { serve } from '@hono/node-server'
import { config } from '@grovine/backend'
import { app, appLogger as logger } from '@grovine/backend'
import { readFileSync } from 'node:fs'

serve(
  {
    fetch: app.fetch,
    port: config.server.port
    // createServer,
    // serverOptions: {
    //   key: readFileSync('.secrets/key.pem'),
    //   cert: readFileSync('.secrets/cert.pem')
    // }
  },
  (info) => {
    logger.info(`Server is running on https://${info.address}:${info.port}`)
  }
)
