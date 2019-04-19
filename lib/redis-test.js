const redis = require('redis');
const { promisify } = require('util');

const redisConfig = {
    host: process.env.REDIS_HOST,
    port: 6379,
};


class Redis {
    constructor() {
        this.client = redis.createClient(redisConfig.host, redisConfig.port);
        
        this.client.on('connect', () => console.log('ready as spaghetti'));
        this.client.on('error', (err) => console.log(`no spaghetti ${err}`));
    }

    get(key) {
        const getAsync = promisify(this.client.get).bind(this.client);
        return getAsync(key);
    }

    // https://github.com/OSU-CS493-Sp18/assignment-3-donaldjr/commit/382ce42e9988d2adc779a16c0c2412df014f248b
}


module.exports = Redis;
