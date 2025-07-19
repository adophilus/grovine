import { config } from '@/features/config'
import { TablePrefixPlugin, IndexPrefixPlugin } from 'kysely-plugin-prefix'
import { PostgresDialect } from 'kysely'

import pg from 'pg'
import { KyselyClient } from '../interface'

const { Pool } = pg

export const createKyselyPgClient = async (): Promise<KyselyClient> => {
  const pool = new Pool({
    connectionString: config.db.url
  })

  const dialect = new PostgresDialect({
    pool
  })

  return new KyselyClient({
    dialect,
    plugins: [
      new TablePrefixPlugin({ prefix: config.db.prefix ?? '' }),
      new IndexPrefixPlugin({ prefix: config.db.prefix ?? '' })
    ]
  })
}
