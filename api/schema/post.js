const { gql } = require('apollo-server-express');

const postDefs = gql`

    extend type Query {
        posts: [Post] @requireAuth(role: MANAGER)
    }

    type Post {
        id: Int
        title: String
    }
`
module.exports = postDefs
        