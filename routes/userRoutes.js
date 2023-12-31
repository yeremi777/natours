const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const bookingRouter = require('../routes/bookingRoutes');

const router = express.Router();

router.use('/:userId/bookings', bookingRouter);

router.post('/sign-up', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

router.patch('/update-password', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/update-me',
  userController.preventUpdatePassword,
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.deleteCurrentUserPhoto,
  userController.updateMe
);
router.delete('/delete-me', userController.deleteMe);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.preventUpdatePassword, userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
