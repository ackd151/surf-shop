const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
    title: String,
    price: String,
    description: String,
    images: [ { url: String, public_id: String} ],
    location: String,
    coordinates: Array,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review" 
        }
    ]
})

const Post = mongoose.model('Post', postSchema);

module.exports = Post;