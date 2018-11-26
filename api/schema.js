const { gql } = require('apollo-server-express');

const typeDefs = gql`
	type Query {
		getHabit(user_id: String!, habit_id: String!): Habit!
		getUserHabits(user_id: String!): [Habit!]
	}
	
	type Mutation {
		createUserHabit(user_id: String!): Habit!
	}

	type Habit {
		habit_id: String!
		user_id: String!
		created_at: String!
		name: String!
		type: [String!]
	}
`;

module.exports = typeDefs;