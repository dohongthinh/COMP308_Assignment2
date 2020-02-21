// Load the module dependencies
const config = require('./config');
const mongoose = require('mongoose');

// Define the Mongoose configuration method
module.exports = function () {
	// Use Mongoose to connect to MongoDB
	const db = mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true });
	mongoose.set('useNewUrlParser', true);
	mongoose.set('useFindAndModify', false);
	mongoose.set('useCreateIndex', true);

	// Load the  model 
	require('../app/models/comments.server.model');
	require('../app/models/student.server.model');

	// Return the Mongoose connection instance
	return db;
};