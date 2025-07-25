const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController');


router = express.Router();
router.use(authController.protect);

router.post('/', authController.protect, bookingController.createBooking);

router.use(authController.restrictTo('admin', 'lead-guide'));

router
    .route('/')
    .get(bookingController.getAllBookings)
    .post(bookingController.createBookings);

router
    .route('/:id')
    .get(bookingController.getBooking)
    .patch(bookingController.updateBooking)
    .delete(bookingController.deleteBooking);

module.exports = router;