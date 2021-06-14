const Post = require('../models/Post');

// Handle errors
const handleErrors = (err) => {
	let errors = { userName: '', message: '' };
	console.log('ERROR CODE: ' + err.code);
	console.log('ERROR MESSAGE: ' + err.message);
	// For error handling

	if (err.message.includes('posts validation failed')) {
		Object.values(err.errors).forEach(({ properties }) => {
			errors[properties.path] = properties.message;
		});
	}
	return errors;
};

exports.messageBoard_get = (req, res) => {
	res.render('index');
};

exports.messageBoard_post = async (req, res) => {
	try {
		const { msg } = req.body;
		const { _id, userName } = res.locals.user;
		const post = await Post.create({
			userID: _id,
			userName,
			message: msg,
		});
		res.status(201).json(post);
	} catch (err) {
		const errors = handleErrors(err);
		res.status(400).json({ errors });
	}
};
