const User = require('./User');

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
  createGroup() {

  }

  // Since groups is many-to-many with users we need to
  // update group and add a member
  addMemberToGroup({ user_id, created_at }, group_id) {
    const params = {
      TableName: this.tableName,
      Key: {
        user_id,
        created_at,
      },
      UpdateExpression: 'set group = :g '
    }
  }

  
  addGroupForMember() {
    const params = {
      TableName: this.tableName,
      Key: {
        user_id,
        created_at,
      },
      UpdateExpression: 'set group = :g '
    }
  }

  getUsersInGroups(groups = ['TEST']) {
    // const [FilterExpression, ExpressionAttributeValues] = createGroupQuery(groups);

    // const params = {
    //   TableName: this.tableName,
    //   KeyConditionExpression: '#group = '
    //   FilterExpression,
    //   ExpressionAttributeValues,
    //   ExpressionAttributeNames: {
    //     '#group': 'group',
    //   },
    // };

    // return this.docClient.query(params).promise();
  }
}

module.exports = Group;
