const { 
  ApolloServer, 
  gql,
  SchemaDirectiveVisitor,
  AuthenticationError } = require("apollo-server-express");
const express = require('express'); 

const mockPosts = [
  {
    id: 1,
    title:
      "Helvetica and Times New Roman walk into a bar. Get out of here! shouts the bartender. We don't serve your type!",
    ownerId: 1
  },
  {
    id: 2,
    title:
      "Why do we tell actors to break a leg? Because every play has a cast.",
    ownerId: 2
  },
  {
    id: 3,
    title:
      "Did you hear about the mathematician who’s afraid of negative numbers? He'll stop at nothing to avoid them.",
    ownerId: 1
  }
];

const resolvers = {
  Query: {
    posts: () => mockPosts
  }
};

const requireAuthDirective = class RequireAuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    const { role } = this.args;
    field.resolve = async function(...args) {
      const [, , ctx] = args;
      if (ctx.req && ctx.req.user) {
        if (role && (!ctx.req.user.role || !ctx.req.user.role.includes(role))) {
          throw new AuthenticationError(
            "You are not authorized to view this resource."
          );
        } else {
          const result = await resolve.apply(this, args);
          return result;
        }
      } else {
        throw new AuthenticationError(
          "You must be signed in to view this resource."
        );
      }
    };
  }
}
const app = express();
const typeDefs = gql`
  enum Role {
    ADMIN
    USER
  }
  type Query {
    _empty: String
    posts: [Post] @requireAuth
  }
  type Mutation {
    _empty: String
  }

  type Post {
    id: Int
    title: String
  }
  `;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: {
    requireAuth: requireAuthDirective
  }
});
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);