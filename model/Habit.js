const AWS = require('aws-sdk');

class Habit {
  constructor() {
    const config = require(`../config/${process.env.NODE_ENV}.json`);
    this.tableName = config.dynamodb.habitTable;
    AWS.config.update({
        region: "us-west-2",
        endpoint: "http://localhost:8000"
    });
    this.docClient = new AWS.DynamoDB.DocumentClient();
  }

  /**
   * Get the list of habits for a specific user
   *
   * @param { String } userId User identification
   * @return { Array } Returns array of userHabits
   */
  async getUserHabits(userId) {}

   /**
   * Get specific habit for a user
   *
   * @param { String } userId User identification
   * @param { String } habitId Id of the habit to get
   * @return { Array } Returns array of userHabits
   */
  async getHabit(userId, habitId) {
    const params = {
      TableName: this.tableName,
      Key: {
        habit_id: habitId,
        created_at: userId
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
  async createUserHabit(userId, newHabit) {
    const params = {
        TableName: this.tableName,
        Item: newHabit
    };
    
    return this.docClient.put(params).promise();
  }
}

module.exports = Habit;