const AWS = require('aws-sdk');

class Habit {
    constructor() {
        const config = require(`../config/${process.env.NODE_ENV}.json`);
        this.tableName = config.dynamodb.habitTable;
        
        this.dynamodb = new AWS.DynamoDB.DocumentClient;
    }
}

exports.module = Habit;