import Redis from 'ioredis';
import { getRedisHost, getRedisPassword, getRedisPort } from './global-client';
import { get } from 'http';

const redis = new Redis({
	host: getRedisHost(),
	port: getRedisPort(),
	password: getRedisPassword(),
	tls: {},
});

export { redis };
