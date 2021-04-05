const mongoose = require('mongoose');
const { Schema } = mongoose;
const Review = require('./review');
const paginate = require('mongoose-paginate');

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

postSchema.pre('remove', async function() {
    await Review.remove({
        _id: {
            $in: this.reviews
        }
    })
})

postSchema.plugin(paginate);

module.exports = mongoose.model('Post', postSchema);