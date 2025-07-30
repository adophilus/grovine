import type { Kysely } from 'kysely'

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('users')
    .addColumn('role', 'varchar', (col) => col.notNull().defaultTo('USER'))
    .execute()

  await db.schema
    .alterTable('users')
    .alterColumn('role', (col) => col.dropDefault())
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('users').dropColumn('role').execute()
}
