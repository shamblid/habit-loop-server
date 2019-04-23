const Redis = require('ioredis');
const logger = require('pino')();

const config = require(`../config/${process.env.NODE_ENV}.json`);

const connectRedis = () => {
    try {
        const redis = new Redis({
            host: process.env.REDIS_HOST,
            port: 6379,
            connectTimeout: 1000,
        });

        redis.on('error', err => {
            logger.error(`Error connecting to redis instance: ${process.env.REDIS_HOST} with error: ${err}`);
            redis.disconnect();
        });

        return redis;
    } catch (err) {
        logger.error('Error connecting to redis client');
        return null;
    }
};

module.exports = connectRedis;
