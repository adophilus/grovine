import { KyselyPGlite } from 'kysely-pglite'
import { IndexPrefixPlugin, TablePrefixPlugin } from 'kysely-plugin-prefix'
import { config } from '@/features/config'
import { KyselyClient } from '../interface'

export const createKyselyPgLiteClient = async (): Promise<KyselyClient> => {
  const { dialect } = await KyselyPGlite.create('./storage/pglite')

  return new KyselyClient({
    dialect,
    plugins: [
      new TablePrefixPlugin({ prefix: config.db.prefix ?? '' }),
      new IndexPrefixPlugin({ prefix: config.db.prefix ?? '' })
    ]
  })
}
