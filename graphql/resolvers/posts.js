//  Resolvers define what actions to be performed for each Type Definitions. In short they can be understood as function Definitions.
const Post = require('../../models/Post');
const checkAuth = require('../../util/auth');
const { AuthenticationError, UserInputError } = require('apollo-server');

module.exports = {
    Query: {
        // Handle All Posts Fetching
        async getPosts() {
            try {
                // Fetching all posts from 'Posts' Collection
                const posts = await Post.find().sort({ createdAt: -1 });
                return posts;
            }
            catch (err) {
                // Will throw an error if any issue in Query
                throw new Error(err);
            }
        },

        //  Handle single Post fetching
        async getPost(_, { postId }) {
            try {
                const post = await Post.findById(postId);

                if (post) {
                    return post;
                } else {
                    throw new Error('Post not found');
                }
            }
            catch (err) {
                throw new Error(err);
            }
        }
    },

    Mutation: {
        // Handle Create Post
        async createPost(_, { body }, context) {
            const user = checkAuth(context);

            if (body.trim() === '') {
                throw new Error('Post must not be empty');
            }

            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            })

            const post = await newPost.save();
            return post
        },

        // Handle Delete Post
        async deletePost(_, { postId }, context) {
            const user = checkAuth(context);

            const post = await Post.findById(postId)

            if (user.username === post.username) {
                await post.delete();
                return 'Post Deleted Successfully';
            }
            else {
                throw new AuthenticationError('You cannot delete this post');
            }
        },

        // Handle Likes

        async likePost(_, { postId }, context) {

            const user = checkAuth(context);

            const post = await Post.findById(postId);

            if (post) {
                if (post.likes.find(like => like.username === user.username)) {
                    // Post already Liked -- Unlike it
                    post.likes = post.likes.filter(like => like.username !== user.username);
                }
                else {
                    // Post Unliked -- Like it
                    post.likes.push({
                        username: user.username,
                        createdAt: new Date().toISOString()
                    })
                }

                await post.save();
                return post
            }
            else {
                throw new UserInputError('Post not found');
            }

        }

    }

}