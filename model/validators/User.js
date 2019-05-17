const BaseValidator = require('./base');

class UserValidator extends BaseValidator {
  constructor() {
    super();
    this.PARAM_TYPES = {
      user_id: 'string',
      username: 'string',
      email: 'string',
      password: 'string',
      created_at: 'string',
      role: 'object',
      push_token: 'string',
      timestamp: 'string',
      reminder: 'string',
      group: 'object',
    };

    /**
     * Fields allowed during Creation
     * State is interpreted by creation, since we're creating it was present and therefore active.
     * */
    this.ALLOWED_PARAMS = [
      'user_id',
      'username',
      'email',
      'password',
      'created_at',
      'role',
      'push_token',
      'timestamp',
      'reminder',
      'group',
    ];
  }
}

module.exports = UserValidator;
