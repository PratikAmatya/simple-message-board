const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Handle errors
const handleErrors = (err) => {
	let errors = { userName: '', email: '', password: '' };
	console.log('ERROR CODE: ' + err.code);
	console.log('ERROR MESSAGE: ' + err.message);
	// For error handling
	if (err.message === 'Incorrect Email') {
		errors.email = 'The Email is not registered';
	}
	if (err.message === 'Incorrect Password') {
		errors.password = 'The entered Password is incorrect';
	}

	// duplicate error code
	if (err.code === 11000) {
		if (err.message.includes('userName')) {
			errors['userName'] = 'The provided user name is already registered';
		} else {
			errors['email'] = 'The provided email is already registered';
		}
	}

	// For validation errors
	if (err.message.includes('user validation failed')) {
		Object.values(err.errors).forEach(({ properties }) => {
			errors[properties.path] = properties.message;
		});
	}

	return errors;
};

// Create JWT
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
	return jwt.sign({ id }, process.env.SUPER_SECRET_KEY, { expiresIn: maxAge });
};

exports.signup_get = (req, res) => {
	res.render('signup');
};

exports.signup_post = async (req, res) => {
	try {
		const { userName, email, password } = req.body;
		console.log(userName, email, password);
		const user = await User.create({
			userName,
			email,
			password,
		});
		const token = createToken(user._id);
		res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
		res.status(201).json({ user: user._id });
	} catch (err) {
		const errors = handleErrors(err);
		res.status(400).json({ errors });
	}
};
