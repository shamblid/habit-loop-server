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
    Redis: new Redis(6379, 'hab-se-1k2zu9rnvuwwl.p9n4qp.0001.use1.cache.amazonaws.com'),
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
