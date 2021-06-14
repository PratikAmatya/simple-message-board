const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
	userID: {
		type: String,
		unique: false,
		required: true,
		trim: true,
	},
	userName: {
		type: String,
		unique: false,
		required: true,
		trim: true,
		lowercase: true,
	},
	message: {
		type: String,
		unique: false,
		required: [true, 'Please enter the message for post'],
		trim: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('posts', postSchema);
