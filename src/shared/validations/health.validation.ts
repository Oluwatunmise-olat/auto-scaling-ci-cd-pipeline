import Joi from 'joi'

export const HealthValidationRule = Joi.object({
	action: Joi.string().required(),
})
