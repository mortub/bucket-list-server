//schema for an item
const { model, Schema} = require('mongoose');

const itemSchema = new Schema({
    body: String,
    username: String,
    createdAt:String,
    favorite: Boolean,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
});

module.exports = model('Item', itemSchema);

