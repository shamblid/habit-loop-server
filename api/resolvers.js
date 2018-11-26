const habits = require('./resolvers/habits');

const resolvers = {
	Query: {
		getHabit: (_, args) => habits.getHabit(args),
		getUserHabits: (_, args) => habits.getUserHabits(args)
	},

	Mutation: {
		createUserHabit: (_, args) => habits.createUserHabit(args)
	}
};

module.exports = resolvers;