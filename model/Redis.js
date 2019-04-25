const Redis = require('ioredis');
const logger = require('pino')();
const moment = require('moment');

const redisConnect = () => (
    new Promise((resolve, reject) => {
        logger.info(`Attempting to connect to redis host ${process.env.REDIS_HOST}.`);
        const redisClient = new Redis({
            host: process.env.REDIS_HOST,
            port: 6379,
            connectTimeout: 2000,
        });

        redisClient.on('connect', () => resolve(redisClient));
        redisClient.on('error', (err) => reject(err));
    })
);

const RedisModel = () => {
    const getCompletedHabits = async (user_id) => {
        try {
            const client = await redisConnect();
            const completedDailyHabits = await client.lrange(`${user_id}|DAILY`, 0, -1);
            const completedWeeklyHabits = await client.lrange(`${user_id}|WEEKLY`, 0, -1);

            return [...completedDailyHabits, ...completedWeeklyHabits];
        } catch (err) {
            throw err;
        }
    };

    const completeHabit = async (user_id, habit_id, recurrence) => {
        const client = await redisConnect();

        if (recurrence === 'DAILY') {
            client.rpush(`${user_id}|DAILY`, habit_id);

            return client.expireat(`${user_id}|DAILY`, moment().endOf('day').unix());
        }
         
        if (recurrence === 'WEEKLY') {
            client.rpush(`${user_id}|WEEKLY`, habit_id);
      
            // first day of week according to iso is monday
            return client.expireat(`${user_id}|WEEKLY`, moment().endOf('isoWeek').unix());
        }

        return 0;
    };

    const completedHabitToday = async (user_id) => {
        try {
            const client = await redisConnect();
            return client.exists(`${user_id}|DAILY`);
        } catch (err) {
            logger.error(`Error checking for daily habit completion for user ${user_id} with error: ${err}.`);
            return err;
        }
    };

    return {
        getCompletedHabits,
        completeHabit,
        completedHabitToday,
    };
};

module.exports = RedisModel;
