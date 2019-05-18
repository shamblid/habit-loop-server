const _ = require('lodash');
const BaseValidator = require('./base');

const STREAK_TYPES = {
  score: 'number',
  streak: 'string',
  expiration: 'string',
};

const HABIT_TYPES = {
  habit_name: 'string',
  type: 'object',
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

class UserValidator extends BaseValidator {
  constructor() {
    super();
    this.PARAM_TYPES = _.merge(BASE_TYPES, USER_TYPES, HABIT_TYPES, STREAK_TYPES);

    /**
     * Fields allowed during Creation
     * State is interpreted by creation, since we're creating it was present and therefore active.
     * */
    this.ALLOWED_PARAMS = [
      'habit_name',
      'type',
      'notify',
      'priority',
      'completed_today',
      'recurrence',
      'user_id',
      'username',
      'email',
      'password',
      'group',
      'role',
      'created_at',
      'push_token',
      'timestamp',
      'reminder',
      'item_id',
      'score',
      'streak',
      'expiration',
    ];
  }
}

module.exports = UserValidator;
