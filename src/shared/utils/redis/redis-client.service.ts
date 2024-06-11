import type { RedisClientType } from 'redis'
import * as redis from 'redis'
import { singleton } from 'tsyringe'

import { redisConfig } from '@app/config/redis.config'
// import { logger } from '@app/shared/utils/logger/pino'

@singleton()
export class RedisSingleton {
	private instance: RedisClientType

	constructor() {
		this.instance = redis.createClient({
			socket: { host: redisConfig.host, port: Number(redisConfig.port) },
			password: redisConfig.password ?? '',
		})

		this.instance.connect()

		this.instance.on('connect', () => {
			// logger.info('🐳 Redis connected!')
		})

		this.instance.on('error', (err) => {
			// logger.error(err, 'An error occurred connecting with Redis client')
		})
	}

	getInstance(): RedisClientType {
		if (!this.instance) {
			new RedisSingleton()
		}

		return this.instance
	}

	disconnect() {
		if (this.instance) {
			this.instance.quit()
		}
	}
}
