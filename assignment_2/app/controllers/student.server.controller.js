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
		return res.redirect('/');
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
	var password = req.body.password;
	var favouriteSubject = req.body.favouriteSubject;
	var technicalSkill = req.body.technicalSkill;

	var session = req.session;

	session.email = email;
	session.firstName = firstName;
	session.lastName = lastName;
	session.password = password;
	session.favouriteSubject = favouriteSubject;
	session.technicalSkill = technicalSkill;
	// Use the 'User' instance's 'save' method to save a new user document
	student.save((err) => {
		if (err) {
			// Call the next middleware with an error message
			return next(err);
		} else {
			// Use the 'response' object to send a JSON response
			//res.json(student);
			var Id = student._id;
			session.Id = Id;
			res.redirect('/submit_comments');
		}
	});
};

// Create a new controller method that renders the signin page
exports.renderSignin = function (req, res, next) {
	// If user is not connected render the signin page, otherwise redirect the user back to the main application page
	if (!req.user) {
		// Use the 'response' object to render the signin page
		res.render('signin', {
			// Set the page title variable
			title: 'Sign-in Form',
			// Set the flash message variable
			messages: req.flash('error') || req.flash('info')
		});
	} else {
		return res.redirect('/');
	}
};
// signin
exports.signin = function (req, res, next) {	
	var email = req.body.email;
	var password = req.body.password;
	var session = req.session;
	session.email = email;
	session.password = password;
	//req.student = session;
	Student.findOne({ email: email, password:password }, (err, student) => {
		if (err) {
			return next(err);
		} else {
			if (student) {
				req.firstName = student.firstName;
				req.lastName = student.lastName;
				var _id = student._id;
				session._id = _id;
				res.render('submit_comments', {
					title: 'List A Student',
					student: student
				});
			} else {
				return res.redirect('/submit_comments');
			}
		}
	});
};

//display after signup or signin
exports.display = function (req, res) {
	var session = req.session;
	req.student = session;
	var email = session.email;

	Student.findOne({
		email: email
	}, (err, student) => {
		if (err) {
			// Call the next middleware with an error message
			return next(err);
		} else {
			student = req.student;
			req.firstName = student.firstName;
			req.lastName = student.lastName;
			// Use the 'response' object to send a JSON response
			res.render('submit_comments', {
				title: 'List A Student',
				student: student
			});
		}
	});
};

exports.thankyou = function (req, res) {
	//make a reference to the session object
	var session = req.session;
	//check if email is stored in session object
	if (session.email) {
		res.write('<h1>Thank you ' + session.email + '</h1><br>');
		res.write('<h4>Please go back to main menu to view your comments</h4><br>');
		res.end('<a href=' + '/logout' + '>Logout</a>');
	}
	else {
		res.write('<h1>Please login first.</h1>');
		res.end('<a href=' + '/' + '>Login</a>');
	}

};

exports.viewAll = function (req, res, next) {
	// Use the 'User' static 'find' method to retrieve the list of users
	Student.find({}, (err, students) => {
		if (err) {
			// Call the next middleware with an error message
			return next(err);
		} else {
			// Use the 'response' object to send a JSON response
			res.render('students', {
				title: 'List All Students',
				students: students
			});
		}
	});
};





