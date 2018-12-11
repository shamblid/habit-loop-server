const HabitModel = require('../../model/Habit');

// The resolver class will take the graphql queries and format them to 
// to use in dynamodb queries.
class HabitResolver {
    constructor() {
        this.model = new HabitModel();
    }
    
    async getHabits(args) {
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
            habit_id: habitId,
            created_at: createdAt
        } = args;

        try {
            const results = await this.model.getHabit(habitId, createdAt);
            console.log(results, 'getHabit');
            return results.Item;
        } catch (err) {
            console.log(err);
        }
    }

    async createHabit(args) {
        try {
            const results = await this.model.create(args.input);
            console.log(results, 'results createUserHabit');
            return results;
        } catch (err) {
            console.log(err);
        }
    }

    async deleteHabit(args) {
        const {
            habit_id: habitId,
            created_at: createdAt
        } = args

        try {
            const results = await this.model.delete(habitId, createdAt);
            console.log(results, 'results delete');
            return results;
        } catch (err) {
            console.log(err);
        }
    }

    async getAllHabits() {
        try {
            const results = await this.model.scan();
            return results.Items;
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = new HabitResolver();