// Here we list out all types of Queries/Mutations/Subscription and the structure they return. 
// Should be kept in a seperate file where we can list out all the Type Definitions together.

const { gql } = require('apollo-server');

module.exports = gql`

    type Comment {
        id: ID!,
        body: String!,
        username: String!,
        createdAt: String!
    }

    type Like {
        id: ID!,
        username: String!,
        createdAt: String!
    }


    type Post{
        id: ID!,
        body: String!,
        createdAt: String!,
        username: String!,
        comments: [Comment]!,
        likes: [Like]!
    }

    type Query{
        getPosts: [Post]
        getPost (postId: ID!): Post
    }

    type User{
        id: ID!,
        email: String!,
        token: String!,
        createdAt: String!,
        username: String!,
    }
    input RegisterInput{
        username: String!,
        password: String!,
        confirmPassword: String!,
        email: String!
    }

    type Mutation{
        register (registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!
        createPost(body: String!): Post!
        deletePost(postId: ID!): String!
        createComment(postId: String!, body: String!): Post!
        deleteComment(postId: String!, commentId: String!): Post!
        likePost(postId: String!): Post!
    }

`;