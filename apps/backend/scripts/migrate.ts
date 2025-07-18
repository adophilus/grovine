import * as path from 'node:path'
import { promises as fs } from 'node:fs'
import { Migrator, FileMigrationProvider } from 'kysely'
import { run } from 'kysely-migration-cli'
import { createKyselyClient } from '@/features/database/kysely'

const db = createKyselyClient()

const migrationFolder = new URL('../migrations', import.meta.url).pathname

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder
  })
})

run(db, migrator, migrationFolder)
