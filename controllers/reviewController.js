const Review = require('../models/reviewModel');
const factory = require('./handlerFactoryController');
// const catchAsync = require('./../utils/catchAsync');

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  req.body.user = req.user.id;

  next();
};

exports.nestedReviews = (req, res, next) => {
  if (req.params.tourId) req.query.tour = req.params.tourId;
  // req.query = {
  //   ...req.query,
  //   ...(req.params.tourId && { tour: req.params.tourId }),
  // };

  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
