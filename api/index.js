const logger = require('pino')();
const Redis = require('ioredis');

const resolvers = require('./resolvers');
const typeDefs = require('./schema');
const schemaDirectives = require('./directives');
const UserModel = require('@userModel');
const HabitModel = require('@habitModel');

module.exports = {
  resolvers,
  typeDefs,
  schemaDirectives,
  context: async ({ req }) => ({
    user: req.user,
    logger: req.log,
    HabitModel: new HabitModel(),
    UserModel: new UserModel(),
    Redis: new Redis(6379, process.env.REDIS_HOST),
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
