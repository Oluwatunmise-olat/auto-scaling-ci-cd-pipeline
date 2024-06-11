import { appConfig } from '@app/config/app.config'
import { authRoutes } from '@app/modules/auth/auth.routes'
import { Server } from '../types/http'

export default (server: Server) => {
	const apiVersion = appConfig.version

	authRoutes(server, `api/${apiVersion}/auth`)
}
