const logger = require('pino')();
const resolvers = require('./resolvers');
const typeDefs = require('./schema');
const schemaDirectives = require('./directives');
const UserModel = require('../model/User');
const HabitModel = require('../model/Habit');

module.exports = {
  resolvers,
  typeDefs,
  schemaDirectives,
  context: async ({ req }) => ({
    user: req.user,
    logger: req.log,
    HabitModel: new HabitModel(),
    UserModel: new UserModel(),
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
