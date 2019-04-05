const { gql } = require('apollo-server-express');
const habitDefs = require('./habit');
const userDefs = require('./user');

const typeDefs = gql`
	directive @requireAuth(
		role: Role
	) on FIELD_DEFINITION

	enum Role {
		MANAGER
		ADMIN
		USER
	}	

	enum Reminder {
		MORNING
		NOON
		AFTERNOON
		EVENING
	}
	
	type Query {
        _empty: String
	}
    
    type Mutation {
		_empty: String
    }
    
    ${habitDefs}
    ${userDefs}
`;

module.exports = typeDefs;
