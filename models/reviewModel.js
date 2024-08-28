const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = mongoose.Schema(
    {
        review: { type: String, required: [true, 'Review can not be empty!'] },
        rating: { type: Number, min: 1, max: 5 },
        createdAt: { type: Date, default: Date.now },
        tour: { type: mongoose.Schema.ObjectId, ref: 'Tour', required: [true, 'Review must belong to a tour.'] },
        user: { type: mongoose.Schema.ObjectId, ref: 'User', required: [true, 'Review must belong to a user.'] }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

reviewSchema.statics.calcAverageRatings = async function(tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);
    if(stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsAverage: stats[0].avgRating,
            ratingsQuantity: stats[0].nRating
        });
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsAverage: 4.5,
            ratingsQuantity: 0
        });
    }
};

reviewSchema.index({ tour: 1, user: 1 }, { unique: 1 });


//POST MIDDLEWARE CAN NOT ACCESS TO NEXT FUNCTION !!!
reviewSchema.post('save', function() {
    // this points to Current Review
    this.constructor.calcAverageRatings(this.tour);
});

// WE CAN NOT use post with find or findOneAnd
reviewSchema.pre(/^findOneAnd/, async function(next) {
    this.r = await this.findOne();
    next();
});
reviewSchema.post(/^findOneAnd/, async function() {
    // await this.findOne(); dose not work here , query has already executed !!
    await this.r.constructor.calcAverageRatings(this.r.tour)

});

reviewSchema.pre(/^find/, function(next) {
    //we use populate to fill up guides field with all user data  ....for relationShip 
    // this.populate({ path: 'tour', select: 'name'})
    //     .populate({ path: 'user', select: 'name photo'})
    this.populate({ path: 'user', select: 'name photo'})
    next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;