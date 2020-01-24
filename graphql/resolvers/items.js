//functions for items collection
const Item = require('../../models/Item');
const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');
const { AuthenticationError,UserInputError } = require('apollo-server');

module.exports = {
    Query: {
        async getItems() {
            try {
                const items = await Item.find().sort({createdAt: -1});
                return items;
            } catch (err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        async createItem(_, { body }, context) {
            const user = checkAuth(context);

            if(body.trim() === ''){
                throw new Error('Item body must not be empty');
            }

            const newItem = new Item({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString(),
                favorite: false
            })

            const item = await newItem.save();

            context.pubsub.publish('NEW_ITEM',{
                newItem:item
            });

            return item;
        },
        async deleteItem(_,{itemId}, context){
            const user = checkAuth(context);

            try{
                const item = await Item.findById(itemId);
                if(user.username === item.username){
                    await item.delete();
                    return 'Item deleted successfully';
                } else{
                    throw new AuthenticationError('Action not allowed');
                }
            } catch(err){
                throw new Error(err);
            }
        },
        //take a post and create a new item off of it
        async addItem(_,{postId},context){
            const post = await Post.findById(postId);

            if(post){
                const user = checkAuth(context);

                if(post.body.trim() === ''){
                    throw new Error('Item body must not be empty');
                 }

                const newItem = new Item({
                    body:post.body,
                    user: user.id,
                    username: user.username,
                    createdAt: new Date().toISOString(),
                    favorite: false
                })

                const item = await newItem.save();

                 context.pubsub.publish('NEW_ITEM',{
                     newItem:item
                });

                return item;
            }else{
                throw new UserInputError('Post not found');
            }
        },
        //change the body of an existing list item
        async updateItem(_,{itemId, body}, context){
            let item = await Item.findById(itemId);

            if(item){
                const user = checkAuth(context);

                if(body.trim() === ''){
                    throw new Error('Item body must not be empty');
                 }

                 Item.update({ _id:itemId},{body: body}, function (err, result) {
                    console.log('updating item body')
                 });
                
                 item.body = body;

                return item;
            } else{
                throw new UserInputError('Item not found');
            }
        },
        async favoriteItem(_,{itemId}, context){
            const {username} = checkAuth(context);

            const item = await Item.findById(itemId);
            if(item){
                //if it is marked as favorite, set it false, else set it true
                const fav = item.favorite ? false:true;
                //updating the database
                Item.update({ _id:itemId},{favorite: fav}, function (err, result) {
                    console.log('updating item favorite')
                 });
               
                item.favorite = fav;
                return item;
            } else{
                throw new UserInputError('Item not found');
            }
        }
        
    }
}
