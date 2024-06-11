require('dotenv').config()

export const appConfig = {
	version: process.env.APP_VERSION || 'v1',
	port: process.env.PORT || '2025',
	env: process.env.NODE_ENV || 'development',
}
