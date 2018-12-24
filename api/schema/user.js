const { gql } = require('apollo-server-express');

const userDefs = gql`
	
	extend type Query {
		getUser(habit_id: String!, created_at: String!): Habit!
	}
	
	extend type Mutation {
		createUser(user_id: String!, input: HabitInput): Habit
		deleteUser(habit_id: String!, created_at: String!): Habit
	}

	input UserInput {
		habit_id: String!
		user_id: String!
		created_at: String!
		name: String!
		type: [String!]
	}

	type User {
		id: String!
		first: String!
        last: String!
        created_at: String!
        role: [String!]
    }
`;

module.exports = userDefs;