import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('adverts')
    .addColumn('title', 'varchar')
    .addColumn('description', 'text')
    .addColumn('target_url', 'varchar')
    .addColumn('is_active', 'boolean', (col) => col.defaultTo(true).notNull())
    .addColumn('priority', 'integer', (col) => col.defaultTo(0).notNull())
    .addColumn('deleted_at', 'timestamptz')
    .execute()

  // Add indexes for better query performance
  await db.schema
    .createIndex('adverts_expires_at_idx')
    .on('adverts')
    .column('expires_at')
    .execute()

  await db.schema
    .createIndex('adverts_created_at_idx')
    .on('adverts')
    .column('created_at')
    .execute()

  await db.schema
    .createIndex('adverts_is_active_idx')
    .on('adverts')
    .column('is_active')
    .execute()

  await db.schema
    .createIndex('adverts_priority_idx')
    .on('adverts')
    .column('priority')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop indexes first
  await db.schema.dropIndex('adverts_priority_idx').execute()
  await db.schema.dropIndex('adverts_is_active_idx').execute()
  await db.schema.dropIndex('adverts_created_at_idx').execute()
  await db.schema.dropIndex('adverts_expires_at_idx').execute()

  // Drop columns
  await db.schema
    .alterTable('adverts')
    .dropColumn('deleted_at')
    .dropColumn('priority')
    .dropColumn('is_active')
    .dropColumn('target_url')
    .dropColumn('description')
    .dropColumn('title')
    .execute()
}
