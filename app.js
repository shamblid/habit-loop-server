const { ApolloServer } = require('apollo-server-lambda');

const api = require('./api');

const server = new ApolloServer(api);

const runApollo = (event, context, apollo) => new Promise((resolve, reject) => {
  const callback = (error, body) => (error ? reject(error) : resolve(body));
  apollo(event, context, callback);
});

exports.graphql = async (event, context) => {
  const apollo = server.createHandler({
    cors: {
      origin: '*',
      credentials: true,
    },
  });
  const response = await runApollo(event, context, apollo);
  return response;
};
