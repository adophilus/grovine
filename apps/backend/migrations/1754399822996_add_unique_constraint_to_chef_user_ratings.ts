import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('chef_user_ratings')
    .addUniqueConstraint('chef_id_user_id_unique', ['chef_id', 'user_id'])
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('chef_user_ratings')
    .dropConstraint('chef_id_user_id_unique')
    .execute()
}
