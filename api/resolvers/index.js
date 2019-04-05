const { merge } = require('lodash');
const habits = require('./habits');
const users = require('./users');


const resolvers = {
  Query: {},

  Mutation: {},
};

module.exports = merge(resolvers, users, habits);
