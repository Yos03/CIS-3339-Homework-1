const mongoose = require('mongoose');
const Student = require('./models/Student');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');

// Connects to MongoDB and makes sure every collection and index exists.
// MongoDB creates the database lazily, so an empty/nonexistent DB works with no setup.
async function connectDatabase(uri) {
  if (!uri) {
    throw new Error('MONGODB_URI is not defined. Check the .env file in the project root.');
  }
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  for (const model of [Student, Course, Enrollment]) {
    await model.createCollection().catch((err) => {
      if (err.codeName !== 'NamespaceExists') throw err;
    });
    await model.syncIndexes();
  }
}

module.exports = { connectDatabase };
