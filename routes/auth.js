const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');

//registering a new user

router.post('/register', (req, res) => {
	const { username, email, password } = req.body;

	const newUser = new User({
		username,
		email,
		password: bcrypt.hashSync(password, 10),
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

//login
router.post('/login', (req, res) => {
	const { email, password } = req.body;
	User.findOne({ email: email })
		.then((user) => {
			if (!user) {
				res.status(400).send('Invalid Email');
			}
			if (
				user &&
				bcrypt.compareSync(password, user.password)
			) {
				res.send(user);
			} else
				res.status(400).send('Password is wrong');
		})
		.catch((err) => {
			res.status(500).json({ Error: err });
		});
});

module.exports = router;
