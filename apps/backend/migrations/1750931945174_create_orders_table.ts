import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('orders')
    .addColumn('id', 'varchar', (col) => col.primaryKey().notNull())
    .addColumn('status', 'varchar', (col) => col.notNull())
    .addColumn('payment_method', 'varchar', (col) => col.notNull())
    .addColumn('payment_url', 'varchar')
    .addColumn('price', 'numeric', (col) => col.notNull())
    .addColumn('user_id', 'varchar', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`NOW()`).notNull()
    )
    .addColumn('updated_at', 'timestamptz')
    .execute()
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('orders').execute()
}
