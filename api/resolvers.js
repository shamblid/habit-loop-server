const habits = require('./resolvers/habits');

const resolvers = {
	Query: {
		getHabit: (_, args) => habits.getHabit(args),
		getHabits: (_, args) => habits.getHabits(args),
		getAllHabits: (_, args) => habits.getAllHabits()
	},

	Mutation: {
		createHabit: (_, args) => habits.createHabit(args),
		deleteHabit: (_, args) => habits.deleteHabit(args)
	}
};

module.exports = resolvers;