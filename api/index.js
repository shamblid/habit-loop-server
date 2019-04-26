const logger = require('pino')();
const _ = require('lodash');
const jwt = require('jsonwebtoken');

const resolvers = require('./resolvers');
const typeDefs = require('./schema');
const schemaDirectives = require('./directives');
const UserModel = require('@userModel');
const HabitModel = require('@habitModel');
const RedisModel = require('../model/Redis');
const EventModel = require('../model/Event');
const StreakModel = require('../model/Streak');

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
  context: async ({ event, context }) => ({
    logger,
    context,
    user: getAuth(event.headers),
    HabitModel: new HabitModel(),
    UserModel: new UserModel(),
    EventModel: new EventModel(),
    StreakModel: new StreakModel(),
    Redis: RedisModel(),
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
