const { unlink, existsSync } = require('fs');
const { promisify } = require('util');
const moment = require('moment');
const multer = require('multer');
const mime = require('mime-types');
const sharp = require('sharp');
const Tour = require('./../models/tourModel');
const factory = require('./handlerFactoryController');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.resizeTourImages = async (req, res, next) => {
  if (!req.files) return next();

  if (req.files.imageCover !== undefined && req.files.imageCover.length > 0) {
    // 1. Cover Image
    const imgCoverExt = mime.extension(req.files.imageCover[0].mimetype);
    req.body.imageCover = `tour-${
      req.params.id
    }-${Date.now()}-cover.${imgCoverExt}`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat(imgCoverExt)
      .jpeg({ quality: 90 })
      .toFile(`public/img/tours/${req.body.imageCover}`);
  }

  if (req.files.images !== undefined && req.files.images.length > 0) {
    // 2. Images
    req.body.images = [];

    await Promise.all(
      req.files.images.map(async (file, i) => {
        const imgExt = mime.extension(file.mimetype);
        const filename = `tour-${req.params.id}-${Date.now()}-${
          i + 1
        }.${imgExt}`;

        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat(imgExt)
          .jpeg({ quality: 90 })
          .toFile(`public/img/tours/${filename}`);

        req.body.images.push(filename);
      })
    );
  }

  next();
};

exports.deleteCurrentTourImages = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  const tour = await Tour.findById(req.params.id);

  if (
    req.files.imageCover !== undefined &&
    tour.imageCover &&
    existsSync(`public/img/tours/${tour.imageCover}`)
  ) {
    await promisify(unlink)(`public/img/tours/${tour.imageCover}`);
  }

  if (
    req.files.images !== undefined &&
    tour.images.length > 0 &&
    existsSync(`public/img/tours/${tour.images[0]}`)
  ) {
    tour.images.forEach(async (image) => {
      await promisify(unlink)(`public/img/tours/${image}`);
    });
  }

  next();
});

exports.aliasTopCheapTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        // _id: null,
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: { stats },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
        // monthString: {
        //   $arrayElemAt: [
        //     [
        //       '',
        //       'January',
        //       'February',
        //       'March',
        //       'April',
        //       'May',
        //       'June',
        //       'July',
        //       'August',
        //       'September',
        //       'October',
        //       'November',
        //       'December',
        //     ],
        //     '$_id',
        //   ],
        // },
        monthString: {
          $arrayElemAt: [moment.months(), { $subtract: ['$_id', 1] }],
        },
      },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { numToursStarts: -1 },
    },
    // {
    //   $limit: 12,
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: { plan },
  });
});

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  // if unit = miles, then distance / 3963.2, if unit = kilometers, then distance / 6378.1
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng',
        400
      )
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  // if unit = miles, then multiplier = 0.000621371, if unit = kilometers, then multiplier = 0.001
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng',
        400
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: { distances },
  });
});
