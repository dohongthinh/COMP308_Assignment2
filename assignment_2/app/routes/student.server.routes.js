// Load the module dependencies
const student = require('../../app/controllers/student.server.controller');

// Define the routes module' method
module.exports = function (app) {
	// Mount the 'index' controller's 'render' method
	app.route('/')
		.get(student.render);
	// Set up the 'signup' routes
	app.route('/signup')
		.get(student.renderSignup)
		.post(student.signup);

	// Set up the 'signin' routes 
	app.route('/signin')
		.get(student.renderSignin)
		.post(student.signin);

	//display comment form
	app.route('/submit_comments')
		.get(student.display);

	app.route('/thankyou')
		.get(student.thankyou);

	//// Set up the 'signout' route
	//app.get('/signout', users.signout);
};