const { gql } = require('apollo-server-express');

const habitDefs = gql`

	extend type Query {
		getHabit(habit_id: String!, created_at: String!): Habit
		getHabits: [Habit] @requireAuth(role: USER)
		getAllHabits(user_id: String!): [Habit] @requireAuth(role: ADMIN)
	}
	
	extend type Mutation {
		createHabit(input: HabitInput): Habit @requireAuth(role: USER)
		deleteHabit(habit_id: String!, created_at: String!): Habit
		addHabitForUser(user_id: String!, input: HabitInput): Habit @requireAuth(role: MANAGER)
	}

	input HabitInput {
		name: String!
		type: [String!]
	}

	type Habit {
		habit_id: String
		user_id: String
		name: String
        type: [String]
        priority: Int
        created_at: String
	}
`;

module.exports = habitDefs;
