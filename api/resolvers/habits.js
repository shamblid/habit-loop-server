const HabitModel = require('../../model/Habit');

// The resolver class will take the graphql queries and format them to 
// to use in dynamodb queries.
class HabitResolver {
    getUserHabits(id) {

    }

    getHabit(args) {
        const {
            user_id: userId,
            habit_id: habitId
        } = args;
        const Habit = new HabitModel();

        try {
            const results = await Habit.getHabit(userId, habitId);
            console.log(results);
            return results;
        } catch (err) {
            console.log(err);
        }
    }

    createUserHabit(args) {
        
        const Habit = new HabitModel();

        try {
            const results = await Habit.createUserHabit(args.user_id, args.habit);
            console.log(results);
            return results;
        } catch (err) {
            console.log(err);
        }
    }
}