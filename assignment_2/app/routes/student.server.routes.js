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
	app.route('/student')
		.get(student.display);

	//// Set up the 'signin' routes 
	//app.route('/signin')
	//	.get(student.renderSignin)
	//	/*.post(passport.authenticate('local', {
	//		successRedirect: '/',
	//		failureRedirect: '/signin',
	//		failureFlash: true
	//	}));*/
	//	.post(student.signin);

	//// Set up the 'signout' route
	//app.get('/signout', users.signout);
};