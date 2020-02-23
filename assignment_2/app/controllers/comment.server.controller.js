const Comment = require('mongoose').model('Comment');
const Student = require('mongoose').model('Student');

exports.addComment = function (req, res, next) {
	// Create a new instance of the 'Comment' Mongoose model
	var session = req.session;
	const newComment = new Comment(req.body);

	var courseCode = req.body.courseCode;
	var courseName = req.body.courseName;
	var program = req.body.program;
	var semester = req.body.semester;
	var comment = req.body.comment;
	var date = req.body.date;
	newComment.student = session._id;
	//store data in session
	session.courseCode = courseCode;
	session.courseName = courseName;
	session.program = program;
	session.semester = semester;
	session.date = date;
	session.comment = comment;

	newComment.save((err) => {
		if (err) {
			return next(err);
		} else {
			res.redirect('/thankyou');
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