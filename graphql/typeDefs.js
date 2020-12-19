// Here we list out all types of Queries/Mutations/Subscription and the structure they return. 
// Should be kept in a seperate file where we can list out all the Type Definitions together.

const { gql } = require('apollo-server');

module.exports = gql`
    type Post{
        id: ID!,
        body: String!,
        createdAt: String!,
        username: String!
    }

    type Query{
        getPosts: [Post]
    }
`;