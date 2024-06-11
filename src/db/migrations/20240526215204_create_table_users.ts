import type { Knex } from 'knex'

const __table__ = 'users'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable(__table__, (table) => {
		table.string('uuid').primary()
		table.string('email').notNullable().unique().index()
		table.string('phone').notNullable().index()
		table.string('password').notNullable()
		table.string('full_name').notNullable().index()
		table.string('profile_picture')
		table.string('status').notNullable()
		table.boolean('is_account_verified').notNullable()
		table.timestamps(true, true)
		table.timestamp('deleted_at').nullable()
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable(__table__)
}
