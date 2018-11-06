const express = require('express'); 
const { ApolloServer, gql } = require('apollo-server-express');
const typeDefs = require('./api/schema');
const resolvers = require('./api/resolvers');
const PORT = 4000 || process.env.PORT;
const app = express();
const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });

app.listen(PORT, () =>
	console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);