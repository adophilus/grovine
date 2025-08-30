import { createKyselyMigrator } from '@/features/database/kysely/migrator'
import { bootstrap, initTestCache } from './utils'
import { Container } from '@n8n/di'
import { KyselyClient } from '@/features/database/kysely'
import { Logger } from '@/features/logger'
import { NO_MIGRATIONS } from 'kysely'

await bootstrap()

const migrationFolder = new URL('../migrations', import.meta.url).pathname
const kyselyClient = Container.get(KyselyClient)
const logger = Container.get(Logger)

const kyselyMigrator = createKyselyMigrator(kyselyClient, migrationFolder)

const migrationDownResult = await kyselyMigrator.migrateTo(NO_MIGRATIONS)
if (migrationDownResult.error) {
  logger.error('Failed to run down migrations', migrationDownResult.error)
  throw migrationDownResult.error
}

const migrationUpResult = await kyselyMigrator.migrateToLatest()
if (migrationUpResult.error) {
  logger.error('Failed to run up migrations', migrationUpResult.error)
  throw migrationUpResult.error
}

await initTestCache()

console.log('✅ Setup complete')
