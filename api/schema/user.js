const { gql } = require('apollo-server-express');

const userDefs = gql`
	
	extend type Query {
		me: User
	}
	
	extend type Mutation {
		signup(input: SignupInput!): String
		login(email: String!, password: String!): String
	}

	input SignupInput {
		id: String!
		username: String!
		password: String!
		email: String!
		created_at: String!
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
