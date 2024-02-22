// const fs = require('fs');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

// const tours = JSON.parse(fs.readFileSync(`${__dirname}../../dev-data/data/tours-simple.json`));

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

/**
 * Get all tours.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getAllTours = async (req, res) => {
  try {
    // Execute the query
    const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
    const tours = await features.query;

    // Send response
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

/**
 * Create a new tour.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
  // // res.send('Done'); // always need to send back something to complete the request response cycle
};

/**
 * Get a specific tour by ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({ _id: req.params.id }) // same as above which is a shorthand

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'No tour found with that ID',
    });
  }
};

/**
 * Update a specific tour by ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'No tour found with that ID or invalid data sent!',
    });
  }
};

/**
 * Delete a specific tour by ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};
