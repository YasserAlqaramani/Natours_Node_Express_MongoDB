const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const Review = require('../models/reviewModel');

exports.getOverview = catchAsync(async (req, res, next) => {

    const tours = await Tour.find();

    res.status(200).render('overview', {
        title: 'All Tours',
        tours
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
    const user = req.user;

    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user'
    });

    if(!tour) return next(new AppError('There is no tour with that name', 404));

    let review;
    let booking;
    if(user) {
        review = await Review.findOne({ user: user._id, tour: tour._id });
        booking = await Booking.findOne({ user: user._id, tour: tour._id });
    }

    let context = {
        title: tour.name,
        tour
    }
    if(!review && booking) context['reviewed'] = true;
    if(booking) context['booking'] = true;
    
    res.status(200).render('tour', context);
});

exports.login = (req, res,) => {
    res.status(200).render('login', {
        title: 'Log into your account'
    })
};

exports.signUp = (req, res,) => {
    res.status(200).render('signup', {
        title: 'create your account'
    })
};

exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'Your Account'
    })
}

exports.updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        email: req.body.email
    },{
        new: true,
        runValidators: true
    });

    res.status(200).render('account', {
        title: 'Your Account',
        user: updatedUser
    })
});

exports.bookingTour = catchAsync(async (req, res, next) => {
    const { slug } = req.params;

    const tour = await Tour.findOne({ slug });
    if(!tour) return next(new AppError('Tour with that Id is not found', 404));

    res.status(200).render('booking', {
        title: `${tour.name} Booking`,
        tour
    })
});

exports.getMyTours = catchAsync(async (req, res, next) => {
    const bookings = await Booking.find({ user: req.user.id });
    const tourIds = bookings.map(el => el.tour);
    const tours = await Tour.find({ _id: { $in: tourIds } });

    res.status(200).render('overview', {
        title: 'My Tours',
        tours
    })
});

exports.getMyReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find({ user: req.user.id }).populate({
        path: 'tour',
        select: 'imageCover name'
    });
    res.status(200).render('myReview', {
        title: 'My Reviews',
        reviews
    })
});

exports.getReviewToEdit = catchAsync(async (req, res, next) => {
    const { reviewId } = req.params;
    const review = await Review.findOne({ _id: reviewId });
    res.status(200).render('editReview', {
        title: 'Edit Reviews',
        review
    })
});