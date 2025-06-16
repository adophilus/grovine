import { createClient } from '@grovine/api'
import { config } from '@/index'

export const client = createClient(config.server.url)

export const bodySerializer = (body: any) => {
  const fd = new FormData()
  for (const name in body) {
    fd.append(name, body[name])
  }
  return fd
}
