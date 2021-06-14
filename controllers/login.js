const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Handle errors
const handleErrors = (err) => {
	let errors = { email: '', password: '' };
	console.log('ERROR CODE: ' + err.code);
	console.log('ERROR MESSAGE: ' + err.message);
	// For error handling
	if (err.message === 'Incorrect Email') {
		errors.email = 'The Email is not registered';
	}
	if (err.message === 'Incorrect Password') {
		errors.password = 'The entered Password is incorrect';
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

// Verify User Credentials
const verifyLogin = async (email, password) => {
	const user = await User.findOne({ email: email });
	if (user) {
		// Comparing passwords
		const auth = await bcrypt.compare(password, user.password);
		if (auth) {
			return user;
		}
		throw Error('Incorrect Password');
	}
	throw Error('Incorrect Email');
};

exports.login_get = (req, res) => {
	res.render('login');
};

exports.login_post = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await verifyLogin(email, password);
		const token = createToken(user);
		res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
		res.status(200).json({ user: user._id });
	} catch (err) {
		const errors = handleErrors(err);
		res.status(400).json({ errors });
	}
};
