//  Resolvers define what actions to be performed for each Type Definitions. In short they can be understood as function Definitions.

const Post = require('../../models/Post');

module.exports = {
    Query: {
        async getPosts() {
            try {
                // Fetching all posts from 'Posts' Collection
                const posts = await Post.find();
                return posts;
            }
            catch (err) {
                // Will throw an error if any issue in Query
                throw new Error(err);
            }
        }
    }
}