const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
    title: String,
    price: String,
    description: String,
    images: [ String ],
    location: String,
    let: Number,
    lng: Number,
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

modeule.exports = Post;