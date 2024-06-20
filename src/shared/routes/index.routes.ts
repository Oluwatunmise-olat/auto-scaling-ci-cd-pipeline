import { appConfig } from '@app/config/app.config'
import { authRoutes } from '@app/modules/auth/auth.routes'
import { Server } from '../types/http'
import { healthRoutes } from '@app/modules/health/health.routes'

export default (server: Server) => {
	const apiVersion = appConfig.version

	authRoutes(server, `api/${apiVersion}/auth`)
	healthRoutes(server, `api/health`)
}
