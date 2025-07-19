import { run } from 'kysely-migration-cli'
import type { KyselyClient } from '@/features/database/kysely'
import { config } from '@/features/config'
import { createKyselyPgLiteClient } from '@/features/database/kysely/pglite'
import { createKyselyPgClient } from '@/features/database/kysely/pg'
import { createKyselyMigrator } from '@/features/database/kysely/migrator'

let db: KyselyClient

if (config.environment.TEST) {
  db = await createKyselyPgLiteClient()
} else {
  db = await createKyselyPgClient()
}

const migrationFolder = new URL('../migrations', import.meta.url).pathname

const migrator = createKyselyMigrator(db, migrationFolder)

run(db, migrator, migrationFolder)
