import { container } from 'tsyringe'

import { Server } from '@app/shared/types/http'
import { HealthController } from './health.controller'

const controller = container.resolve(HealthController)

export const healthRoutes = (server: Server, pathPrefix: string) => {
	server.get(`${pathPrefix}/status`, controller.performHealthCheck)
}
