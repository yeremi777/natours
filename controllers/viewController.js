const Tour = require('../models/tourModel');
const Review = require('../models/reviewModel');
// const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const allSoldOut = (startDates) => {
  const result = startDates.every((item) => {
    if (item.soldOut === true) {
      return true;
    }
    return false;
  });

  return result;
};

exports.alerts = (req, res, next) => {
  const { alert } = req.query;

  if (alert === 'booking') {
    res.locals.alert =
      "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up, please contact us.";
  }

  next();
};

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1. Get tour data from collection
  const tours = await Tour.find();

  // 2. Build template
  // 3. Render that template using tour data

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1. Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  const isFull = allSoldOut(tour.startDates);

  // 2. Check if tour has been booked and has a review (used when user already login)
  const booking = await Booking.findOne({
    user: res.locals.user,
    tour: tour,
  });
  const booked = !!booking;
  let commentExist;

  if (res.locals.user) {
    commentExist = tour.reviews.some(
      (review) => review.user.id === res.locals.user.id
    );
  }

  // 3. Build template
  // 4. Render template using data from step 1
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
    booked,
    commentExist,
    isFull,
  });
});

exports.loginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log In',
  });
};

exports.signUpForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign Up',
  });
};

exports.getAccount = (req, res) => {
  // if (!res.locals.user) {
  //   return res.status(401).render('error', {
  //     title: 'Something went wrong',
  //     msg: 'You are not logged in! Please log in to get access.',
  //   });
  // }

  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1. Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2. Find tours with the returned Ids
  const tourIds = bookings.map((item) => item.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});

exports.getMyReviews = catchAsync(async (req, res, next) => {
  // Find all reviews
  const reviews = await Review.find({ user: req.user.id }).populate({
    path: 'tour',
    select: 'name slug',
  });

  res.status(200).render('reviews', {
    title: 'My Reviews',
    reviews,
  });
});

// Update user data with html form submit (not api)
// exports.updateUserData = catchAsync(async (req, res, next) => {
//   const updatedUser = await User.findByIdAndUpdate(
//     req.user.id,
//     {
//       name: req.body.name,
//       email: req.body.email,
//     },
//     { new: true, runValidators: true }
//   );

//   res.status(200).render('account', {
//     title: 'Your account',
//     user: updatedUser,
//   });
// });
