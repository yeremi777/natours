const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

const filterObj = (obj, allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model, updateFields) =>
  catchAsync(async (req, res, next) => {
    let filteredBody;

    if (updateFields) {
      filteredBody = filterObj(req.body, updateFields);
    } else {
      filteredBody = req.body;
    }

    const doc = await Model.findByIdAndUpdate(req.params.id, filteredBody, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // const newData = new Model({});
    // newData.save();

    const newData = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: newData,
      },
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    // doc.reviews.map((item) => item.depopulate(depopulateOptions));

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sortData()
      .limitFields()
      .paginate();

    // const docs = await features.query.explain();
    const docs = await features.query.exec();
    const modelName = Model.modelName.toLowerCase();

    // if (docs.length === 0)
    //   return next(new AppError(`No ${modelName}s found!`, 404));

    res.status(200).json({
      status: 'success',
      result: docs.length,
      data: {
        [modelName]: docs,
      },
    });
  });
