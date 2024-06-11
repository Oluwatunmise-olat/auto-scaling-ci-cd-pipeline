import bodyParser from 'body-parser'
import cors from 'cors'
import 'reflect-metadata'
import restana from 'restana'
import { container, injectable } from 'tsyringe'

import routes from '@app/shared/routes/index.routes'
import bootstrapApp from './bootstrap'
import { Server } from './shared/types/http'
import { RedisSingleton } from './shared/utils/redis/redis-client.service'
import { routeNotFound, errorHandler } from './shared/utils/http'

@injectable()
class App {
	public appServer: Server

	constructor() {
		this.loadConfiguration()
		this.registerMiddlewares()
		bootstrapApp()
	}

	private loadConfiguration() {
		this.appServer = restana({ defaultRoute: routeNotFound, errorHandler } as any)
		container.resolve(RedisSingleton)
	}

	private registerMiddlewares() {
		this.appServer.use(cors({ origin: '*' }))
		this.appServer.use(bodyParser.json({ limit: '50mb' }))
		this.appServer.use(bodyParser.urlencoded({ limit: '50mb', extended: false }))

		routes(this.appServer)
	}

	public async close() {
		await this.appServer.close()
		container.resolve(RedisSingleton).disconnect()
	}

	public async listen(port: number) {
		await this.appServer.start(port)
	}
}

export default App
