import type { Knex } from 'knex'

import { databaseConfig as db } from './src/config/db.config'

const knexConfig = {
	client: db.driver_client,
	connection: {
		...db.auth,
		charset: 'utf8mb4',
		typeCast: function (field: any, next: any) {
			if (field.type === 'TINY' && field.length === 1) {
				const value = field.string()

				return value ? value === '1' : null
			}

			return next()
		},
	},
	pool: db.pool,
	debug: false,
	migrations: db.migration,
} as Knex.Config

export default knexConfig
