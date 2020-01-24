//brings together all resolvers for graphql
const postsResolvers = require('./posts');
const usersResolvers = require('./users');
const commentsResolvers = require('./comments');
const itemsResolvers = require('./items');

module.exports = {
    Post:{
        likeCount:(parent) => parent.likes.length,
        commentCount:(parent) => parent.comments.length
    },
    Query:{
        ...postsResolvers.Query,
        ...itemsResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentsResolvers.Mutation,
        ...itemsResolvers.Mutation
    },
    Subscription:{
        ...postsResolvers.Subscription
    }
}