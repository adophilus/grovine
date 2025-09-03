import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('transactions')
    .addColumn('id', 'varchar', (col) => col.primaryKey().notNull())
    .addColumn('type', 'varchar', (col) => col.notNull())
    .addColumn('amount', 'numeric', (col) => col.notNull())
    .addColumn('purpose', 'varchar', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`NOW()`).notNull()
    )
    .addColumn('updated_at', 'timestamptz')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('transactions').execute()
}
