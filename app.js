const { ApolloServer } = require("apollo-server-express");
const express = require('express'); 
const serverless = require('serverless-http');
const graphiql = require('graphql-playground-middleware-express').default;
const bodyParser = require('body-parser');
// const jwt = require('jsonwebtoken');
const app = express();
const jwt = require('express-jwt')

const { typeDefs, resolvers, schemaDirectives } = require('./api');
const auth = jwt({
  secret: 'supersecret',
  credentialsRequired: false
})
app.use(bodyParser.json(), auth);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives,
  context: async ({ req }) => ({
    user: req.user
  })
});

server.applyMiddleware({ app });


app.get("/playground", graphiql({ endpoint: "/graphql" }));

module.exports.handler = serverless(app);
