import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('recipe_user_likes')
    .addColumn('id', 'varchar', (col) => col.primaryKey().notNull())
    .addColumn('recipe_id', 'varchar', (col) => col.notNull())
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
  await db.schema.dropTable('recipe_user_likes').execute()
}
