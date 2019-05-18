const logger = require('pino')();
const _ = require('lodash');
const jwt = require('jsonwebtoken');

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

const getRedisModel = async () => {
  const connection = await RedisModel.getConnection();
  RedisModel.setConnection(connection);
  return RedisModel.streak;
};

module.exports = {
  resolvers,
  typeDefs,
  schemaDirectives,
  context: async ({ event, context }) => ({
    logger,
    context,
    user: getAuth(event.headers),
    UserModel: new UserModel(),
    StreakModel: new StreakModel(),
    HabitModel: new HabitModel(),
    GroupModel: new GroupModel(),
    Redis: getRedisModel,
  }),
  formatResponse: (response) => {
    logger.info(response);
    return response;
  },
  formatError: (error) => {
    logger.info(error);
    return error;
  },
};
