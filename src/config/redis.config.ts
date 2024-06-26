require('dotenv').config()

export const redisConfig = {
	host: process.env.REDIS_HOST,
	port: Number(process.env.REDIS_PORT),
	username: process.env.REDIS_USERNAME || 'default',
	password: process.env.REDIS_PASSWORD,
}
