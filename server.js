const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

// Handle uncaught exceptions
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
// console.log(process.env);

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
// as of mongoose v6, the below line is not required
// mongoose
//   .connect(DB, {
//     useNewUrlParser: true, // always considered to be true
//     useCreateIndex: true, // always considered to be true
//     useFindAndModify: false, // always considered to be false
//   })
//   .then(con => console.log(con, 'DB connection successful!'));

// Create a connection to the database
mongoose.connect(DB).then(() => console.log('DB connection successful!'));
// .catch(err => console.log(err));

// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
