import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('wallets')
    .addColumn('id', 'varchar', (col) => col.primaryKey().notNull())
    .addColumn('balance', 'numeric', (col) => col.notNull())
    .addColumn('user_id', 'varchar', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`NOW()`).notNull()
    )
    .addColumn('updated_at', 'timestamptz')
    .addForeignKeyConstraint('carts_user_id_fkey', ['user_id'], 'users', ['id'])
    .execute()
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('wallets').execute()
}
