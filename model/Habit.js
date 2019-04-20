const AWS = require('aws-sdk');
const _ = require('lodash');
const logger = require('pino')();

const HabitValidator = require('./validators/Habit');

// item contains name, type, habit_id, user_id, created_at
const createUpdate = (item) => {
  const updateTypes = ['name', 'type', 'recurrence'];
  console.log(item);
  const types = _.pick(item, updateTypes);

  const ExpressionAttributeNames = {};
  _.forEach(types, (val, key) => {
    ExpressionAttributeNames[`#${key}123`] = key;
  });

  const expression = _.map(types, (val, key) => `#${key}123 = :val${key}`);
  
  const ExpressionAttributeValues = {};
  
  _.forEach(types, (val, key) => {
    ExpressionAttributeValues[`:val${key}`] = val;
  });

  const UpdateExpression = `set ${expression}`;

  console.log(UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues);
  return [UpdateExpression, ExpressionAttributeValues, ExpressionAttributeNames];
};

class Habit {
  constructor() {
    const config = require(`../config/${process.env.NODE_ENV}.json`);
    this.tableName = config.dynamodb.habitTable;

    // Set AWS configs for tests if we have a local db
    // Might be able to remove this with servless local dynamodb plugin
    if (process.env.NODE_ENV === 'test') {
      AWS.config.update({
        region: 'us-east-1',
        endpoint: 'http://localhost:8000',
      });
    }


    this.logger = logger;
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
      IndexName: 'UserIndex',
      KeyConditionExpression: 'user_id = :u',
      ExpressionAttributeValues: {
        ':u': userId,
      },
    };

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
        created_at: createdAt,
      },
    };

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
      Item: newHabit,
    };

    return this.docClient.put(params).promise();
  }

  async delete(habitId, createdAt) {
    const params = {
      TableName: this.tableName,
      Key: {
        habit_id: habitId,
        created_at: createdAt,
      },
    };

    return this.docClient.delete(params).promise();
  }

  async update(habit) {
    const [
      UpdateExpression, 
      ExpressionAttributeValues, 
      ExpressionAttributeNames,
    ] = createUpdate(habit);
    
    const params = {
      TableName: this.tableName,
      Key: {
        habit_id: habit.habit_id,
        created_at: habit.created_at,
      },
      UpdateExpression,
      ExpressionAttributeValues,
      ExpressionAttributeNames,
      Item: habit,
      ReturnValue: 'UPDATED_NEW',
    };

    return this.docClient.update(params).promise();
  }

  async scan() {
    const params = {
      TableName: this.tableName,
    };

    return this.docClient.scan(params).promise();
  }
}

module.exports = Habit;
