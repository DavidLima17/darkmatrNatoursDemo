/**
 * @fileoverview This file contains the implementation of a Node.js server using Express framework.
 * It defines routes for handling GET and POST requests related to tours.
 * The server listens on a specified port for incoming requests.
 * The data for tours is read from a JSON file and stored in memory.
 * The server responds with JSON data for successful requests.
 *
 * @requires express
 * @requires fs
 */

const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json()); // Middleware to parse the body of the request

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

/**
 * Get all tours.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
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
const createTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  // use writeFile to not block the event loop since you are in a callback function
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
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
const getTour = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1; // convert string to number
  const tour = tours.find(el => el.id === id);
  // if (id > tours.length) {
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

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
const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

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
const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// app.get('/api/v1/tours');
// app.get('/api/v1/tours/:id');
// app.post('/api/v1/tours');
// app.patch('/api/v1/tours/:id');
// app.delete('/api/v1/tours/:id');

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
