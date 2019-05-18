const moment = require('moment');
const logger = require('pino')();
const uuidv4 = require('uuid/v4');
const _ = require('lodash');

const User = require('./User');

// https://www.dynamodbguide.com/leaderboard-write-sharding/
class Streak extends User {
  /**
   * Get streak for a user
   *
   * @param { String } user_id User identification as the primary key in the dynamo table
   * @return { Object } Streak object
   */
  getUserStreak(user_id) {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: 'user_id = :u AND begins_with(item_id, :s)',
      ExpressionAttributeValues: {
        ':u': user_id,
        ':s': 'streak',
      },
    };

    return this.docClient.query(params).promise();
  }

  /**
   * Update streak. If we call this function we assume the user 
   * is completing a habit for the first time today and can set 
   * the expiration to the end of the next day.
   *
   * @param { String } user_id User identification as the primary key in the streak table
   * @return { Object } Updated Values
   */
  async upsert(user_id, username) {
    // if creation succeeds we return else the row needs to be updated.
    let userStreakExists;
    try {
      const createParams = {
        user_id,
        username,
        score: 1,
        item_id: `streak-${uuidv4()}`,
        streak: 'STREAK',
        expiration: moment().add(1, 'day').endOf('day').unix(),
      };

      userStreakExists = await this.getUserStreak(user_id);

      if (_.isEmpty(userStreakExists.Items)) {
        const results = await this.create(createParams);
        return results;
      }
    } catch (err) {
      logger.error(`Unable to update user streak for user ${user_id} with err ${err}`);
      throw err;
    }
    logger.info('Row already exists, will update streak now.');

    const params = {
        TableName: this.tableName,
        Key: { 
          user_id,
          item_id: userStreakExists.Items[0].item_id,
        },
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
