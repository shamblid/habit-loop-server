const { gql } = require('apollo-server-express');

const habitDefs = gql`

	extend type Query {
		getHabit(habit_id: String!, created_at: String!): Habit!
		getHabits(user_id: String!): [Habit!]
		getAllHabits(user_id: String!): [Habit!] 
	}
	
	extend type Mutation {
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
		name: String!
        type: [String!]
        priority: Int
        created_at: String!
	}
`;

module.exports = habitDefs;