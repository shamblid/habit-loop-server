const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const serverless = require('serverless-http');
const graphiql = require('graphql-playground-middleware-express').default;
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const pino = require('express-pino-logger')();
const api = require('./api');

const app = express();
const auth = jwt({
  secret: 'supersecret',
  credentialsRequired: false,
});

app.use(bodyParser.json(), auth, pino);

const server = new ApolloServer(api);

server.applyMiddleware({ app });

app.get('/playground', graphiql({ endpoint: '/graphql' }));

module.exports.handler = serverless(app);
