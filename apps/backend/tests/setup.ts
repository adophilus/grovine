import { createClient } from '@grovine/api'
import { config } from '@/index'
export { store } from './utils/store'

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const client = createClient(config.server.url)
