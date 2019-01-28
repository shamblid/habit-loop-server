const AWS = require('aws-sdk');
const UserValidator = require('./validators/User');

class User {
  constructor() {
    const config = require(`../config/${process.env.NODE_ENV}.json`);
    this.tableName = config.dynamodb.userTable;

    // Set AWS configs for tests if we have a local db
    // Might be able to remove this with servless local dynamodb plugin
    if (process.env.NODE_ENV === 'test') {
      AWS.config.update({
        region: 'us-east-1',
        endpoint: 'http://localhost:8000',
      });
    }

    this.docClient = new AWS.DynamoDB.DocumentClient();
    this.validator = new UserValidator();
  }

  /**
   * Get specific User for a user
   *
   * @param { String } user_id User identification as the primary key in the dynamo table
   * @param { String } created_at one of the keys of the dynamo table
   * @return { Object } User object
   */
  getById(user_id, created_at) {
    const params = {
      TableName: this.tableName,
      Key: {
        user_id,
        created_at,
      },
    };

    return this.docClient.get(params).promise();
  }

  /**
   * Get specific User for a user
   *
   * @param { String } user_id User identification as the primary key in the dynamo table
   * @param { String } created_at one of the keys of the dynamo table
   * @return { Object } User object
   */
  getByEmail(email) {
    const params = {
      TableName: this.tableName,
      IndexName: 'EmailIndex',
      KeyConditionExpression: '#email = :email',
      ExpressionAttributeNames: {
        '#email': 'email',
      },
      ExpressionAttributeValues: {
        ':email': email,
      },
    };

    return this.docClient.query(params).promise();
  }

  /**
   * Get the list of Users for a specific user
   *
   * @param { Object } user Object containing details of the new User
   * @return { Array } Returns array of userUsers
   */
  async create(user) {
    this.validator.check(user);

    const params = {
      TableName: this.tableName,
      Item: user,
    };

    return this.docClient.put(params).promise();
  }

  /**
   * Get the list of Users for a specific user
   *
   * @param { Object } user Object containing details of the new User
   * @return { Array } Returns array of userUsers
   */
  async updatePushNotification({ user_id, created_at }, token) {
    const params = {
      TableName: this.tableName,
      Key: {
        user_id,
        created_at,
      },
      UpdateExpression: 'set push_notification_token=:p',
      ExpressionAttributeValues: {
        ':p': token,
      },
      ReturnValues: 'UPDATED_NEW',
    };

    return this.docClient.update(params).promise();
  }

  async getAllUsers() {
    const params = {
      TableName: this.tableName,
    };

    return this.docClient.scan(params).promise();
  }
}

module.exports = User;
