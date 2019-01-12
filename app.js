const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const serverless = require('serverless-http');
const graphiql = require('graphql-playground-middleware-express').default;
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const pino = require('express-pino-logger')();
const logger = require('pino')();
const cors = require('cors');
const jwks = require('jwks-rsa');
// require('dotenv').config();

const app = express();


const { typeDefs, resolvers, schemaDirectives } = require('./api');

const auth = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://cbt-habit-loop.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://cbt-habit-loop/api/v1/',
  issuer: 'https://cbt-habit-loop.auth0.com/',
  algorithms: ['RS256'],
  credentialsRequired: false,
});

app.use(bodyParser.json(), auth, pino, cors());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives,
  context: async ({ req }) => ({
    user: req.user,
    logger: req.log,
  }),
  formatResponse: (response) => {
    logger.info(response);
    return response;
  },
  formatError: (error) => {
    logger.info(error);
    return error;
  },
});

server.applyMiddleware({ app });

app.get('/playground', graphiql({ endpoint: '/graphql' }));

module.exports.handler = serverless(app);
