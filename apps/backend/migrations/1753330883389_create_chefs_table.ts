import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('chefs')
    .addColumn('id', 'varchar', (col) => col.primaryKey().notNull())
    .addColumn('name', 'varchar', (col) => col.notNull())
    .addColumn('niches', 'jsonb', (col) => col.notNull())
    .addColumn('profile_picture', 'jsonb')
    .addColumn('rating', 'numeric', (col) => col.notNull())
    .addColumn('is_verified', 'boolean', (col) => col.notNull())
    .addColumn('is_banned', 'boolean', (col) => col.notNull())
    .addColumn('user_id', 'varchar', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`NOW()`).notNull()
    )
    .addColumn('updated_at', 'timestamptz')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('chefs').execute()
}
