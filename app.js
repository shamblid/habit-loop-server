const { ApolloServer } = require("apollo-server-express");
const express = require('express'); 
const serverless = require('serverless-http');
const graphiql = require('graphql-playground-middleware-express').default;

const app = express();
const { typeDefs, resolvers, schemaDirectives } = require('./api');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives,
  // test user
  context: ({ req }) => ({
    req: Object.assign({}, req, {
      user: {
        id: 1,
        email: "bill.adama@battlestargalactica.space",
        role: ["USER"]
      }
    })
  })
});

server.applyMiddleware({ app });

app.get("/playground", graphiql({ endpoint: "/graphql" }));

module.exports.handler = serverless(app);
