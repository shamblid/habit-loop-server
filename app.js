const express = require('express'); 
const serverless = require('serverless-http');
const { ApolloServer, gql } = require('apollo-server-express');
const graphiql = require('graphql-playground-middleware-express').default;

const { typeDefs, resolvers } = require('./api');
const PORT = process.env.PORT || 4000;

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });

app.get("/playground", graphiql({ endpoint: "/graphql" }));

module.exports.handler = serverless(app);