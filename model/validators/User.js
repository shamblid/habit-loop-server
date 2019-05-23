const _ = require('lodash');
const BaseValidator = require('./base');

const GROUP_TYPES = {
  group_name: 'string',
  users: 'object',
  owner: 'boolean',
  streak_id: 'string',
  group_sort: 'string',
};

const STREAK_TYPES = {
  score: 'number',
  streak: 'string',
  expiration: 'string',
};

const HABIT_TYPES = {
  habit_name: 'string',
  type: 'string',
  notify: 'object',
  priority: 'string',
  completed_today: 'boolean',
  recurrence: 'string',
};

const USER_TYPES = {
  user_id: 'string',
  username: 'string',
  email: 'string',
  password: 'string',
  group: 'object',
  role: 'object',
};

const BASE_TYPES = {
  created_at: 'string',
  push_token: 'string',
  timestamp: 'string',
  reminder: 'string',
  item_id: 'string',
};

const types = [BASE_TYPES, USER_TYPES, HABIT_TYPES, STREAK_TYPES, GROUP_TYPES];


class UserValidator extends BaseValidator {
  constructor() {
    super();
    this.PARAM_TYPES = _.merge(BASE_TYPES, USER_TYPES, HABIT_TYPES, STREAK_TYPES, GROUP_TYPES);

    /**
     * Fields allowed during Creation
     * State is interpreted by creation, since we're creating it was present and therefore active.
     * */
    this.ALLOWED_PARAMS = _.reduce(types, (prev, curr) => (_.concat(prev, Object.keys(curr))), []);
  }
}

module.exports = UserValidator;
