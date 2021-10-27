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
		profilePicture: {
			type: String,
			default: '',
		},
		coverPicture: {
			type: String,
			default: '',
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		followers: {
			type: Array,
			default: [],
		},
		following: {
			type: Array,
			default: [],
		},
		desc: {
			type: String,
			max: 50,
		},
		city: {
			type: String,
			max: 50,
		},
		from: {
			type: String,
			max: 50,
		},
		relationship: {
			type: Number,
			enum: [1, 2, 3],
		},
	},
	{ timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
