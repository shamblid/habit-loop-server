const { ApolloServer } = require('apollo-server-lambda');

const api = require('./api');

const server = new ApolloServer(api);

exports.graphql = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
});
