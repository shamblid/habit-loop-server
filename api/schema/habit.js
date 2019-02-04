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
		updatePriority(priority: Rank!, habit_id: String!, created_at: String!): Habit
		updateNotification(notify: Reminder, habit_id: String!, created_at: String!): Habit
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
        priority: Rank
		created_at: String
		notify: Reminder
	}
	
	enum Rank {
		TOP
		MIDDLE
		LOW
	}
`;

module.exports = habitDefs;
