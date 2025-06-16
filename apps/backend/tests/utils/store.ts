import { faker } from '@faker-js/faker'
import { Store } from '@tanstack/store'
import { z } from 'zod'
import fs from 'node:fs'
import path from 'node:path'

const storeSchema = z.object({
  user: z.object({
    email: z.string()
  })
})

export type TStore = z.infer<typeof storeSchema>

const CACHE_FILE = path.join(process.cwd(), '.test-cache.json')

const persistStore = (store: TStore) => {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(store, null, 2))
  } catch (error) {
    console.error('Failed to persist store:', error)
  }
}

const initStore = (): TStore => {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const cachedData = fs.readFileSync(CACHE_FILE, 'utf-8')
      return storeSchema.parse(JSON.parse(cachedData))
    }
  } catch (error) {
    console.error('Failed to read cache file:', error)
  }

  const store = {
    user: {
      email: faker.internet.email()
    }
  }

  persistStore(store)
  return store
}

export const store = new Store<TStore>(initStore())

store.subscribe((state) => {
  persistStore(state.currentVal)
})
