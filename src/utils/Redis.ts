import IORedis, { type RedisOptions } from 'ioredis';

import { cLogger } from '$server/console';

// import { fLogger } from '$server/file';
import { OI_REDIS_DB_HOST, OI_REDIS_DB_PASSWORD, OI_REDIS_DB_PORT } from '&server/env';

const options: RedisOptions = {
	host: OI_REDIS_DB_HOST,
	port: OI_REDIS_DB_PORT,
	password: OI_REDIS_DB_PASSWORD,
	maxRetriesPerRequest: null,
};
const startTime = Date.now();
const redisConnection = new IORedis(options);

redisConnection.on('connect', () => {
	const endTime = Date.now();
	const duration = endTime - startTime;
	cLogger.info(`🗄️  Redis connected - connection established in ${duration}ms`);
});

redisConnection.on('error', error => {
	cLogger.error(`🗄️  Redis error ${error}`);
	// fLogger.error(`🗄️  Redis error ${error}`);
});

export default redisConnection;
