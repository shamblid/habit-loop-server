const { gql } = require('apollo-server-express');

const userDefs = gql`
	
	extend type Query {
		me: User
	}
	
	extend type Mutation {
		signup(input: UserInput!): String
		login(email: String!, password: String!): String
	}

	input UserInput {
		id: String!
		username: String!
		email: String!
		created_at: String!
        role: [String!]
	}

	type User {
		id: String!
		username: String!
		email: String!
		created_at: String!
        role: [String!]
    }
`;

module.exports = userDefs;