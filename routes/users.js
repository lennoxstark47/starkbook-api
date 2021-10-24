const express = require('express');

const router = express.Router();
const User = require('../models/User');

//registering a new user

router.post('/register', (req, res) => {
	const { username, email, password } = req.body;

	const newUser = new User({
		username,
		email,
		password,
	});
	newUser
		.save()
		.then((user) => {
			res.send(user);
		})
		.catch((err) => {
			res.status(400).json({ error: err });
		});
});

router.get('/', (req, res) => {
	res.send('welcome to user page');
});

module.exports = router;
