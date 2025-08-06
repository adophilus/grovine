import { createKyselyMigrator } from '@/features/database/kysely/migrator'
import { bootstrap, initTestCache } from './utils'
import { Container } from '@n8n/di'
import { KyselyClient } from '@/features/database/kysely'
import { Logger } from '@/features/logger'

await bootstrap()

const migrationFolder = new URL('../migrations', import.meta.url).pathname
const kyselyClient = Container.get(KyselyClient)
const logger = Container.get(Logger)

const kyselyMigrator = createKyselyMigrator(kyselyClient, migrationFolder)

const migrationResult = await kyselyMigrator.migrateToLatest()
if (migrationResult.error) {
  logger.error('Failed to run migrations', migrationResult.error)
  throw migrationResult.error
}

await initTestCache()

console.log('✅ Setup complete')
