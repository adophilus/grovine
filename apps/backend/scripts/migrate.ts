import { run } from 'kysely-migration-cli'
import {
  createKyselyMigrator,
  createKyselyPgClient,
  createKyselyPgLiteClient,
  type KyselyClient
} from '@/features/database/kysely'
import { config } from '@/features/config'

let db: KyselyClient

if (config.environment.TEST) {
  db = await createKyselyPgLiteClient()
} else {
  db = await createKyselyPgClient()
}

const migrationFolder = new URL('../migrations', import.meta.url).pathname

const migrator = createKyselyMigrator(db, migrationFolder)

run(db, migrator, migrationFolder)
