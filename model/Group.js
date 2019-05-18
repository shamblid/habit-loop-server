const User = require('./User');
const uuidv4 = require('uuid/v4');

const removeLastComma = (str) => str.replace(/,(\s+)?$/, '');   

const createGroupQuery = (groups = ['TEST', 'TEST1', 'TEST2']) => {
  const mapFilter = groups.reduce((acc, group, index) => `${acc}:group${index + 1}, `, '');

  const ExpressionAttributeValues = groups.reduce((acc, group, index) => {
    acc[`:group${index + 1}`] = group;
    return acc;
  }, {});

  const FilterExpression = `#group IN (${removeLastComma(mapFilter)})`;

  return [FilterExpression, ExpressionAttributeValues];
};

class Group extends User {
  createGroup(user) {
    this.validator.check(user);

    const params = {
      TableName: this.tableName,
      Item: user,
    };

    return this.docClient.put(params).promise();
  }

  // Since groups is many-to-many with users we need to
  // update group and then create new row for user in group
  // These are separate functions since dynamo doesn't have batch
  // update nor update and put together.
  addMemberToGroup({ user_id }, group_id) {
    // const params = {
    //   TableName: this.tableName,
    //   Key: {
    //     user_id,
    //     created_at,
    //   },
    //   UpdateExpression: 'set group = :g '
    // }
  }

  
  addGroupForMember() {
    // const params = {
    //   TableName: this.tableName,
    //   Key: {
    //     user_id,
    //     created_at,
    //   },
    //   UpdateExpression: 'set group = :g '
    // }
  }

  getUsersInGroups(groups = 'group-760c118b-0999-42b1-94c3-de1788f87873') {
    const params = {
      TableName: this.tableName,
      IndexName: 'ItemIndex',
      KeyConditionExpression: 'item_id = :i',
      ExpressionAttributeValues: {
        ':i': 'group-760c118b-0999-42b1-94c3-de1788f87873',
      },
    };

    return this.docClient.query(params).promise();
  }
}

module.exports = Group;
