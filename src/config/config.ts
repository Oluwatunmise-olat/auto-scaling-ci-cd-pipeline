require('dotenv').config()

import { requiredEnvsOnAppBoot } from '@app/shared/constants/config'

/**
 * Configures the environment variables for the application and throws an error if
 * some required environment variables are missing.
 */
export default () => {
	const nullEnvKeys = requiredEnvsOnAppBoot.reduce((accNullEnvs, currEnv) => {
		const currEnvSet = process.env[currEnv.toUpperCase()]

		return currEnvSet ? accNullEnvs : [...accNullEnvs, currEnv]
	}, [])

	if (nullEnvKeys.length) throw new Error(`The following required variables are missing: ${nullEnvKeys}}`)
}
