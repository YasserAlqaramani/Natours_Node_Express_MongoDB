const express = require('express');
const viewController = require('./../controllers/viewsController');
const authController = require('./../controllers/authController');


router = express.Router();


router.get('/', authController.isLoggedIn, viewController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.login);
router.get('/signup', authController.isLoggedIn, viewController.signUp);
router.get('/me', authController.protect, viewController.getAccount);
router.post('/submit-user-data', authController.protect, viewController.updateUserData);
router.get('/my-tours', authController.protect, viewController.getMyTours);
router.get('/my-reviews', authController.protect, viewController.getMyReviews);
router.get('/my-reviews/:reviewId', authController.protect, viewController.getReviewToEdit);

router.get('/booking/:slug', authController.isLoggedIn, viewController.bookingTour);

module.exports = router;