const { ApolloServer } = require('apollo-server-lambda');

const api = require('./api');
const RedisModel = require('./model/Redis');

const server = new ApolloServer(api);

exports.graphql = async (event, context, callback) => {
  const connection = await RedisModel();
  context.callbackWaitsForEmptyEventLoop = false;

  const apollo = server.createHandler({
    cors: {
      origin: '*',
      credentials: true,
    },
  });

  return apollo(event, context, callback);
};
