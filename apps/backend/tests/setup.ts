import { faker } from '@faker-js/faker'
import { Store } from '@tanstack/store'
import { config } from '@/index'
import { createClient } from '@grovine/api'

export type TStore = {
  user: {
    email: string
  }
}

export const store = new Store<TStore>({
  user: {
    email: faker.internet.email()
  }
})

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const client = createClient(config.server.url)
