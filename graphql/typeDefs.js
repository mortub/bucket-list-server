//definitions for graphql queries+mutations

const gql= require('graphql-tag');

module.exports = gql`
    type Post{
        id: ID!,
        body:String!,
        createdAt: String!
        username: String!
        comments:[Comment]!
        likes:[Like]!
        likeCount:Int!
        commentCount:Int!
    }
    type Item{
        id: ID!,
        body:String!,
        createdAt: String!
        username: String!,
        favorite: Boolean!
    }
    type Comment{
        id:ID!
        createdAt:String
        username:String!
        body:String!
    }
    type Like{
        id:ID!
        createdAt:String!
        username:String!
    }
    type User{
        id:ID!
        email:String!
        token:String!
        username:String!
        createdAt:String!
    }

    input RegisterInput{
        username: String!
        password:String!
        confirmPassword:String!
        email:String!
    }
    type Query{
        getPosts: [Post]
        getPost(postId: ID!): Post!
        getItems: [Item]
    }
    type Mutation{
        register(registerInput:RegisterInput) : User!
        login(username:String!, password:String!): User!
        createPost(body:String!): Post!
        deletePost(postId: ID!):String!
        createComment(postId:ID!, body:String!):Post!
        deleteComment(postId:ID!, commentId: ID!):Post!
        likePost(postId:ID!):Post!
        createItem(body:String!): Item!
        deleteItem(itemId: ID!):String!
        addItem(postId:ID!):Item!
        updateItem(itemId:ID!, body:String!): Item!
        favoriteItem(itemId:ID!): Item!
    }
    type Subscription{
        newPost:Post!
    }
`;
