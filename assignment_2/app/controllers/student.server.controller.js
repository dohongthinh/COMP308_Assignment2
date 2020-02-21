const Student = require('mongoose').model('Student');

// Create a new error handling controller method
const getErrorMessage = function (err) {
	// Define the error message variable
	var message = '';

	// If an internal MongoDB error occurs get the error message
	if (err.code) {
		switch (err.code) {
			// If a unique index error occurs set the message error
			case 11000:
			case 11001:
				message = 'Username already exists';
				break;
			// If a general error occurs set the message error
			default:
				message = 'Something went wrong';
		}
	} else {
		// Grab the first error message from a list of possible errors
		for (const errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	// Return the message error
	return message;
};

exports.render = function (req, res) {
	// Use the 'response' object to render the 'index' view with a 'title' and 'userFullName' properties
	res.render('index', {
		title: 'Course Evaluation'
	});
};

// Create a new controller method that renders the signup page
exports.renderSignup = function (req, res, next) {
	// If user is not connected render the signup page, otherwise redirect the user back to the main application page
	if (!req.student) {
		// Use the 'response' object to render the signup page
		res.render('signup', {
			// Set the page title variable
			title: 'Sign-up Form',
			// read the message from flash variable
			badmessage: req.flash('error') //passes the error stored in flash
		});
	} else {
		return res.redirect('/student');
	}
};

// Create a new controller method that creates new 'regular' users
exports.signup = function (req, res, next) {
	// Create a new instance of the 'User' Mongoose model
	const student = new Student(req.body);
	//store data in session
	var email = req.body.email;
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;

	var session = req.session;

	session.email = email;
	session.firstName = firstName;
	session.lastName = lastName;

	// Use the 'User' instance's 'save' method to save a new user document
	student.save((err) => {
		if (err) {
			// Call the next middleware with an error message
			return next(err);
		} else {
			// Use the 'response' object to send a JSON response
			//res.json(student);
			res.redirect('/student');
		}
	});
};

exports.display = function (req, res) {
	var session = req.session;
	req.student = session;
	var email = session.email;
	
	console.log(session.email);
	console.log(email);
	// Use the 'User' static 'find' method to retrieve the list of users
	Student.findOne({
		email: email
	}, (err, student) => {
		if (err) {
			// Call the next middleware with an error message
			return next(err);
		} else {
			student = req.student;
			// Use the 'response' object to send a JSON response
			res.render('students', {
				title: 'List A Student',
				student: student
			});
		}
	});
};

exports.commentsByStudent = function (req, res, next) {
	var email = req.session.email;
	//find the student then its comments using Promise mechanism of Mongoose
	Student.findOne({ email: email }, (err, student) => {
			if (err) { return getErrorMessage(err); }
			//
			req.id = student._id;
			console.log(req.id);
		}).then(function () {
			//find the posts from this author
			Comment.
				find({
					student: req.id
				}, (err, comments) => {
					if (err) { return getErrorMessage(err); }
					//res.json(comments);
					res.render('comments', {
						comments: comments, email: email
					});
				});
		});
};




