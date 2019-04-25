const AWS = require('aws-sdk');
const moment = require('moment');

// https://www.dynamodbguide.com/leaderboard-write-sharding/
class Streak {
  constructor() {
    this.tableName = process.env.STREAK_TABLE;

    // Set AWS configs for tests if we have a local db
    // Might be able to remove this with servless local dynamodb plugin
    if (process.env.NODE_ENV === 'test') {
      AWS.config.update({
        region: 'us-east-1',
        endpoint: 'http://localhost:8000',
      });
    }

    this.docClient = new AWS.DynamoDB.DocumentClient();
  }

  /**
   * Create streak for a user
   *
   * @param { String } user_id User identification as the primary key in the dynamo table
   * @return { Object } Streak object
   */
  create(user_id, username) {
    const params = {
      TableName: this.tableName,
      Item: {
        user_id,
        username,
        score: 0,
      },
    };

    return this.docClient.put(params).promise();
  }

  /**
   * Get streak for a user
   *
   * @param { String } user_id User identification as the primary key in the dynamo table
   * @return { Object } Streak object
   */
  get(user_id) {
    const params = {
      TableName: this.tableName,
      Key: {
        user_id,
      },
    };

    return this.docClient.get(params).promise();
  }

  /**
   * Update streak. If we call this function we assume the user 
   * is completing a habit for the first time today and can set 
   * the expiration to the end of the next day.
   *
   * @param { String } user_id User identification as the primary key in the streak table
   * @return { Object } Updated Values
   */
  update(user_id) {
    const params = {
        TableName: this.tableName,
        Key: { user_id },
        UpdateExpression: 'SET score = score + :incr, expiration = :expiration, streak = :streak',
        ExpressionAttributeValues: {
            ':incr': 1,
            ':expiration': moment().add(1, 'day').endOf('day').unix(),
            ':streak': 'STREAK',
        },
        ReturnValues: 'UPDATED_NEW',
    };

    return this.docClient.update(params).promise();
  }

  getTopStreaks(Limit = 10) {
      const params = {
          TableName: this.tableName,
          IndexName: 'StreakIndex',
          KeyConditionExpression: 'streak = :streak',
          ExpressionAttributeValues: {
            ':streak': 'STREAK',
          },
          ScanIndexForward: false,
          Limit,
      };

      return this.docClient.query(params).promise();
  }
}

module.exports = Streak;
