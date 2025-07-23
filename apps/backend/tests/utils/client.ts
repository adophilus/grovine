import { createClient, type Middleware } from '@grovine/api'
import { config } from '@/features/config'
import { app } from './bootstrap'

export const client = createClient(config.server.url)

export const bodySerializer = (body: any) => {
  const fd = new FormData()
  for (const name in body) {
    const val = body[name]
    if (Array.isArray(val)) {
      for (const value of val) fd.append(name, value)
    } else {
      fd.append(name, val)
    }
  }
  return fd
}

type Client = ReturnType<typeof createClient>

export const useAuth = (
  client: Client,
  tokens: { access_token: string; refresh_token: string }
) => {
  const middleware: Middleware = {
    async onRequest({ request }) {
      request.headers.set('Authorization', `Bearer ${tokens.access_token}`)
      return request
    }
  }

  client.use(middleware)
}

export const useApp = (client: Client) => {
  const middleware: Middleware = {
    onRequest: ({ request }) => {
      return app.request(request)
    }
  }

  client.use(middleware)
}
