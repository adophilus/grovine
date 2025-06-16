import { Kysely, sql, SqliteDialect } from 'kysely'
import { LibsqlDialect } from '@libsql/kysely-libsql'
import path from 'node:path'
import { logger } from './logger'
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
  try {
    const res = await sql`PRAGMA table_info('store');`.execute(testCache)
    if (res.rows.length === 0) {
      await testCache.schema
        .createTable('store')
        .addColumn('data', 'text', (col) => col.notNull())
        .execute()
      logger.debug('Test cache database initialized')
    } else {
      logger.debug('Test cache database already initialized')
    }
  } catch (error) {
    logger.error('Failed to initialize test cache database:', error)
  }
}

export const getStore = async () => {
  try {
    const store = await testCache
      .selectFrom('store')
      .selectAll()
      .executeTakeFirst()

    if (!store) {
      return null
    }

    return JSON.parse(store.data) as TStoreState
  } catch (error) {
    logger.error('Failed to get store from test cache:', error)
    return null
  }
}

export const setStore = async (store: TStoreState) => {
  try {
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

    logger.debug('Store persisted to test cache', store)
  } catch (error) {
    logger.error('Failed to persist store to test cache:', error)
  }
}

export const clearTestCache = async () => {
  try {
    await testCache.schema.dropTable('store').execute()
    await initTestCache()
    logger.debug('Test cache cleared')
  } catch (error) {
    logger.error('Failed to clear test cache:', error)
  }
}
