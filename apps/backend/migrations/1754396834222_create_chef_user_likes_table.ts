import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('chef_user_likes')
    .addColumn('id', 'varchar', (col) => col.primaryKey().notNull())
    .addColumn('chef_id', 'varchar', (col) => col.notNull())
    .addColumn('user_id', 'varchar', (col) => col.notNull())
    .addColumn('is_liked', 'boolean', (col) => col.notNull())
    .addColumn('is_disliked', 'boolean', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`NOW()`).notNull()
    )
    .addColumn('updated_at', 'timestamptz')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('chef_user_likes').execute()
}
