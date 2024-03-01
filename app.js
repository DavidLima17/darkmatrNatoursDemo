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
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json()); // Middleware to parse the body of the request
app.use(express.static(`${__dirname}/public`)); // Middleware to serve static files

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.statusCode = 404;
  // err.status = 'fail';
  // next(err);
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

// Start server
module.exports = app;
