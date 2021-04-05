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
    ],
    avgRating: {
        type: Number,
        default: 0
    }
})

// Cascade on delete
postSchema.pre('remove', async function() {
    await Review.remove({
        _id: {
            $in: this.reviews
        }
    })
})

// Instance method to calculate average reviews
postSchema.methods.calculateAvgRating = function() {
    let ratingsTotal = 0;
    if (this.reviews.length) {
        for (let review of this.reviews) {
            ratingsTotal += review.rating;
        }
        this.avgRating = Math.round((ratingsTotal / this.reviews.length) * 10) / 10;
    } else {
        this.avgRating = 0;
    }
    const floorRating = Math.floor(this.avgRating);
    this.save();
    return floorRating;
}

postSchema.plugin(paginate);

module.exports = mongoose.model('Post', postSchema);