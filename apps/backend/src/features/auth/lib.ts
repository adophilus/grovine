import { createClient } from '@beta-lyfe/api'
import { config } from '../config'

export const client = createClient(config.auth.serverUrl)
