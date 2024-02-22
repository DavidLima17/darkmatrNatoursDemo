const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}../../dev-data/data/tours-simple.json`));

exports.checkID = (req, res, next, val) => {
  // console.log(`Tour id is: ${val}`);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
};

/**
 * Get all tours.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

/**
 * Create a new tour.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.createTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, req.body);
  const newTour = { id: newId, ...req.body };
  tours.push(newTour);

  // use writeFile to not block the event loop since you are in a callback function
  fs.writeFile(`${__dirname}../../dev-data/data/tours-simple.json`, JSON.stringify(tours), () => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  });

  // res.send('Done'); // always need to send back something to complete the request response cycle
};

/**
 * Get a specific tour by ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getTour = (req, res) => {
  // console.log(req.params);

  const id = req.params.id * 1; // convert string to number
  const tour = tours.find(el => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

/**
 * Update a specific tour by ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

/**
 * Delete a specific tour by ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
