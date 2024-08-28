const Booking = require('../models/bookingModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.createBooking = catchAsync(async (req, res, next) => {
    const user = req.user;
    const { tourId, price } = req.body;

    if(!tourId || !price) return next( new AppError('Invalid Data sent', 400));

    await Booking.create({ tour: tourId, user: user.id, price })

    res.status(201).json({
        status: 'success',
        message: 'Booking Created Successfully!'
    });
});

exports.createBookings = factory.createOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);