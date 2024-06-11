import initializeDatabase from './db/connection'
import envInitialization from '@app/config/config'

async function bootstrap() {
	envInitialization()
	initializeDatabase()
}

export default bootstrap
