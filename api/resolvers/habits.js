const HabitModel = require('../../model/Habit');

// The resolver class will take the graphql queries and format them to 
// to use in dynamodb queries.
class HabitResolver {
    constructor() {
        this.model = new HabitModel();
    }
    
    async getUserHabits(args) {
        const {
            user_id: userId
        } = args;


        try {
            const results = await this.model.getUserHabits(userId);
            return results.Item;
        } catch (err) {
            console.log(err);
        }
    }

    async getHabit(args) {
        const {
            user_id: userId,
            habit_id: habitId
        } = args;


        try {
            const results = await this.model.getHabit(userId, habitId);
            return results.Item;
        } catch (err) {
            console.log(err);
        }
    }

    async createUserHabit(args) {
        try {
            const results = await this.model.createUserHabit(args.input);
            console.log(results, 'results');
            return results;
        } catch (err) {
            console.log(err);
        }
    }

    async getAllHabits() {
        console.log('here')
        try {
            const results = await this.model.getAllHabits();
            console.log(results)
            return results.Items;
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = new HabitResolver();