const BaseValidator = require('./base');

class HabitValidator extends BaseValidator {
  constructor() {
    super();
    this.PARAM_TYPES = {
      habit_id: 'string',
      user_id: 'string',
      created_at: 'string',
      name: 'string',
      type: 'object',
      notify: 'object',
      priority: 'string',
    };

    /**
     * Fields allowed during Creation
     * State is interpreted by creation, since we're creating it was present and therefore active.
     * */
    this.ALLOWED_PARAMS = [
      'habit_id',
      'user_id',
      'created_at',
      'name',
      'type',
      'notify',
      'priority',
    ];
  }
}

module.exports = HabitValidator;
