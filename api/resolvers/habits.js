const HabitModel = require('../../model/Habit');

// The resolver class will take the graphql queries and format them to
// to use in dynamodb queries.
class HabitResolver {
  constructor() {
    this.model = new HabitModel();
  }

  // get all the habits for a user
  // requires that the user_id matches the logged in user
  //
  async getHabits(args, ctx) {
    if (!ctx.user) {
      throw new Error('Unauthorized user!');
    }

    try {
      const results = await this.model.getUserHabits(ctx.user.user_id);
      return results.Items;
    } catch (err) {
      console.log(err);
    }
  }

  async getHabit(args) {
    const {
      habit_id: habitId,
      created_at: createdAt,
    } = args;

    try {
      const results = await this.model.getHabit(habitId, createdAt);
      console.log(results, 'getHabit');
      return results.Item;
    } catch (err) {
      console.log(err);
    }
  }

  async createHabit(args, ctx) {
    // The user will be authenticated at this point
    // so we can assign their user_id to the habit.
    args.input.user_id = ctx.user.user_id;

    try {
      const results = await this.model.create(args.input);
      return results;
    } catch (err) {
      console.log(err);
    }
  }

  async deleteHabit(args) {
    const {
      habit_id: habitId,
      created_at: createdAt,
    } = args;

    try {
      const results = await this.model.delete(habitId, createdAt);
      return results;
    } catch (err) {
      console.log(err);
    }
  }

  async getAllHabits(_, args, logger) {
    try {
      const results = await this.model.scan();
      return results.Items;
    } catch (err) {
      logger.error('DIZ IS NOT GUD');
    }
  }
}

module.exports = new HabitResolver();
