import { PostgresDialect } from 'kysely'
import { defineConfig } from 'kysely-ctl'
import { IndexPrefixPlugin, TablePrefixPlugin } from 'kysely-plugin-prefix'
import pg from 'pg'
import { config } from './src/features/config'

const { Pool } = pg

const pool = new Pool({
  connectionString: config.db.url
})

export const dialect = new PostgresDialect({
  pool
})

export default defineConfig({
  dialect,
  plugins: [
    new TablePrefixPlugin({ prefix: config.db.prefix ?? '' }),
    new IndexPrefixPlugin({ prefix: config.db.prefix ?? '' })
  ]
})
