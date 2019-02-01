const { Expo } = require('expo-server-sdk');
const _ = require('lodash');

const UserModel = require('../model/User');

const sendPushNotification = async () => {
  const expo = new Expo();
  const user = new UserModel();

  const users = await user.getAllUsers();
  const userPushTokens = _.compact(users.Items.map(u => u.push_notification_token));
  console.log(userPushTokens)
  const messages = [];
  _.forEach(userPushTokens, token => {
    if (!Expo.isExpoPushToken(token)) {
        console.log(`Push token ${token} is not a valid Expo push token`);
    } else {
        messages.push({
            to: token,
            sound: 'default',
            body: 'HEY DO YOUR TRAINING',
            data: { withSome: 'data' },
        });
    }
  });

  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];

  _.forEach(chunks, async chunk => {
    try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
    } catch (err) {
        console.log(err);
    }
  });
};


// Check users habit
module.exports.handler = (event, context, callback) => {
  sendPushNotification();
};
