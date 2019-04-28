const { gql } = require('apollo-server-lambda');

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
		updateHabit(input: UpdateHabitInput!): Habit 
		updatePriority(priority: Rank!, habit_id: String!, created_at: String!): Habit
		updateNotification(notify: Reminder, habit_id: String!, created_at: String!): Habit
		completeHabit(habit_id: String!, recurrence: String!): Boolean
	}

	input HabitInput {
		name: String!
		type: String
		recurrence: Recurrence
	}

	input UpdateHabitInput {
		habit_id: String!
		created_at: String!
		user_id: String
		name: String
		type: String
		recurrence: Recurrence
	}	

	type Habit {
		habit_id: String
		user_id: String
		name: String
        type: String
        priority: Rank
		created_at: String
		notify: Reminder
		completed_today: Boolean
		recurrence: Recurrence
	}

	enum Recurrence {
		DAILY
		WEEKLY
	}
	
	enum Rank {
		TOP
		MIDDLE
		LOW
	}
`;

module.exports = habitDefs;
