const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
	userName: {
		type: String,
		required: [true, 'Please enter an username'],
		trim: true,
		unique: true,
		lowercase: true,
	},
	email: {
		type: String,
		required: [true, 'Please enter an email'],
		trim: true,
		unique: true,
		lowercase: true,
		validate: [isEmail, 'Please enter a valid email'],
	},
	password: {
		type: String,
		required: [true, 'Please enter a password'],
		trim: true,
		minLenght: [6, 'Minimum password length is 6 characters'],
	},
});

userSchema.pre('save', async function (next) {
	const salt = await bcrypt.genSalt();
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

module.exports = mongoose.model('users', userSchema);
