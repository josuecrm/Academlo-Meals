const express = require('express');
const rateLimit = require('express-rate-limit');

// Routers
const { mealsRouter } = require('./routes/meals.routes');
const { ordersRouter } = require('./routes/orders.routes');
const { restaurantsRouter } = require('./routes/restaurants.routes');
const { usersRouter } = require('./routes/users.routes');

// Global err controller
const { globalErrorHandler } = require('./controllers/error.controller');

// Utils
const { AppError } = require('./utils/appError.util');

// Init express app
const app = express();

// Enable incoming JSON
app.use(express.json());

// Limit the number of requests that can be accepted to our server
const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000, // 1 hr
  message: 'Number of requests have been exceeded',
});

app.use(limiter);

// Define endpoints
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/orders', ordersRouter);
app.use('/api/v1/meals', mealsRouter);
app.use('/api/v1/restaurants', restaurantsRouter);

// Handle incoming unknown routes to the server
app.all('*', (req, res, next) => {
  next(
    new AppError(
      `${req.method} ${req.originalUrl} not found in this server`,
      404
    )
  );
});

app.use(globalErrorHandler);

module.exports = { app };
