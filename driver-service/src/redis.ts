import Redis from 'ioredis';
export const redis = new Redis(process.env.REDIS_URL ?? 'redis://redis:6379');

redis.on('connect', () => console.log('✅  Driver-service conectado ao Redis'));
redis.on('error', err => console.error('Redis error:', err));