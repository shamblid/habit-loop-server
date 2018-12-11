const AWS = require('aws-sdk');
const HabitValidator = require('./validators/Habit');

class Habit {
  constructor() {
    const config = require(`../config/${process.env.NODE_ENV}.json`);
    this.tableName = config.dynamodb.habitTable;

    // Set AWS configs for tests if we have a local db
    // Might be able to remove this with servless local dynamodb plugin
    if (process.env.NODE_ENV === 'test') {
      AWS.config.update({
          region: "us-east-1",
          endpoint: "http://localhost:8000"
      });
    }

    this.docClient = new AWS.DynamoDB.DocumentClient();
    this.validator = new HabitValidator();
  }

  /**
   * Get the list of habits for a specific user
   *
   * @param { String } userId User identification
   * @return { Array } Returns array of userHabits
   */
  getUserHabits(userId) {
    const params = {
      TableName: this.tableName,
      // ExpressionAttributeValues: {
      //   ":user_id":{
      //     S:
      //   }
      // }
    }

    return this.docClient.query(params).promise();
  }

   /**
   * Get specific habit for a user
   *
   * @param { String } userId User identification
   * @param { String } habitId Id of the habit to get
   * @return { Array } Returns array of userHabits
   */
  getHabit(habitId, createdAt) {
    const params = {
      TableName: this.tableName,
      Key: {
        habit_id: habitId,
        created_at: createdAt
      }
    }
    
    return this.docClient.get(params).promise();
  }

  /**
   * Get the list of habits for a specific user
   *
   * @param { String } userId User identification
   * @param { Object } newHabit Object containing details of the new habit
   * @return { Array } Returns array of userHabits
   */
  async create(newHabit) {
    this.validator.check(newHabit);

    const params = {
        TableName: this.tableName,
        Item: newHabit
    };

    return this.docClient.put(params).promise();
  }

  async delete(habitId, createdAt) {
    const params = {
      TableName: this.tableName,
      Key: {
        habit_id: habitId,
        created_at: createdAt
      }
    }

    return this.docClient.delete(params).promise();
  }

  async scan() {
    const params = {
      TableName: this.tableName,
    };

    return this.docClient.scan(params).promise();
  }
}

module.exports = Habit;