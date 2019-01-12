const _ = require('lodash');

class DynamoModelValidator {
  constructor() {
    /* Parameters of the Model */
    this.PARAM_TYPES = {};

    /* Parameters allowed to be set during model creation. */
    this.ALLOWED_PARAMS = [];
  }

  /*  */
  check(params) {
    const paramErrors = [];

    params = this.sanitize(params);

    _.forEach(Object.keys(this.PARAM_TYPES), (param) => {
      if (params[param] && !this.isValidType(params, param)) {
        paramErrors.push(`Invalid type for "${param}" parameter: ${typeof params[param]}`);
      }
    });

    return paramErrors;
  }

  sanitize(params) {
    _.forEach(Object.keys(params), (key) => {
      if (this.ALLOWED_PARAMS.indexOf(key) < 0) {
        delete params[key];
      }
    });

    return params;
  }

  isValidType(params, param) {
    return typeof params[param] === this.PARAM_TYPES[param];
  }
}

module.exports = DynamoModelValidator;
