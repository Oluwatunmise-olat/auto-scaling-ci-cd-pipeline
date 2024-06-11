import Joi from 'joi'

export const AccountCreationValidationRule = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required().min(7),
	full_name: Joi.string().required(),
	phone: Joi.string().required(),
})

export const LoginValidationRule = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required().min(7),
})
