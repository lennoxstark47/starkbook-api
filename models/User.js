const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		username: {
			type: String,
			min: 3,
			max: 20,
			unique: true,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			max: 50,
		},
		password: {
			type: String,
			required: true,
			min: 6,
		},
	},
	{ timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
