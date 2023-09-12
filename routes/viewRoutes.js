const express = require('express');
const viewController = require('../controllers/viewController');
const viewAuthController = require('../controllers/viewAuthController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// router.use(viewAuthController.isLoggedIn);

router.get(
  '/',
  bookingController.createBookingCheckout,
  viewAuthController.isLoggedIn,
  viewController.getOverview
);
router.get(
  '/tour/:slug',
  viewAuthController.isLoggedIn,
  viewController.getTour
);
router.get('/login', viewAuthController.isLoggedIn, viewController.loginForm);
router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-tours', authController.protect, viewController.getMyTours);

router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData
);

module.exports = router;
