const express = require('express'); 
const { ApolloServer, gql } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./api');
const PORT = process.env.PORT || 4000;

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });

app.listen(PORT, () =>
	console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);