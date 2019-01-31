const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const serverless = require('serverless-http');
const graphiql = require('graphql-playground-middleware-express').default;
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const pino = require('express-pino-logger')();
const logger = require('pino')();
const UserModel = require('./model/User');
const HabitModel = require('./model/Habit');

const app = express();

const { typeDefs, resolvers, schemaDirectives } = require('./api');

const auth = jwt({
  secret: 'supersecret',
  credentialsRequired: false,
});

app.use(bodyParser.json(), auth, pino);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives,
  context: async ({ req }) => ({
    user: req.user,
    logger: req.log,
    HabitModel: new HabitModel(),
    UserModel: new UserModel(),
  }),
  formatResponse: (response) => {
    logger.info(response, 'deez nuts');
    return response;
  },
  formatError: (error) => {
    logger.info(error, 'deez nutsero');
    return error;
  },
});

server.applyMiddleware({ app });

app.get('/playground', graphiql({ endpoint: '/graphql' }));

module.exports.handler = serverless(app);
