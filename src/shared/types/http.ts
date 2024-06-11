import restana from 'restana'

export type Server = restana.Service<restana.Protocol.HTTPS | restana.Protocol.HTTP>

export type Request = restana.Request<restana.Protocol> & {}

export type Response = restana.Response<restana.Protocol>

export type ServiceResponse<T = any> = {
	status: boolean
	message: string
	data?: T
	meta?: any
	statusCode?: number
	errorStatusCode?: number
}
