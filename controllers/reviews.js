const Post = require('../models/post');
const Review = require('../models/review');

module.exports = {

    // Reviews Create
    async reviewCreate(req, res, next) {
        const post = await (await Post.findById(req.params.id)).execPopulate('reviews');
        // Restrict to 1 review per post
        const haveReviewed = post.reviews.filter(review => {
            return review.author.equals(req.user._id);
        }).length; // 1 if user already reviewed this post
        if (haveReviewed) {
            req.session.error = 'Sorry, you can only submit one review per post.';
            return res.redirect(`/posts/${post._id}`);
        }
        req.body.review.author = req.user._id;
        const reviewId = await Review.create(req.body.review);
        post.reviews.push(reviewId);
        await post.save();
        req.session.success = 'Review created successfully';
        res.redirect(`/posts/${post._id}`);
    },

    // Reviews Update
	async reviewUpdate(req, res, next) {
		await Review.findByIdAndUpdate(req.params.review_id, req.body.review);
        req.session.success = 'Review updated successfully!';
        res.redirect(`/posts/${req.params.id}`);
	},

    // Reviews Delete
    async reviewDelete(req, res, next) {
        await Post.findByIdAndUpdate(req.params.id, {
            $pull: { reviews: req.params.review_id }
        });
        await Review.findByIdAndDelete(req.params.review_id);
        req.session.success = 'Review deleted successfully';
        res.redirect(`/posts/${req.params.id}`);
    }
}

