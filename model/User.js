const AWS = require('aws-sdk');
const UserValidator = require('./validators/User');

class Habit {
  constructor() {
    const config = require(`../config/${process.env.NODE_ENV}.json`);
    this.tableName = config.dynamodb.userTable;

    // Set AWS configs for tests if we have a local db
    // Might be able to remove this with servless local dynamodb plugin
    if (process.env.NODE_ENV === 'test') {
      AWS.config.update({
          region: "us-east-1",
          endpoint: "http://localhost:8000"
      });
    }

    this.docClient = new AWS.DynamoDB.DocumentClient();
    this.validator = new UserValidator();
  }

   /**
   * Get specific habit for a user
   *
   * @param { String } userId User identification
   * @param { String } habitId Id of the habit to get
   * @return { Array } Returns array of userHabits
   */
  getById(id) {
    const params = {
      TableName: this.tableName,
      Key: {
        user_id: id,
        created_at: createdAt
      }
    }
    
    return this.docClient.get(params).promise();
  }

  /**
   * Get the list of habits for a specific user
   *
   * @param { Object } user Object containing details of the new habit
   * @return { Array } Returns array of userHabits
   */
  async create(user) {
    this.validator.check(user);

    const params = {
        TableName: this.tableName,
        Item: user
    };

    return this.docClient.put(params).promise();
  }
}

module.exports = Habit;