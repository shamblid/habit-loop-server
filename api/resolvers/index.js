const { merge } = require('lodash');
const habits = require('./habits');
const users = require('./users');

const mockPosts = [
  { id: 1, title: "Helvetica and Times New Roman walk into a bar. Get out of here! shouts the bartender. We don't serve your type!", ownerId: 1 },
  { id: 2, title: 'Why do we tell actors to break a leg? Because every play has a cast.', ownerId: 2 },
  { id: 3, title: "Did you hear about the mathematician who’s afraid of negative numbers? He'll stop at nothing to avoid them.", ownerId: 1 },
];

const resolvers = {
  Query: {
    posts: () => mockPosts, // test query
  },

  Mutation: {},
};

module.exports = merge(resolvers, users, habits);
