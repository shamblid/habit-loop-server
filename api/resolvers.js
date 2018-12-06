const habits = require('./resolvers/habits');

const resolvers = {
	Query: {
		getHabit: (_, args) => habits.getHabit(args),
		getUserHabits: (_, args) => habits.getUserHabits(args),
		getAllHabits: (_, args) => habits.getAllHabits()
	},

	Mutation: {
		createUserHabit: (_, args) => habits.createUserHabit(args)
	}
};

module.exports = resolvers;