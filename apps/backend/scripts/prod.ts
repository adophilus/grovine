import { handle } from 'hono/vercel'
import { bootstrap } from '@grovine/backend'

const { app } = bootstrap()

const handler = handle(app.create())

export const GET = handler
export const POST = handler
export const PUT = handler
export const OPTIONS = handler
export const PATCH = handler
export const DELETE = handler
