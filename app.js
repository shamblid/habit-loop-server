const { ApolloServer } = require('apollo-server-lambda');

const api = require('./api');
const RedisModel = require('./model/Redis');

const server = new ApolloServer(api);

const runApollo = (event, context, apollo) => new Promise((resolve, reject) => {
  const callback = (error, body) => (error ? reject(error) : resolve(body));
  apollo(event, context, callback);
});

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
