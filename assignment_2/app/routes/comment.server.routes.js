// Load the 'comment' controller
const comment = require('../controllers/comment.server.controller');

// Define the routes module' method
module.exports = function (app) {
	app.route('/submit_comments')
		.post(comment.addComment);
	app.route('/comments')
		.get(comment.commentsByStudent);
};