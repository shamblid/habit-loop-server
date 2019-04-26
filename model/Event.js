const AWS = require('aws-sdk');

class Event {
  constructor() {
    this.tableName = process.env.EVENT_TABLE;

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
   * Get specific User for a user
   *
   * @param { String } user_id User identification as the primary key in the dynamo table
   * @param { String } created_at one of the keys of the dynamo table
   * @return { Object } User object
   */
  addEvent(user_id, created_at) {
    const params = {
      TableName: this.tableName,
      Key: {
        user_id,
        created_at,
      },
    };

    return this.docClient.get(params).promise();
  }
}

module.exports = Event;
