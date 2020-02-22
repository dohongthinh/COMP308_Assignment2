
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