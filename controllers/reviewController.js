const Review = require('../models/reviewModel');
const Booking = require('../models/bookingModel');
const factory = require('./handlerFactoryController');
const AppError = require('../utils/appError');
const catchAsync = require('./../utils/catchAsync');

exports.nestedReviews = (req, res, next) => {
  if (req.params.tourId) req.query.tour = req.params.tourId;
  // req.query = {
  //   ...req.query,
  //   ...(req.params.tourId && { tour: req.params.tourId }),
  // };

  next();
};

// Allow nested routes
exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  req.body.user = req.user.id;

  next();
};

// Used when create a review
exports.checkIfBooked = catchAsync(async (req, res, next) => {
  const bookedTour = await Booking.findOne({
    user: req.body.user,
    tour: req.body.tour,
  });

  if (!bookedTour) {
    return next(new AppError('You not booked this tour!', 401));
  }

  next();
});

// Used when update or delete a review
exports.checkUserReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (req.user.role !== 'admin' && review.user.id !== req.user.id) {
    return next(new AppError("You can't manipulate another user review!", 403));
  }

  next();
});

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review, ['rating', 'review']);
exports.deleteReview = factory.deleteOne(Review);
