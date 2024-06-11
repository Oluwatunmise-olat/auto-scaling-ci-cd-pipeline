import { StatusCodes } from 'http-status-codes'

export const errorResponse = ({ response, message, data, errors, errorCode, statusCode }: any) => {
	const code = statusCode || errorCode || StatusCodes.BAD_REQUEST

	response.send(
		{
			status: false,
			message,
			data,
			errors,
		},
		code,
	)

	response.statusCode = Number(code)
}

export const successfulResponse = ({ response, data, message, statusCode = StatusCodes.OK }) => {
	response.send(
		{
			status: true,
			message,
			data,
		},
		statusCode,
	)
}

export const genericResponse = ({
	response,
	status,
	data,
	message,
	errorCode,
	errorStatusCode = 400,
	statusCode,
}: any) => {
	const newData = data?.data

	if (data?.status !== true && status !== true) {
		return errorResponse({
			response,
			message: message || data?.message,
			data: newData,
			statusCode: data?.errorStatusCode ?? errorStatusCode,
			errorCode,
		})
	}

	return successfulResponse({ response, data: newData, message: message || data?.message, statusCode })
}

export const errorHandler = (err, req: Request, res: Response) => {
	const errorCode = err.statusCode || StatusCodes.BAD_REQUEST
	const message = err instanceof Error ? err.message : 'We are unable to process your request. Please try again'

	errorResponse({
		response: res,
		message,
		errors: err.errorCode,
		statusCode: errorCode,
	})
}

export const routeNotFound = (req, res) => {
	errorResponse({
		response: res,
		message: "Oops! We can't find the url you are looking for",
		statusCode: StatusCodes.NOT_FOUND,
	})
}
