const _ = require('lodash');
const uuidv4 = require('uuid/v4');
const moment = require('moment');

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
          const completedDailyHabits = await ctx.Redis.lrange(`${ctx.user.user_id}|DAILY`);
          const completedWeeklyHabits = await ctx.Redis.lrange(`${ctx.user.user_id}|WEEKLY`);

          const habits = results.Items;

          const newHabits = _.map(habits, habit => {
              if (completedDailyHabits.includes(habit.habit_id) 
              || completedWeeklyHabits.includes(habit.habit_id)) {
                return Object.assign(habit, { completed_today: true });
              } return habit;
          });

          return newHabits;
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
          logger.error('Error getting all habits.');
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
          created_at: `${Date.now()}`,
        };
        
        const habit = _.extend(input, generatedInput);
    
        try {
          const results = await ctx.HabitModel.create(habit);
          return results;
        } catch (err) {
          ctx.logger.error(err);
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

      async updateHabit(instance, args, ctx) {
        const input = _.get(args, 'input');

        // User trying to make changes for habits that they do not own.
        // if (input.user_id !== ctx.user.user_id) {
        //   throw new Error('ERROR_403_FORBIDDEN');
        // }

        try {
          const results = await ctx.HabitModel.update(input);
          return results;
        } catch (err) {
          ctx.logger.error(err);
          throw err;
        }
      },

      async completeHabit(instance, { user_id, habit_id, recurrence }, ctx) {
        if (recurrence === 'DAILY') {
          ctx.Redis.rpush(`${user_id}|DAILY`, habit_id);
    
          ctx.Redis.expire(`${user_id}|DAILY`, moment().endOf('day').unix());
        } else if (recurrence === 'WEEKLY') {
          ctx.Redis.rpush(`${user_id}|WEEKLY`, habit_id);
    
          // first day of week according to iso is monday
          ctx.Redis.expire(`${user_id}|WEEKLY`, moment().endOf('isoWeek').unix());
        }
      },
    },
};

module.exports = resolver;
