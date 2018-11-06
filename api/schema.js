const { gql } = require('apollo-server-express');

const typeDefs = gql`
	type Person {
		id: Int
		name: String
		gender: String
		homeworld: String
	}
	type Query {
		allPeople: [Person]
		person(id: Int!): Person
	}
`;

module.exports = typeDefs;