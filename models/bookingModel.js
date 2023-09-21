const mongoose = require('mongoose');
const Tour = require('./tourModel');
const AppError = require('../utils/appError');

const bookingSchema = new mongoose.Schema(
  {
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Booking must belong to a Tour!'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a User!'],
    },
    date: {
      type: mongoose.Schema.ObjectId,
      required: [true, 'Booking must have a date'],
    },
    price: {
      type: Number,
      required: [true, 'Booking must have a price'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    paid: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        delete ret.tour.durationWeeks;
        delete ret.tour.id;

        const startDate = doc.tour.startDates.id(doc.date);
        ret.date = startDate.date;

        delete ret.tour.startDates;

        return ret;
      },
    },
  }
);

bookingSchema.index({ tour: 1, user: 1 }, { unique: true });

bookingSchema.pre('save', async function (next) {
  const tour = await Tour.findById(this.tour);
  const startDate = tour.startDates.id(this.date);

  if (startDate.participants >= tour.maxGroupSize) {
    return next(
      new AppError(
        'Sorry this tour has already full participants. Please book another tour',
        403
      )
    );
  }

  startDate.participants += 1;
  await tour.save();
  next();
});

bookingSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name startDates',
  });

  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
