const logger = require('pino')();
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const { RedisCache } = require('apollo-server-cache-redis');

const resolvers = require('./resolvers');
const typeDefs = require('./schema');
const schemaDirectives = require('./directives');
const UserModel = require('@userModel');
const HabitModel = require('@habitModel');
const StreakModel = require('../model/Streak');
const RedisModel = require('../model/Redis');
const GroupModel = require('../model/Group');

const getAuth = headers => {
  const token = _.get(headers, 'Authorization', null);
  if (_.isEmpty(token)) {
    return null;
  }

  try {
    const id = token.replace('Bearer ', '');
    const user = jwt.verify(id, 'supersecret');
    return user;
  } catch (err) {
    throw new Error({ message: 'You are not authorized for this resource.' });
  }
};

module.exports = {
  resolvers,
  typeDefs,
  schemaDirectives,
  context: async ({ event, context }) => {
    return {
      logger,
      context,
      user: getAuth(event.headers),
      UserModel: new UserModel(),
      StreakModel: new StreakModel(),
      HabitModel: new HabitModel(),
      GroupModel: new GroupModel(),
      Redis: RedisModel,
    };
  },
  // cache: new RedisCache({
  //   connectTimeout: 5000,
  //   reconnectOnError: function (err) {
  //     console.log('Reconnect on error', err)
  //     var targetError = 'READONLY'
  //     if (err.message.slice(0, targetError.length) === targetError) {
  //       // Only reconnect when the error starts with "READONLY"
  //       return true
  //     }
  //   },
  //   retryStrategy: function (times) {
  //     console.log('Redis Retry', times)
  //     if (times >= 3) {
  //       return undefined
  //     }
  //     var delay = Math.min(times * 50, 2000)
  //     return delay
  //   },
  //   socket_keepalive: false,
  //   host: 
  //     process.env.IS_OFFLINE==='true' 
  //     ?
  //     '127.0.0.1'
  //     :
  //     process.env.REDIS_HOST,
  //   port: 
  //     process.env.IS_OFFLINE==='true' 
  //     ?                     
  //     6379
  //     :                        
  //     parseInt(process.env.REDIS_PORT),
  //   password: 
  //     process.env.IS_OFFLINE==='true' ?                    
  //     ''
  //     :
  //     process.env.REDIS_PASSWORD,
  // }),
  formatResponse: (response) => {
    logger.info(response);
    return response;
  },
  formatError: (error) => {
    logger.info(error);
    return error;
  },
};
