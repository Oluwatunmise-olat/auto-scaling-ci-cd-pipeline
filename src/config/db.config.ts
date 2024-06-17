require('dotenv').config()

export const databaseConfig = {
	driver_client: 'mysql2',
	auth: {
		host: process.env.MYSQL_DB_HOST,
		database: process.env.MYSQL_DB_NAME as string,
		user: process.env.MYSQL_USER as string,
		password: process.env.MYSQL_PASSWORD as string,
		port: Number(process.env.MYSQL_DB_PORT) as number,
	},
	pool: {
		min: parseInt(process.env.DB_POOL_MIN as string) || 2,
		max: parseInt(process.env.DB_POOL_MAX as string) || 10,
	},
	migration: {
		tableName: 'knex_migrations',
		directory: './src/db/migrations',
		extension: 'ts',
	},
}
