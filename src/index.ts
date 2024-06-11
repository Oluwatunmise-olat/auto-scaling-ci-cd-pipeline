import App from './app'
import { appConfig } from './config/app.config'

export const application = new App()

process
	.on('uncaughtException', (error) => {
		// logger.error({ err: error }, 'UNCAUGHT_EXCEPTION')
		console.error({ err: error }, 'UNCAUGHT_EXCEPTION')
		application.close()
		process.exit(1)
	})
	.on('SIGINT', () => {
		application.close()
		process.exit(1)
	})

application
	.listen(Number.parseInt(appConfig.port))
	.then(() => {
		// logger.info('🚀 Server is listening on port %o in %s mode', server.port, getEnv.env)
		console.info('🚀 Server is listening on port %o in %s mode', appConfig.port, appConfig.env)
	})
	.catch((error) => {
		// logger.error({ err: error }, 'SERVER_ERROR: An error occurred while trying to start server')
		process.exit(1)
	})
