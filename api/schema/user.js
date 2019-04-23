const { gql } = require('apollo-server-lambda');

const userDefs = gql`
	extend type Query {
		me: User
	}
	
	extend type Mutation {
		signup(input: SignupInput!): String
		login(email: String!, password: String!): String
		registerPushNotification(token: String! reminder: Reminder): String @requireAuth(role: USER)
	} 

	input SignupInput {
		username: String!
		password: String!
		email: String!
		manager: String
	}

	type User {
		user_id: String
		username: String
		email: String
		created_at: String
		role: [String]
		manager: String
	}
`;

module.exports = userDefs;
