const { gql } = require('apollo-server-express');

const typeDefs = gql`
	directive @requireAuth(
		role: Role
	) on FIELD_DEFINITION

	enum Role {
		MANAGER
		USER
	}	
	
	type Query {
		getHabit(habit_id: String!, created_at: String!): Habit!
		getHabits(user_id: String!): [Habit!]
		getAllHabits(user_id: String!): [Habit!] 
		posts: [Post] @requireAuth(role: MANAGER)
	}
	
	type Mutation {
		createHabit(user_id: String!, input: HabitInput): Habit
		deleteHabit(habit_id: String!, created_at: String!): Habit
		addHabitForUser(user_id: String!, input: HabitInput): Habit @requireAuth(role: MANAGER)
	}

	input HabitInput {
		habit_id: String!
		user_id: String!
		created_at: String!
		name: String!
		type: [String!]
	}

	type Habit {
		habit_id: String!
		user_id: String!
		created_at: String!
		name: String!
		type: [String!]
	}

	type Post {
		id: Int
		title: String
	}
`;

module.exports = typeDefs;