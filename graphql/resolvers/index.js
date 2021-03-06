// There should be seperate resolvers for Action/Modules/Roles and should be merged togther in 1 file to export in Main file (index.js).
// Merging all the resolvers here.

const postsResolvers = require('./posts');
const usersResolvers = require('./users');
const commentsResolvers = require('./comments');

module.exports = {
    Query: {
        ...postsResolvers.Query,
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentsResolvers.Mutation
    }
}