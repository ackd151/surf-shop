const Review = require('../models/review');

module.exports = {
    asyncErrorHandler: (fn) => 
        (req, res, next) => {
            Promise.resolve(fn(req, res, next)).catch(next);
    },
    isReviewAuthor: async (req, res, next) => {
        const review = await Review.findById(req.params.review_id);
        if (review.author.equals(res.locals.currentUser._id)) {
            return next();
        }
        req.session.error = 'Bye bye';
        return res.redirect('/');
    }
        

}