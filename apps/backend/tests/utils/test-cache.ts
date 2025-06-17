import { Kysely, sql, SqliteDialect } from 'kysely'
import { LibsqlDialect } from '@libsql/kysely-libsql'
import path from 'node:path'
import type { TStoreState } from './store'

const CACHE_DB_PATH = path.join(process.cwd(), '.test-cache.db')

interface TestCache {
  store: {
    data: string
  }
}

export const testCache = new Kysely<TestCache>({
  dialect: new LibsqlDialect({
    url: 'libsql://localhost:8080?tls=0'
  })
})

export const initTestCache = async () => {
  const res = await sql`PRAGMA table_info('store');`.execute(testCache)
  if (res.rows.length === 0) {
    await testCache.schema
      .createTable('store')
      .addColumn('data', 'text', (col) => col.notNull())
      .execute()
  }
}

export const getTestCache = async () => {
  const store = await testCache
    .selectFrom('store')
    .selectAll()
    .executeTakeFirst()

  if (!store) {
    return null
  }

  return JSON.parse(store.data) as TStoreState
}

export const setTestCache = async (store: TStoreState) => {
  const existingStore = await testCache
    .selectFrom('store')
    .selectAll()
    .executeTakeFirst()

  if (existingStore) {
    await testCache
      .updateTable('store')
      .set({
        data: JSON.stringify(store)
      })
      .execute()
  } else {
    await testCache
      .insertInto('store')
      .values({
        data: JSON.stringify(store)
      })
      .execute()
  }
}

export const clearTestCache = async () => {
  await testCache.schema.dropTable('store').execute()
  await initTestCache()
}
