const { gql } = require('apollo-server-express');
const habitDefs = require('./habit');
const postDefs = require('./post');

const typeDefs = gql`

	directive @requireAuth(
		role: Role
	) on FIELD_DEFINITION

	enum Role {
		MANAGER
		USER
	}	
	
	type Query {
        _empty: String
	}
    
    type Mutation {
        _empty: String
    }
    
    ${habitDefs}
    ${postDefs}
`;

module.exports = typeDefs;