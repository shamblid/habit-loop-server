const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');
const _ = require('lodash');

const JWT_SECRET = 'supersecret';

const resolvers = {
  Query: {
    // fetch the profile of currently authenticated user
    async me(instance, args, { user, UserModel }) {
      // make sure user is logged in
      if (!user) {
        throw new Error('You are not authenticated!');
      }

      // user is authenticated
      
      const result = await UserModel.getByEmail(user.email);
      return _.get(result, 'Items[0]');
    },

    async getTopStreaks(instance, args, { StreakModel, logger }) {
      try {
        const result = await StreakModel.getTopStreaks();
        return result.Items;
      } catch (err) {
        logger.error(`Error getting top streaks: ${err}.`);
        throw err;
      }
    },

    async getGroupLeaderboard(instance, { group_id }, { StreakModel, GroupModel, logger }) {
      try {
        const {
          Items: users,
        } = await GroupModel.getUsersInGroups(group_id);

        const streaks = await StreakModel.getUsers(users);
        return streaks;
      } catch (err) {
        logger.error(err);
        return err;
      }
    },

    async getUserStreak(instance, args, { user, logger, StreakModel }) {
      try {
        const {
          Items: streakData,
        } = await StreakModel.getUserStreak(user.user_id);
        return streakData[0];
      } catch (err) {
        logger.error(`Problem getting user streak: ${err}`);
        return err;
      }
    },

    async getUserGroups(instance, args, { user, GroupModel, logger }) {
      try {
        const {
          Items: groupData,
        } = await GroupModel.getUserGroups(user.user_id);

        return groupData;
      } catch (err) {
        logger.error(`Problem getting user groups: ${err}`);
        return err;
      }
    },
  },
  
  Mutation: {
    // Handle user signup
    async signup(instance, args, { logger, UserModel }) {
      try {
        const {
          username,
          password,
          email,
        } = args.input;

        const user = {
          user_id: uuidv4(),
          username,
          email,
          item_id: `profile-${uuidv4()}`,
          created_at: `${Date.now()}`,
          role: ['USER'],
          password: await bcrypt.hash(password, 10),
        };

        await UserModel.create(user);
        logger.info('New user has been created!');

        // return json web token
        return jsonwebtoken.sign(
          {
            email: user.email,
            username: user.username,
            user_id: user.user_id,
            role: user.role,
          },
          JWT_SECRET,
          { expiresIn: '1d' },
        );
      } catch (err) {
        logger.error(err);
        throw err;
      }
    },

    // Handles user login
    async login(instance, { email, password }, ctx) {
      const { UserModel, logger } = ctx;
      let user; 

      try {
        const results = await UserModel.getByEmail(email);
        user = _.get(results, 'Items[0]');
      } catch (error) {
        logger.error('USER_LOGIN_ERROR', error);
      }

      if (!user) {
        throw new Error('No user with that email');
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        throw new Error('Incorrect password');
      }

      // payload containing user info
      return jsonwebtoken.sign(
        {
          email: user.email,
          username: user.username,
          user_id: user.user_id,
          role: user.role,
          created_at: user.created_at,
        },
        JWT_SECRET,
        { expiresIn: '1d' },
      );
    },

    async registerPushNotification(instance, { token }, { user, UserModel, logger }) {
      try {
        const results = await UserModel.updatePushNotification(user, token);
        logger.info('added new token');
        return results;
      } catch (err) {
        logger.error('REGISTER_PUSH_NOTIFICATION_ERROR', err);
        return err;
      }
    },

    async createGroup(instance, { group_name }, { user, GroupModel, logger }) {
      try {
        const group_id = `group-${uuidv4()}`;

        const userToAdd = {
          user_id: user.user_id,
          item_id: group_id,
          group_name,
          owner: true,
        };
        
        // Create group and then add member since they are the one creating it.
        await GroupModel.createGroup(userToAdd);
        return group_name;
      } catch (err) {
        logger.error(`There was a problem creating a group: ${err}`);
        return err;
      }
    },

    async joinGroup(instance, { item_id, group_name }, { user, GroupModel, StreakModel, logger }) {
      try {
        const {
          Items: streak,
        } = await StreakModel.getUserStreak(user.user_id);

        const member = {
          user_id: user.user_id,
          item_id,
          streak_id: streak[0].item_id,
          group_name,
        };

        await GroupModel.addMemberToGroup(member);
        logger.info(`Added member: ${user.user_id} to group: ${item_id}`);
        return '';
      } catch (err) {
        logger.error('ADD_MEMBER_TO_GROUP_ERROR', err);
        return err;
      }
    },
  },
};

module.exports = resolvers;
