const _ = require('lodash');
const uuidv4 = require('uuid/v4');

const resolver = {
    Query: {
      // get all the habits for a user
      // requires that the user_id matches the logged in user
      
      async getHabits(instance, args, ctx) {
        if (!ctx.user) {
          throw new Error('Unauthorized user!');
        }

        try {
          const results = await ctx.HabitModel.getUserHabits(ctx.user.user_id);
          return results.Items;
        } catch (err) {
          ctx.logger.error(err);
          throw err;
        }
      },

      async getHabit(instance, args, ctx) {
        const habit_id = _.get(args, 'habit_id');
        const created_at = _.get(args, 'created_at');
    
        try {
          const results = await ctx.HabitModel.getHabit(habit_id, created_at);
          ctx.logger.info(results, 'getHabit');
          return results.Item;
        } catch (err) {
          ctx.logger.error(err);
          throw err;
        }
      },

      async getAllHabits(instance, args, { logger, HabitModel }) {
        try {
          const results = await HabitModel.scan();
          return results.Items;
        } catch (err) {
          logger.error('DIZ IS NOT GUD');
          throw err;
        }
      },

    },

    Mutation: {
      async createHabit(instance, args, ctx) {
        // The user will be authenticated at this point
        // so we can assign their user_id to the habit.
        const input = _.get(args, 'input');
    
        const generatedInput = {
          habit_id: uuidv4(),
          user_id: _.get(ctx, 'user.user_id'),
          created_at: Date.now(),
        };
        
        const habit = _.extend(input, generatedInput);
    
        try {
          const results = await ctx.HabitModel.create(habit);
          return results;
        } catch (err) {
          ctx.logger.log(err);
          throw err;
        }
      },

      async deleteHabit(instance, args, ctx) {
        const {
          habit_id: habitId,
          created_at: createdAt,
        } = args;
    
        try {
          const results = await ctx.HabitModel.delete(habitId, createdAt);
          return results;
        } catch (err) {
          ctx.logger.error(err);
          throw err;
        }
      },
    },
};

module.exports = resolver;
