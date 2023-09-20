const express = require('express');
const viewController = require('../controllers/viewController');
const viewAuthController = require('../controllers/viewAuthController');
const authController = require('../controllers/authController');
// const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.use(viewController.alerts);

router.get('/', viewAuthController.isLoggedIn, viewController.getOverview);
router.get(
  '/tour/:slug',
  viewAuthController.isLoggedIn,
  viewController.getTour
);
router.get('/login', viewAuthController.isLoggedIn, viewController.loginForm);
router.get(
  '/sign-up',
  viewAuthController.isLoggedIn,
  viewController.signUpForm
);
router.get('/me', authController.protect, viewController.getAccount);
router.get(
  '/my-tours',
  // bookingController.createBookingCheckout,
  authController.protect,
  viewController.getMyTours
);

router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData
);

module.exports = router;
