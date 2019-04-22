const logger = require('pino')();

const resolvers = require('./resolvers');
const typeDefs = require('./schema');
const schemaDirectives = require('./directives');
const UserModel = require('@userModel');
const HabitModel = require('@habitModel');
const RedisModel = require('../model/Redis');

module.exports = {
  resolvers,
  typeDefs,
  schemaDirectives,
  context: async ({ req }) => ({
    user: req.user,
    logger: req.log,
    HabitModel: new HabitModel(),
    UserModel: new UserModel(),
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
