const Post = require('../../models/Post');
const checkAuth = require('../../util/auth');
const { AuthenticationError, UserInputError, } = require('apollo-server');


module.exports = {
    Mutation: {
        createComment: async (_, { postId, body }, context) => {
            const user = checkAuth(context);

            if (body.trim() === '') {
                throw new UserInputError('Empty comment', {
                    errors: {
                        body: 'Comment must not be empty'
                    }
                })
            }

            const post = await Post.findById(postId);

            if (post) {
                post.comments.unshift({
                    body,
                    username: user.username,
                    createdAt: new Date().toISOString()
                })
                await post.save();
                return post
            }
            else {
                throw new UserInputError('Post not found');
            }
        },

        deleteComment: async (_, { postId, commentId }, context) => {
            const user = checkAuth(context);

            const post = await Post.findById(postId);

            if (post) {
                // Finding commment Index to delete
                const commentIndex = post.comments.findIndex(comment => comment.id === commentId);

                // Delete Only If the Comment is made by Logged in User
                if (post.comments[commentIndex].username === user.username) {
                    post.comments.splice(commentIndex, 1);
                    await post.save();
                    return post;
                }
                else {
                    throw new AuthenticationError("Can't Delete this post");
                }
            }

        }
    }


}