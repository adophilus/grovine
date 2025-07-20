import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('vendors')
    .addColumn('user_id', 'varchar', (col) => col.primaryKey().references('users.id').onDelete('cascade'))
    .addColumn('name', 'varchar', (col) => col.notNull())
    .addColumn('niches', 'jsonb', (col) => col.notNull())
    .addColumn('profile_picture', 'varchar')
    .addColumn('rating', 'decimal(2, 1)', (col) => col.defaultTo(0.0))
    .addColumn('is_verified', 'boolean', (col) => col.defaultTo(false))
    .addColumn('is_banned', 'boolean', (col) => col.defaultTo(false))
    .addColumn('created_at', 'timestamptz', (col) => col.defaultTo(sql`NOW()`).notNull())
    .addColumn('updated_at', 'timestamptz')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('vendors').execute()
}
